<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil ID tipe kamar agar relasinya tepat
        $typeIds = RoomType::pluck('id', 'code')->toArray();

        $rooms = [
            // Lantai 1 (101-106)
            ['room_number' => '101', 'floor' => 1, 'code' => 'TWN', 'status' => 'vc'],
            ['room_number' => '102', 'floor' => 1, 'code' => 'TWN', 'status' => 'vc'],
            ['room_number' => '103', 'floor' => 1, 'code' => 'DBL', 'status' => 'vc'],
            ['room_number' => '104', 'floor' => 1, 'code' => 'DBL', 'status' => 'vc'],
            ['room_number' => '105', 'floor' => 1, 'code' => 'ACC', 'status' => 'vc'],
            ['room_number' => '106', 'floor' => 1, 'code' => 'CAB', 'status' => 'vc'],

            // Lantai 2 (201-206)
            ['room_number' => '201', 'floor' => 2, 'code' => 'STD', 'status' => 'vc'],
            ['room_number' => '202', 'floor' => 2, 'code' => 'STD', 'status' => 'vc'],
            ['room_number' => '203', 'floor' => 2, 'code' => 'FAM', 'status' => 'vc'],
            ['room_number' => '204', 'floor' => 2, 'code' => 'FAM', 'status' => 'vc'],
            ['room_number' => '205', 'floor' => 2, 'code' => 'TRP', 'status' => 'vc'],
            ['room_number' => '206', 'floor' => 2, 'code' => 'QAD', 'status' => 'vc'],

            // Lantai 3 (301-306)
            ['room_number' => '301', 'floor' => 3, 'code' => 'CON', 'status' => 'vc'],
            ['room_number' => '302', 'floor' => 3, 'code' => 'CON', 'status' => 'vc'],
            ['room_number' => '303', 'floor' => 3, 'code' => 'ADJ', 'status' => 'vc'],
            ['room_number' => '304', 'floor' => 3, 'code' => 'ADC', 'status' => 'vc'],
            ['room_number' => '305', 'floor' => 3, 'code' => 'HTW', 'status' => 'vc'],
            ['room_number' => '306', 'floor' => 3, 'code' => 'LAN', 'status' => 'vc'],

            // Lantai 4 (401-406)
            ['room_number' => '401', 'floor' => 4, 'code' => 'JST', 'status' => 'vc'],
            ['room_number' => '402', 'floor' => 4, 'code' => 'JST', 'status' => 'vc'],
            ['room_number' => '403', 'floor' => 4, 'code' => 'SUT', 'status' => 'vc'],
            ['room_number' => '404', 'floor' => 4, 'code' => 'SUT', 'status' => 'vc'],
            ['room_number' => '405', 'floor' => 4, 'code' => 'DPX', 'status' => 'vc'],
            ['room_number' => '406', 'floor' => 4, 'code' => 'LFT', 'status' => 'vc'],

            // Lantai 5 (501-504)
            ['room_number' => '501', 'floor' => 5, 'code' => 'EXS', 'status' => 'vc'],
            ['room_number' => '502', 'floor' => 5, 'code' => 'EXS', 'status' => 'vc'],
            ['room_number' => '503', 'floor' => 5, 'code' => 'FCR', 'status' => 'vc'],
            ['room_number' => '504', 'floor' => 5, 'code' => 'ICR', 'status' => 'vc'],
        ];

        foreach ($rooms as $room) {
            Room::create([
                'room_number' => $room['room_number'],
                'floor' => $room['floor'],
                'room_type_id' => $typeIds[$room['code']],
                'status' => $room['status'],
                'notes' => 'Kamar standar di lantai ' . $room['floor']
            ]);
        }
    }
}
