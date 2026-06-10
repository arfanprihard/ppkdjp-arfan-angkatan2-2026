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
}
