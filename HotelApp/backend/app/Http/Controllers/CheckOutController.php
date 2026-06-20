<?php

namespace App\Http\Controllers;

use App\Models\CheckOut;
use App\Models\CheckIn;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\GuestFolio;
use App\Models\FolioCharge;
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
            'feedback_notes' => 'nullable|string',
            'room_inspected' => 'boolean',
            'damage_charges' => 'nullable|array',
            'damage_charges.*.item_name' => 'required_with:damage_charges|string',
            'damage_charges.*.amount' => 'required_with:damage_charges|numeric|min:0',
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

            // Enforce housekeeping inspection check
            $inspectionTask = HousekeepingTask::where('room_id', $checkIn->room_id)
                ->where('task_type', 'room_inspection')
                ->where('created_at', '>=', $checkIn->check_in_time)
                ->where('status', '!=', 'cancelled')
                ->latest()
                ->first();

            if (!$inspectionTask || $inspectionTask->status !== 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Checkout tidak dapat diproses. Kamar harus diperiksa (inspeksi) terlebih dahulu oleh divisi Housekeeping.'
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

            // Hitung deposit refund
            $depositAmount = floatval($checkIn->security_deposit ?? 300000.00);
            $depositRefund = max(0, $depositAmount - max(0, $balance));

            // Cari denda kerusakan/kehilangan dari folio
            $totalDamageCharges = FolioCharge::where('folio_id', $folio->id)
                ->where('description', 'like', 'Denda%')
                ->sum('amount');

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
                'room_inspected' => $request->room_inspected ?? true,
                'deposit_amount' => $depositAmount,
                'damage_charges' => $totalDamageCharges,
                'deposit_refund' => $depositRefund,
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

    /**
     * Mengecek status inspeksi kamar untuk checkout.
     */
    public function getInspectionStatus(int $checkInId)
    {
        $checkIn = CheckIn::find($checkInId);
        if (!$checkIn) {
            return response()->json([
                'success' => false,
                'message' => 'Data Check-in tidak ditemukan.'
            ], 404);
        }

        // Cari tugas room_inspection terbaru untuk kamar ini yang dibuat setelah waktu check-in
        $task = HousekeepingTask::where('room_id', $checkIn->room_id)
            ->where('task_type', 'room_inspection')
            ->where('created_at', '>=', $checkIn->check_in_time)
            ->where('status', '!=', 'cancelled')
            ->latest()
            ->first();

        if (!$task) {
            return response()->json([
                'success' => true,
                'status' => 'none'
            ], 200);
        }

        return response()->json([
            'success' => true,
            'status' => $task->status === 'completed' ? 'completed' : 'pending',
            'task' => $task
        ], 200);
    }

    /**
     * Meminta inspeksi kamar ke divisi Housekeeping.
     */
    public function requestInspection(int $checkInId)
    {
        $checkIn = CheckIn::find($checkInId);
        if (!$checkIn) {
            return response()->json([
                'success' => false,
                'message' => 'Data Check-in tidak ditemukan.'
            ], 404);
        }

        // Cek apakah sudah ada inspeksi aktif
        $existingTask = HousekeepingTask::where('room_id', $checkIn->room_id)
            ->where('task_type', 'room_inspection')
            ->where('created_at', '>=', $checkIn->check_in_time)
            ->where('status', '!=', 'cancelled')
            ->latest()
            ->first();

        if ($existingTask && $existingTask->status !== 'completed') {
            return response()->json([
                'success' => true,
                'message' => 'Inspeksi sedang berjalan.',
                'task' => $existingTask
            ], 200);
        }

        // Buat task Housekeeping room_inspection
        $room = Room::find($checkIn->room_id);
        
        $task = HousekeepingTask::create([
            'room_id' => $room->id,
            'task_type' => 'room_inspection',
            'priority' => 'urgent',
            'status' => 'pending',
            'notes' => 'Inspeksi Kamar Checkout. Mohon periksa kerusakan barang di kamar #' . $room->room_number . '.'
        ]);

        // Ubah status kamar menjadi occupied dirty (karena tamu mau checkout tapi belum selesai bayar)
        $room->update(['status' => 'od']);

        return response()->json([
            'success' => true,
            'message' => 'Permintaan inspeksi kamar berhasil dikirim ke Housekeeping.',
            'task' => $task
        ], 201);
    }
}
