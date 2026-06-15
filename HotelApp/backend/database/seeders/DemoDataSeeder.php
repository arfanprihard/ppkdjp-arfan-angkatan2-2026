<?php

namespace Database\Seeders;

use App\Models\Guest;
use App\Models\Reservation;
use App\Models\CheckIn;
use App\Models\GuestFolio;
use App\Models\FolioCharge;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use App\Models\LaundryRequest;
use App\Models\FnbOrder;
use App\Models\FnbOrderItem;
use App\Models\HousekeepingTask;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Guest::truncate();
        Reservation::truncate();
        CheckIn::truncate();
        GuestFolio::truncate();
        FolioCharge::truncate();
        LaundryRequest::truncate();
        FnbOrder::truncate();
        FnbOrderItem::truncate();
        HousekeepingTask::truncate();
        Schema::enableForeignKeyConstraints();

        // Ambil data referensi
        $admin = User::where('role', 'admin')->first();
        $receptionist = User::where('role', 'receptionist')->first();
        $hkStaff = User::where('role', 'housekeeping')->first();
        $fnbStaff = User::where('role', 'fnb')->first();
        $roomTypes = RoomType::all();

        // ==========================================
        // 1. BUAT TAMU DEMO (GUESTS)
        // ==========================================
        $guestsData = [
            ['name' => 'John Doe', 'email' => 'john@gmail.com', 'phone' => '08123456789', 'nationality' => 'USA'],
            ['name' => 'Siti Aminah', 'email' => 'siti@gmail.com', 'phone' => '08218765432', 'nationality' => 'Indonesia'],
            ['name' => 'Michael Smith', 'email' => 'michael@gmail.com', 'phone' => '08311122233', 'nationality' => 'UK'],
            ['name' => 'Ahmad Yusuf', 'email' => 'ahmad@gmail.com', 'phone' => '08579998887', 'nationality' => 'Indonesia'],
            ['name' => 'Yuki Tanaka', 'email' => 'yuki@gmail.com', 'phone' => '08990001112', 'nationality' => 'Japan'],
            ['name' => 'Budi Santoso', 'email' => 'budi.s@gmail.com', 'phone' => '08129990001', 'nationality' => 'Indonesia'],
            ['name' => 'Jane Watson', 'email' => 'jane@gmail.com', 'phone' => '08138887776', 'nationality' => 'Australia'],
            ['name' => 'David Beckham', 'email' => 'david@gmail.com', 'phone' => '08112223334', 'nationality' => 'UK'],
            ['name' => 'Rini Astuti', 'email' => 'rini@gmail.com', 'phone' => '08125554443', 'nationality' => 'Indonesia'],
            ['name' => 'Lee Min Ho', 'email' => 'leeminho@gmail.com', 'phone' => '08126667778', 'nationality' => 'South Korea'],
        ];

        $guests = [];
        foreach ($guestsData as $g) {
            $guests[] = Guest::create($g);
        }

        // ==========================================
        // 2. 5 RESERVASI MENDATANG (CONFIRMED)
        // ==========================================
        for ($i = 0; $i < 5; $i++) {
            $rType = $roomTypes->random();
            Reservation::create([
                'reservation_code' => 'RSV-' . Carbon::now()->format('Ymd') . '-00' . ($i + 1),
                'guest_id' => $guests[$i]->id,
                'room_type_id' => $rType->id,
                'room_id' => null, // Belum di-assign kamar fisik
                'check_in_date' => Carbon::today()->addDays($i + 2),
                'check_out_date' => Carbon::today()->addDays($i + 5),
                'num_adults' => 2,
                'channel' => 'ota',
                'ota_name' => 'Traveloka',
                'status' => 'confirmed',
                'total_amount' => $rType->base_price * 3,
                'created_by' => $receptionist->id,
            ]);
        }

        // ==========================================
        // 3. 3 TAMU SEDANG MENGINAP (ACTIVE CHECK-IN / OCCUPIED)
        // ==========================================
        $occupiedRooms = Room::where('status', 'vc')->take(3)->get();

        $activeCheckins = [
            ['guest_index' => 5, 'room' => $occupiedRooms[0], 'days_stayed' => 2, 'special' => 'Kunci kamar tambahan'],
            ['guest_index' => 6, 'room' => $occupiedRooms[1], 'days_stayed' => 1, 'special' => 'Minta koran pagi'],
            ['guest_index' => 7, 'room' => $occupiedRooms[2], 'days_stayed' => 3, 'special' => 'Alergi seafood'],
        ];

        foreach ($activeCheckins as $key => $active) {
            $room = $active['room'];
            $guest = $guests[$active['guest_index']];

            // 3.1 Ubah status kamar fisik menjadi occupied clean (oc)
            $room->update(['status' => 'oc']);

            // 3.2 Buat data reservasi yang sudah lalu
            $r = Reservation::create([
                'reservation_code' => 'RSV-' . Carbon::now()->subDays($active['days_stayed'])->format('Ymd') . '-10' . ($key + 1),
                'guest_id' => $guest->id,
                'room_type_id' => $room->room_type_id,
                'room_id' => $room->id,
                'check_in_date' => Carbon::today()->subDays($active['days_stayed']),
                'check_out_date' => Carbon::today()->addDays(2),
                'num_adults' => 2,
                'channel' => 'walk_in',
                'status' => 'checked_in',
                'total_amount' => $room->roomType->base_price * ($active['days_stayed'] + 2),
                'created_by' => $receptionist->id,
            ]);

            // 3.3 Buat check-in record
            $checkin = CheckIn::create([
                'reservation_id' => $r->id,
                'room_id' => $room->id,
                'check_in_time' => Carbon::today()->subDays($active['days_stayed'])->setTime(14, 0, 0),
                'deposit_amount' => 500000.00,
                'deposit_method' => 'cash',
                'processed_by' => $receptionist->id,
                'notes' => $active['special'],
            ]);

            // 3.4 Buat Guest Folio
            $folio = GuestFolio::create([
                'check_in_id' => $checkin->id,
                'guest_id' => $guest->id,
                'folio_number' => 'FOLIO-' . $room->room_number . '-' . Carbon::now()->format('ymd') . ($key + 1),
                'status' => 'open',
                'total_charges' => 0,
                'total_payments' => 500000.00, // Deposit terhitung sebagai pembayaran masuk
                'balance' => -500000.00,
            ]);

            // 3.5 Tambah Tagihan Kamar (Room Charge) otomatis
            $roomChargeAmount = $room->roomType->base_price * $active['days_stayed'];
            $charge = FolioCharge::create([
                'folio_id' => $folio->id,
                'charge_type' => 'room',
                'description' => 'Room Charge ' . $active['days_stayed'] . ' Night(s)',
                'amount' => $roomChargeAmount,
                'quantity' => 1,
                'charge_date' => Carbon::today(),
                'created_by' => $receptionist->id,
            ]);

            // Update saldo folio
            $folio->increment('total_charges', $roomChargeAmount);
            $folio->update(['balance' => $folio->total_charges - $folio->total_payments]);
        }

        // ==========================================
        // 4. 2 TAMU YANG DIJADWALKAN CHECKOUT HARI INI
        // ==========================================
        $checkoutRooms = Room::where('status', 'vc')->take(2)->get();
        $expectedCheckouts = [
            ['guest_index' => 8, 'room' => $checkoutRooms[0], 'days_stayed' => 2],
            ['guest_index' => 9, 'room' => $checkoutRooms[1], 'days_stayed' => 1],
        ];

        foreach ($expectedCheckouts as $key => $expected) {
            $room = $expected['room'];
            $guest = $guests[$expected['guest_index']];

            // Set status kamar ke occupied dirty (od) karena mau check-out hari ini
            $room->update(['status' => 'od']);

            $r = Reservation::create([
                'reservation_code' => 'RSV-' . Carbon::now()->subDays($expected['days_stayed'])->format('Ymd') . '-20' . ($key + 1),
                'guest_id' => $guest->id,
                'room_type_id' => $room->room_type_id,
                'room_id' => $room->id,
                'check_in_date' => Carbon::today()->subDays($expected['days_stayed']),
                'check_out_date' => Carbon::today(),
                'num_adults' => 2,
                'channel' => 'website',
                'status' => 'checked_in', // Masih checked_in sebelum resepsionis memproses checkout
                'total_amount' => $room->roomType->base_price * $expected['days_stayed'],
                'created_by' => $receptionist->id,
            ]);

            $checkin = CheckIn::create([
                'reservation_id' => $r->id,
                'room_id' => $room->id,
                'check_in_time' => Carbon::today()->subDays($expected['days_stayed'])->setTime(14, 0, 0),
                'deposit_amount' => 200000.00,
                'deposit_method' => 'debit',
                'processed_by' => $receptionist->id,
            ]);

            $folio = GuestFolio::create([
                'check_in_id' => $checkin->id,
                'guest_id' => $guest->id,
                'folio_number' => 'FOLIO-' . $room->room_number . '-' . Carbon::now()->format('ymd') . 'C' . ($key + 1),
                'status' => 'open',
                'total_charges' => 0,
                'total_payments' => 200000.00,
                'balance' => -200000.00,
            ]);

            // Tambahkan room charge
            $roomChargeAmount = $room->roomType->base_price * $expected['days_stayed'];
            FolioCharge::create([
                'folio_id' => $folio->id,
                'charge_type' => 'room',
                'description' => 'Room Charge ' . $expected['days_stayed'] . ' Night(s)',
                'amount' => $roomChargeAmount,
                'quantity' => 1,
                'charge_date' => Carbon::today()->subDays(1),
                'created_by' => $receptionist->id,
            ]);

            // Simulasi F&B Order room service yang di-charge ke kamar
            $fnbOrder = FnbOrder::create([
                'order_number' => 'FNB-RS-' . Carbon::now()->format('Ymd') . '-00' . ($key + 1),
                'outlet' => 'room_service',
                'guest_id' => $guest->id,
                'room_id' => $room->id,
                'charge_to' => 'room',
                'status' => 'selesai',
                'subtotal' => 150000.00,
                'tax' => 15000.00,
                'total' => 165000.00,
                'notes' => 'Minta sendok tambahan',
                'created_by' => $fnbStaff->id
            ]);

            FnbOrderItem::create([
                'order_id' => $fnbOrder->id,
                'item_name' => 'Nasi Goreng Kampung',
                'quantity' => 2,
                'unit_price' => 75000.00,
                'subtotal' => 150000.00,
            ]);

            // Link F&B order ke Folio
            FolioCharge::create([
                'folio_id' => $folio->id,
                'charge_type' => 'fnb',
                'description' => 'Room Service: F&B Order #' . $fnbOrder->order_number,
                'amount' => 165000.00,
                'quantity' => 1,
                'charge_date' => Carbon::today(),
                'reference_id' => $fnbOrder->id,
                'reference_type' => FnbOrder::class,
                'created_by' => $receptionist->id,
            ]);

            // Hitung ulang saldo folio
            $totalCharges = $roomChargeAmount + 165000.00;
            $folio->update([
                'total_charges' => $totalCharges,
                'balance' => $totalCharges - $folio->total_payments
            ]);
        }
    }
}
