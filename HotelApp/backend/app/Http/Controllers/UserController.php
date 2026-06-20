<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,receptionist,housekeeping,fnb',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Staff baru berhasil didaftarkan.',
            'data' => $user
        ], 201);
    }

    public function show(int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Staff tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ], 200);
    }

    public function update(Request $request, int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Staff tidak ditemukan.'
            ], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|required|in:admin,receptionist,housekeeping,fnb',
            'is_active' => 'sometimes|required|boolean'
        ]);

        if ($request->has('is_active')) {
            if ($request->is_active == false && $request->user()->id === $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak bisa menonaktifkan akun sendiri.'
                ], 400);
            }
            $user->is_active = $request->is_active;
        }

        if ($request->has('name')) $user->name = $request->name;
        if ($request->has('email')) $user->email = $request->email;
        if ($request->has('role')) $user->role = $request->role;
        if ($request->filled('password')) $user->password = Hash::make($request->password);

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Data staff berhasil diperbarui.',
            'data' => $user
        ], 200);
    }

    public function destroy(Request $request, int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Staff tidak ditemukan.'
            ], 404);
        }

        if ($request->user()->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak bisa menonaktifkan akun sendiri.'
            ], 400);
        }

        $user->tokens()->delete(); // Hapus semua token aktif
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun staf berhasil dihapus secara permanen.'
        ], 200);
    }
}
