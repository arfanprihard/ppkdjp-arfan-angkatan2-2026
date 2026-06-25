<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    /**
     * Menampilkan semua tamu dengan pencarian nama/email/telepon.
     */
    public function index(Request $request)
    {
        $query = Guest::query();

        // Fitur pencarian opsional
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('id_number', 'like', "%{$search}%");
            });
        }

        $guests = $query->latest()->paginate(10); // Halaman per 10 data

        return response()->json([
            'success' => true,
            'message' => 'Daftar tamu berhasil diambil.',
            'data' => $guests
        ], 200);
    }

    /**
     * Mendaftarkan tamu baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'id_type' => 'required|in:ktp,passport,sim',
            'id_number' => 'required|string|max:50|unique:guests,id_number',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255|unique:guests,email',
            'address' => 'nullable|string',
            'nationality' => 'nullable|string|max:100',
            'profesi' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
        ]);

        $guest = Guest::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tamu berhasil didaftarkan.',
            'data' => $guest
        ], 201);
    }

    /**
     * Menampilkan detail satu tamu beserta histori reservasi mereka.
     */
    public function show($id)
    {
        $guest = Guest::with('reservations.room')->find($id);

        if (!$guest) {
            return response()->json([
                'success' => false,
                'message' => 'Tamu tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $guest
        ], 200);
    }

    /**
     * Mengupdate data tamu.
     */
    public function update(Request $request, $id)
    {
        $guest = Guest::find($id);

        if (!$guest) {
            return response()->json([
                'success' => false,
                'message' => 'Tamu tidak ditemukan.'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'id_type' => 'sometimes|required|in:ktp,passport,sim',
            'id_number' => 'sometimes|required|string|max:50|unique:guests,id_number,' . $guest->id,
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255|unique:guests,email,' . $guest->id,
            'address' => 'nullable|string',
            'nationality' => 'nullable|string|max:100',
            'profesi' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
        ]);

        $guest->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data tamu berhasil diperbarui.',
            'data' => $guest
        ], 200);
    }

    /**
     * Menghapus data tamu secara permanen.
     */
    public function destroy($id)
    {
        $guest = Guest::find($id);

        if (!$guest) {
            return response()->json([
                'success' => false,
                'message' => 'Tamu tidak ditemukan.'
            ], 404);
        }

        // Cegah hapus jika tamu masih memiliki reservasi aktif
        $activeReservations = $guest->reservations()
            ->whereIn('status', ['pending', 'confirmed', 'checked_in'])
            ->count();

        if ($activeReservations > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus tamu yang masih memiliki reservasi aktif (' . $activeReservations . ' reservasi).'
            ], 400);
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($guest) {
            // Hapus reservasi historis terlebih dahulu (otomatis cascade ke check-ins, check-outs, folios)
            $guest->reservations()->delete();
            // Hapus tamu
            $guest->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Data tamu berhasil dihapus secara permanen.'
        ], 200);
    }
}
