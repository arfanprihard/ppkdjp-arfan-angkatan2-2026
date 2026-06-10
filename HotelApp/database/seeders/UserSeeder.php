<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema; // Tambahkan ini di atas

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Nonaktifkan pengecekan relasi sementara
        Schema::disableForeignKeyConstraints();

        // Kosongkan data user lama
        User::truncate();

        // Aktifkan kembali pengecekan relasi
        Schema::enableForeignKeyConstraints();

        // 1. Administrator
        User::create([
            'name' => 'Pak Budi (GM)',
            'email' => 'admin@hotelops.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // 2. Resepsionis 1
        User::create([
            'name' => 'Sari Dewi',
            'email' => 'reception1@hotelops.com',
            'password' => Hash::make('rec123'),
            'role' => 'receptionist',
            'is_active' => true,
        ]);

        // 3. Resepsionis 2
        User::create([
            'name' => 'Rina Wati',
            'email' => 'reception2@hotelops.com',
            'password' => Hash::make('rec123'),
            'role' => 'receptionist',
            'is_active' => true,
        ]);

        // 5. Housekeeping
        User::create([
            'name' => 'Agus Salim',
            'email' => 'hk1@hotelops.com',
            'password' => Hash::make('hk123'),
            'role' => 'housekeeping',
            'is_active' => true,
        ]);

        // 6. F&B Service
        User::create([
            'name' => 'Chef Anton',
            'email' => 'fnb1@hotelops.com',
            'password' => Hash::make('fnb123'),
            'role' => 'fnb',
            'is_active' => true,
        ]);
    }
}
