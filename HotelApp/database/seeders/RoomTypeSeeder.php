<?php

namespace Database\Seeders;

use App\Models\RoomType;
use Illuminate\Database\Seeder;

class RoomTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['code' => 'CON', 'name' => 'Connecting Room', 'default_capacity' => 4, 'base_price' => 1200000],
            ['code' => 'ADJ', 'name' => 'Adjoining Room', 'default_capacity' => 4, 'base_price' => 1000000],
            ['code' => 'ADC', 'name' => 'Adjacent Room', 'default_capacity' => 2, 'base_price' => 800000],
            ['code' => 'ICR', 'name' => 'Interconnecting Room', 'default_capacity' => 4, 'base_price' => 1300000],
            ['code' => 'FCR', 'name' => 'Family Connecting Room', 'default_capacity' => 8, 'base_price' => 2200000],
            ['code' => 'DBL', 'name' => 'Double-Double Room', 'default_capacity' => 4, 'base_price' => 950000],
            ['code' => 'TWN', 'name' => 'Twin Room', 'default_capacity' => 2, 'base_price' => 650000],
            ['code' => 'HTW', 'name' => 'Hollywood Twin Room', 'default_capacity' => 2, 'base_price' => 700000],
            ['code' => 'TRP', 'name' => 'Triple Room', 'default_capacity' => 3, 'base_price' => 850000],
            ['code' => 'QAD', 'name' => 'Quad Room', 'default_capacity' => 4, 'base_price' => 1100000],
            ['code' => 'FAM', 'name' => 'Family Room', 'default_capacity' => 6, 'base_price' => 1500000],
            ['code' => 'STD', 'name' => 'Studio Room', 'default_capacity' => 2, 'base_price' => 750000],
            ['code' => 'DPX', 'name' => 'Duplex Room', 'default_capacity' => 4, 'base_price' => 1800000],
            ['code' => 'LFT', 'name' => 'Loft Room', 'default_capacity' => 2, 'base_price' => 1400000],
            ['code' => 'SUT', 'name' => 'Suite Room', 'default_capacity' => 2, 'base_price' => 2000000],
            ['code' => 'JST', 'name' => 'Junior Suite', 'default_capacity' => 2, 'base_price' => 1600000],
            ['code' => 'EXS', 'name' => 'Executive Suite', 'default_capacity' => 2, 'base_price' => 2500000],
            ['code' => 'ACC', 'name' => 'Accessible Room', 'default_capacity' => 2, 'base_price' => 650000],
            ['code' => 'CAB', 'name' => 'Cabana Room', 'default_capacity' => 2, 'base_price' => 1700000],
            ['code' => 'LAN', 'name' => 'Lanai Room', 'default_capacity' => 2, 'base_price' => 1500000],
        ];

        foreach ($types as $type) {
            RoomType::create(array_merge($type, [
                'description' => 'Kamar bertipe ' . $type['name'] . ' dengan pelayanan premium standar HotelOps.'
            ]));
        }
    }
}
