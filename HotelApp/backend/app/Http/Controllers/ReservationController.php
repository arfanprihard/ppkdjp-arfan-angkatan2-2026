<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReservationController extends Controller
{
    /**
     * Menampilkan semua reservasi dengan filter (status, tanggal check-in, booking channel).
     */
    public function index(Request $request)
    {
        $query = Reservation::with(['guest', 'roomType', 'room', 'checkIn']);

        // Filter berdasarkan status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter berdasarkan booking channel (walk_in, ota, dll)
        if ($request->has('channel')) {
            $query->where('channel', $request->channel);
        }

        // Filter berdasarkan tanggal check-in
        if ($request->has('check_in_date')) {
            $query->whereDate('check_in_date', $request->check_in_date);
        }

        if ($request->has('all') && $request->all == 1) {
            $reservations = $query->latest()->get();
        } else {
            $perPage = $request->get('per_page', 15);
            $reservations = $query->latest()->paginate($perPage);
        }

        return response()->json([
            'success' => true,
            'message' => 'Daftar reservasi berhasil diambil.',
            'data' => $reservations
        ], 200);
    }

    /**
     * Membuat reservasi baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'guest_id' => 'required|exists:guests,id',
            'room_type_id' => 'required|exists:room_types,id',
            'room_id' => 'nullable|exists:rooms,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'num_adults' => 'required|integer|min:1',
            'num_children' => 'nullable|integer|min:0',
            'channel' => 'required|in:walk_in,phone,ota,website,email',
            'ota_name' => 'required_if:channel,ota|nullable|string|max:100',
            'special_request' => 'nullable|string',
        ]);

        // 1. Generate Kode Reservasi Otomatis (Format: RSV-YYYYMMDD-001)
        $today = Carbon::today()->format('Ymd');
        $count = Reservation::whereDate('created_at', Carbon::today())->count() + 1;
        $reservationCode = 'RSV-' . $today . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        // 2. Hitung Total Tagihan Kamar (Total Amount)
        $roomType = RoomType::find($request->room_type_id);
        $nights = Carbon::parse($request->check_in_date)->diffInDays(Carbon::parse($request->check_out_date));
        $totalAmount = $roomType->base_price * $nights;

        // 3. Simpan data reservasi
        $reservation = Reservation::create(array_merge($validated, [
            'reservation_code' => $reservationCode,
            'status' => 'pending', // default status
            'total_amount' => $totalAmount,
            'created_by' => $request->user()->id // Diambil dari id staf yang sedang login
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Reservasi berhasil dibuat dengan kode: ' . $reservationCode,
            'data' => $reservation
        ], 201);
    }

    /**
     * Menampilkan detail satu reservasi.
     */
    public function show(int $id)
    {
        $reservation = Reservation::with(['guest', 'roomType', 'room', 'creator', 'checkIn'])->find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $reservation
        ], 200);
    }

    /**
     * Mengupdate detail reservasi.
     */
    public function update(Request $request, int $id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan.'
            ], 404);
        }

        $validated = $request->validate([
            'room_id' => 'nullable|exists:rooms,id',
            'room_type_id' => 'sometimes|required|exists:room_types,id',
            'check_in_date' => 'sometimes|required|date',
            'check_out_date' => 'sometimes|required|date|after:check_in_date',
            'num_adults' => 'sometimes|required|integer|min:1',
            'num_children' => 'nullable|integer|min:0',
            'status' => 'sometimes|required|in:pending,confirmed,checked_in,checked_out,cancelled,no_show',
            'special_request' => 'nullable|string',
        ]);

        // Hitung ulang harga jika tanggal menginap atau tipe kamar berubah
        if ($request->has('check_in_date') || $request->has('check_out_date') || $request->has('room_type_id')) {
            $roomTypeId = $request->room_type_id ?? $reservation->room_type_id;
            $checkIn = $request->check_in_date ?? $reservation->check_in_date;
            $checkOut = $request->check_out_date ?? $reservation->check_out_date;

            $roomType = RoomType::find($roomTypeId);
            $nights = Carbon::parse($checkIn)->diffInDays(Carbon::parse($checkOut));
            $reservation->total_amount = $roomType->base_price * $nights;
        }

        $reservation->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Reservasi berhasil diperbarui.',
            'data' => $reservation
        ], 200);
    }

    /**
     * Membatalkan Reservasi (Cancel).
     */
    public function cancel(int $id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan.'
            ], 404);
        }

        if ($reservation->status === 'checked_in' || $reservation->status === 'checked_out') {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi yang sudah check-in atau check-out tidak dapat dibatalkan.'
            ], 400);
        }

        $reservation->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Reservasi #' . $reservation->reservation_code . ' berhasil dibatalkan.'
        ], 200);
    }
}
