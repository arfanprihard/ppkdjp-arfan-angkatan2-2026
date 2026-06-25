<?php

namespace App\Http\Controllers;

use App\Models\CheckIn;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\GuestFolio;
use App\Models\FolioCharge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CheckInController extends Controller
{
    /**
     * Menampilkan daftar kedatangan (expected arrivals) hari ini.
     * Yaitu reservasi yang dijadwalkan check-in hari ini dan belum check-in.
     */
    public function expectedArrivals()
    {
        $today = Carbon::today()->toDateString();
        $arrivals = Reservation::with(['guest', 'roomType'])
            ->whereDate('check_in_date', $today)
            ->whereIn('status', ['confirmed', 'pending'])
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar kedatangan hari ini berhasil diambil.',
            'data' => $arrivals
        ], 200);
    }

    /**
     * Memproses Check-in Tamu.
     */
    public function store(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'room_id' => 'required|exists:rooms,id',
            'deposit_amount' => 'required|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'deposit_method' => 'required|in:cash,credit_card,debit,transfer',
            'notes' => 'nullable|string',
            'check_in_time' => 'nullable|date',
            'extra_bed' => 'nullable|boolean',
            'extra_bed_price' => 'nullable|numeric|min:0',
        ]);

        // Menggunakan Database Transaction agar jika salah satu langkah gagal, semua dibatalkan (aman)
        return DB::transaction(function () use ($request) {

            // 1. Validasi Reservasi
            $reservation = Reservation::with('roomType')->find($request->reservation_id);
            if (!in_array($reservation->status, ['confirmed', 'pending'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reservasi ini tidak dapat di-check-in karena berstatus: ' . strtoupper($reservation->status)
                ], 400);
            }

            // Validasi Pelunasan Penuh (Tidak boleh DP/Down Payment)
            $extraBedPrice = $request->extra_bed ? floatval($request->extra_bed_price ?? 100000) : 0;
            $expectedTotal = floatval($reservation->total_amount) + $extraBedPrice;

            if (abs(floatval($request->deposit_amount) - $expectedTotal) > 0.01) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pembayaran harus dilunasi secara penuh sebesar Rp ' . number_format($expectedTotal, 0, ',', '.') . ' saat check-in.'
                ], 400);
            }

            // 2. Validasi Kamar (Harus Vacant Clean / VC)
            $room = Room::find($request->room_id);
            if ($room->status !== 'vc') {
                return response()->json([
                    'success' => false,
                    'message' => 'Kamar #' . $room->room_number . ' sedang tidak siap huni (Status: ' . strtoupper($room->status) . '). Harap pilih kamar yang berstatus VC.'
                ], 400);
            }

            // 3. Simpan data Check-in
            $checkInTime = $request->check_in_time ? Carbon::parse($request->check_in_time) : Carbon::now();
            $checkIn = CheckIn::create([
                'reservation_id' => $reservation->id,
                'room_id' => $room->id,
                'check_in_time' => $checkInTime,
                'deposit_amount' => $request->deposit_amount,
                'security_deposit' => $request->security_deposit ?? 300000.00,
                'deposit_method' => $request->deposit_method,
                'processed_by' => $request->user()->id,
                'notes' => $request->notes,
            ]);

            // 4. Ubah status kamar fisik menjadi Occupied Clean (OC)
            $room->update(['status' => 'oc']);

            // 5. Update data Reservasi (Status jadi checked_in dan tautkan kamar fisiknya)
            $reservation->update([
                'status' => 'checked_in',
                'room_id' => $room->id
            ]);

            // 6. Buat Guest Folio otomatis
            $folioNumber = 'FL-' . $room->room_number . '-' . Carbon::now()->format('mdHis');
            $folio = GuestFolio::create([
                'check_in_id' => $checkIn->id,
                'guest_id' => $reservation->guest_id,
                'folio_number' => $folioNumber,
                'status' => 'open',
                'total_charges' => 0,
                'total_payments' => $request->deposit_amount, // Deposit dihitung sebagai pembayaran masuk awal
                'balance' => -$request->deposit_amount, // Saldo minus berarti tamu memiliki kelebihan pembayaran (deposit)
            ]);

            // 7. Masukkan Room Charge (Biaya Sewa Kamar) otomatis ke dalam Folio
            $nights = Carbon::parse($reservation->check_in_date)->diffInDays(Carbon::parse($reservation->check_out_date));
            $roomChargeAmount = $reservation->total_amount; // Total harga kamar selama menginap

            FolioCharge::create([
                'folio_id' => $folio->id,
                'charge_type' => 'room',
                'description' => 'Room Charge ' . $nights . ' Night(s) - Kamar #' . $room->room_number,
                'amount' => $roomChargeAmount,
                'quantity' => 1,
                'charge_date' => Carbon::today(),
                'created_by' => $request->user()->id,
            ]);

            // 8. Hitung ulang total biaya dan balance pada Folio
            $folio->increment('total_charges', $roomChargeAmount);

            // Tambah charge extra bed jika dipesan saat checkin
            if ($request->extra_bed) {
                FolioCharge::create([
                    'folio_id' => $folio->id,
                    'charge_type' => 'extra_bed',
                    'description' => 'Extra Bed Charge - Kamar #' . $room->room_number,
                    'amount' => $extraBedPrice,
                    'quantity' => 1,
                    'charge_date' => Carbon::today(),
                    'created_by' => $request->user()->id,
                ]);
                $folio->increment('total_charges', $extraBedPrice);

                // Buat task Housekeeping untuk mengantar extra bed
                \App\Models\HousekeepingTask::create([
                    'room_id' => $room->id,
                    'task_type' => 'extra_bed',
                    'priority' => 'medium',
                    'status' => 'pending',
                    'notes' => 'Siapkan dan antarkan extra bed ke Kamar #' . $room->room_number . ' (dipesan saat check-in).'
                ]);
            }

            $folio->refresh();
            $folio->update([
                'balance' => $folio->total_charges - $folio->total_payments
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Check-in berhasil untuk tamu ' . $reservation->guest->name . ' di Kamar #' . $room->room_number . '.',
                'data' => [
                    'check_in' => $checkIn,
                    'folio_number' => $folio->folio_number,
                    'room_charge' => $roomChargeAmount,
                    'deposit' => $request->deposit_amount
                ]
            ], 201);
        });
    }

    }
}
