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
            'deposit_method' => 'required|in:cash,credit_card,debit,transfer',
            'notes' => 'nullable|string',
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

            // 2. Validasi Kamar (Harus Vacant Clean / VC)
            $room = Room::find($request->room_id);
            if ($room->status !== 'vc') {
                return response()->json([
                    'success' => false,
                    'message' => 'Kamar #' . $room->room_number . ' sedang tidak siap huni (Status: ' . strtoupper($room->status) . '). Harap pilih kamar yang berstatus VC.'
                ], 400);
            }

            // 3. Simpan data Check-in
            $checkIn = CheckIn::create([
                'reservation_id' => $reservation->id,
                'room_id' => $room->id,
                'check_in_time' => Carbon::now(),
                'deposit_amount' => $request->deposit_amount,
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
            $folioNumber = 'FOLIO-' . $room->room_number . '-' . Carbon::now()->format('YmdHis');
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
