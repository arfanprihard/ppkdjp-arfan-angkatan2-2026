<?php

namespace App\Http\Controllers;

use App\Models\RoomType;
use App\Models\Room;
use App\Models\Reservation;
use Illuminate\Http\Request;

class RoomTypeController extends Controller
{
    /**
     * Menampilkan semua tipe kamar.
     */
    public function index()
    {
        $types = RoomType::all();

        return response()->json([
            'success' => true,
            'data' => $types
        ], 200);
    }

    /**
     * Menyimpan tipe kamar baru (Hanya Admin).
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:10|unique:room_types,code',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'default_capacity' => 'required|integer|min:1',
            'base_price' => 'required|numeric|min:0'
        ]);

        $roomType = RoomType::create([
            'code' => strtoupper($request->code),
            'name' => $request->name,
            'description' => $request->description,
            'default_capacity' => $request->default_capacity,
            'base_price' => $request->base_price
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tipe kamar ' . $roomType->name . ' berhasil ditambahkan.',
            'data' => $roomType
        ], 201);
    }

    /**
     * Menampilkan detail satu tipe kamar.
     */
    public function show($id)
    {
        $roomType = RoomType::find($id);

        if (!$roomType) {
            return response()->json([
                'success' => false,
                'message' => 'Tipe kamar tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $roomType
        ], 200);
    }

    /**
     * Memperbarui detail tipe kamar (Hanya Admin).
     */
    public function update(Request $request, $id)
    {
        $roomType = RoomType::find($id);

        if (!$roomType) {
            return response()->json([
                'success' => false,
                'message' => 'Tipe kamar tidak ditemukan.'
            ], 404);
        }

        $request->validate([
            'code' => 'required|string|max:10|unique:room_types,code,' . $id,
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'default_capacity' => 'required|integer|min:1',
            'base_price' => 'required|numeric|min:0'
        ]);

        $roomType->update([
            'code' => strtoupper($request->code),
            'name' => $request->name,
            'description' => $request->description,
            'default_capacity' => $request->default_capacity,
            'base_price' => $request->base_price
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tipe kamar ' . $roomType->name . ' berhasil diperbarui.',
            'data' => $roomType
        ], 200);
    }

    /**
     * Menghapus tipe kamar (Hanya Admin).
     */
    public function destroy($id)
    {
        $roomType = RoomType::find($id);

        if (!$roomType) {
            return response()->json([
                'success' => false,
                'message' => 'Tipe kamar tidak ditemukan.'
            ], 404);
        }

        // Cegah penghapusan jika ada kamar yang menggunakan tipe kamar ini
        $hasRooms = Room::where('room_type_id', $id)->exists();
        if ($hasRooms) {
            return response()->json([
                'success' => false,
                'message' => 'Tipe kamar tidak dapat dihapus karena masih digunakan oleh beberapa kamar fisik.'
            ], 400);
        }

        // Cegah penghapusan jika ada reservasi aktif yang menggunakan tipe kamar ini
        $hasReservations = Reservation::where('room_type_id', $id)
            ->whereIn('status', ['pending', 'confirmed', 'checked_in'])
            ->exists();
        if ($hasReservations) {
            return response()->json([
                'success' => false,
                'message' => 'Tipe kamar tidak dapat dihapus karena memiliki reservasi aktif.'
            ], 400);
        }

        $roomType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tipe kamar ' . $roomType->name . ' berhasil dihapus.'
        ], 200);
    }
}
