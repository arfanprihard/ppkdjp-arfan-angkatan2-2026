<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Menampilkan semua kamar beserta relasi tipe kamarnya.
     */
    public function index()
    {
        $rooms = Room::with('roomType')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar kamar berhasil diambil.',
            'data' => $rooms
        ], 200);
    }

    /**
     * Menampilkan detail satu kamar.
     */
    public function show($id)
    {
        $room = Room::with('roomType')->find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Kamar tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $room
        ], 200);
    }

    /**
     * Mengubah status kebersihan/ketersediaan kamar (VC, VD, OC, OD, OOO, OOS).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:vc,vd,oc,od,ooo,oos',
            'notes' => 'nullable|string'
        ]);

        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Kamar tidak ditemukan.'
            ], 404);
        }

        // Simpan status baru
        $room->update([
            'status' => $request->status,
            'notes' => $request->filled('notes') ? $request->notes : $room->notes
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status kamar #' . $room->room_number . ' berhasil diupdate menjadi ' . strtoupper($room->status) . '.',
            'data' => $room
        ], 200);
    }

    /**
     * Menyimpan kamar baru (Hanya Admin).
     */
    public function store(Request $request)
    {
        $request->validate([
            'room_number' => 'required|string|max:10|unique:rooms,room_number',
            'floor' => 'required|integer|min:1',
            'room_type_id' => 'required|exists:room_types,id',
            'status' => 'nullable|in:vc,vd,oc,od,ooo,oos',
            'notes' => 'nullable|string'
        ]);

        $room = Room::create([
            'room_number' => $request->room_number,
            'floor' => $request->floor,
            'room_type_id' => $request->room_type_id,
            'status' => $request->status ?? 'vc',
            'notes' => $request->notes
        ]);

        $room->load('roomType');

        return response()->json([
            'success' => true,
            'message' => 'Kamar #' . $room->room_number . ' berhasil ditambahkan.',
            'data' => $room
        ], 201);
    }

    /**
     * Memperbarui detail kamar (Hanya Admin).
     */
    public function update(Request $request, $id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Kamar tidak ditemukan.'
            ], 404);
        }

        $request->validate([
            'room_number' => 'required|string|max:10|unique:rooms,room_number,' . $id,
            'floor' => 'required|integer|min:1',
            'room_type_id' => 'required|exists:room_types,id',
            'status' => 'required|in:vc,vd,oc,od,ooo,oos',
            'notes' => 'nullable|string'
        ]);

        $room->update([
            'room_number' => $request->room_number,
            'floor' => $request->floor,
            'room_type_id' => $request->room_type_id,
            'status' => $request->status,
            'notes' => $request->notes
        ]);

        $room->load('roomType');

        return response()->json([
            'success' => true,
            'message' => 'Kamar #' . $room->room_number . ' berhasil diperbarui.',
            'data' => $room
        ], 200);
    }

    /**
     * Menghapus kamar (Hanya Admin).
     */
    public function destroy($id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Kamar tidak ditemukan.'
            ], 404);
        }

        // Cegah penghapusan jika ada check-in atau reservasi aktif
        $hasCheckIns = \DB::table('check_ins')->where('room_id', $id)->exists();
        $hasReservations = \DB::table('reservations')
            ->where('room_id', $id)
            ->whereIn('status', ['pending', 'confirmed', 'checked_in'])
            ->exists();

        if ($hasCheckIns || $hasReservations) {
            return response()->json([
                'success' => false,
                'message' => 'Kamar tidak dapat dihapus karena memiliki riwayat check-in atau reservasi aktif.'
            ], 400);
        }

        $room->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kamar #' . $room->room_number . ' berhasil dihapus.'
        ], 200);
    }

    /**
     * Menampilkan semua tipe kamar.
     */
    public function getRoomTypes()
    {
        $types = \App\Models\RoomType::all();
        return response()->json([
            'success' => true,
            'data' => $types
        ], 200);
    }
}
