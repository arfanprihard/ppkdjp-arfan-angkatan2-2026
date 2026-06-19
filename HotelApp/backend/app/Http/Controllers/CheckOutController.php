<?php

namespace App\Http\Controllers;

use App\Models\CheckOut;
use App\Models\CheckIn;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\GuestFolio;
use App\Models\HousekeepingTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CheckOutController extends Controller
{
    /**
     * Tampilkan daftar tamu yang dijadwalkan checkout hari ini.
     */
    public function expectedDepartures()
    {
        $today = Carbon::today()->toDateString();
        $departures = Reservation::with(['guest', 'room', 'roomType'])
            ->whereDate('check_out_date', $today)
            ->where('status', 'checked_in')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $departures
        ], 200);
    }

    /**
     * Memproses Checkout Tamu dan Settlement Pembayaran.
     */
    public function store(Request $request)
    {
        $request->validate([
            'check_in_id' => 'required|exists:check_ins,id',
            'payment_method' => 'required|in:cash,credit_card,debit,transfer,city_ledger',
            'feedback_rating' => 'nullable|integer|min:1|max:5',
            'feedback_notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request) {
            $checkIn = CheckIn::find($request->check_in_id);
            if (!$checkIn) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data Check-in tidak ditemukan.'
                ], 404);
            }

            // Cegah double checkout
            $alreadyCheckedOut = CheckOut::where('check_in_id', $checkIn->id)->exists();
            if ($alreadyCheckedOut) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tamu sudah melakukan checkout sebelumnya.'
                ], 400);
            }

            $reservation = Reservation::find($checkIn->reservation_id);
            if (!$reservation || $reservation->status !== 'checked_in') {
                return response()->json([
                    'success' => false,
                    'message' => 'Reservasi ini tidak aktif atau tidak sedang checked-in.'
                ], 400);
            }

            $room = Room::find($checkIn->room_id);
            $folio = GuestFolio::where('check_in_id', $checkIn->id)->where('status', 'open')->first();

            if (!$folio) {
                return response()->json([
                    'success' => false,
                    'message' => 'Folio tagihan tidak ditemukan atau sudah ditutup.'
                ], 400);
            }

            // Jika masih ada sisa tagihan (balance > 0), lakukan auto-settle (pelunasan)
            $totalBill = $folio->total_charges;
            $totalPaid = $folio->total_payments;
            $balance = $folio->balance;

            if ($balance > 0) {
                // Catat sisa pembayaran
                $folio->increment('total_payments', $balance);
                $totalPaid += $balance;
            }

            $folio->update([
                'balance' => 0,
                'status' => 'settled'
            ]);

            // 1. Buat record CheckOut
            $checkOut = CheckOut::create([
                'check_in_id' => $checkIn->id,
                'check_out_time' => Carbon::now(),
                'total_bill' => $totalBill,
                'total_paid' => $totalPaid,
                'payment_method' => $request->payment_method,
                'processed_by' => $request->user()->id,
                'feedback_rating' => $request->feedback_rating,
                'feedback_notes' => $request->feedback_notes,
            ]);

            // 2. Ubah status reservasi menjadi checked_out
            $reservation->update(['status' => 'checked_out']);

            // 3. Ubah status kamar fisik menjadi Vacant Dirty (VD)
            $room->update(['status' => 'vd']);

            // 4. Otomatis buat task Housekeeping (Room Cleaning) prioritas Medium
            HousekeepingTask::create([
                'room_id' => $room->id,
                'task_type' => 'room_cleaning',
                'priority' => 'medium',
                'status' => 'pending',
                'notes' => 'Tamu checkout. Bersihkan kamar untuk tamu berikutnya.'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Checkout berhasil. Kamar #' . $room->room_number . ' kini berstatus VD dan tugas pembersihan telah dikirim ke Housekeeping.',
                'data' => $checkOut
            ], 200);
        });
    }
}
