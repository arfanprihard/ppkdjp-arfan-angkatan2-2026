<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Memproses Login Staff
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        // 1. Lakukan Autentikasi Menggunakan Auth Guard Bawaan Laravel
        // (Ini akan otomatis menanamkan cookie session jika email & password cocok)
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.'
            ], 401);
        }

        $user = Auth::user();

        if (!$user->is_active) {
            Auth::logout();
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda telah dinonaktifkan.'
            ], 403);
        }

        // 2. Regenerate Session ID (Untuk mencegah serangan Session Fixation)
        $request->session()->regenerate();

        // 3. Kembalikan data user TANPA teks token
        return response()->json([
            'success' => true,
            'message' => 'Login Berhasil.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ], 200);
    }

    /**
     *  Memproses Logout (Hapus Token)
     */
    public function logout(Request $request)
    {
        // 1. Keluar dari autentikasi guard session Laravel
        Auth::logout();
        // 2. Hancurkan data session yang tersimpan di server
        $request->session()->invalidate();
        // 3. Buat ulang token CSRF baru demi keamanan
        $request->session()->regenerateToken();
        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.'
        ], 200);
    }

    /**
     * Mendapatkan info profil staff yang sedang login
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ], 200);
    }
}
