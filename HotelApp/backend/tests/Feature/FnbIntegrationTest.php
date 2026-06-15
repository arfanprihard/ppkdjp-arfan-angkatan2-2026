<?php

use App\Models\User;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\Guest;
use App\Models\Reservation;
use App\Models\CheckIn;
use App\Models\GuestFolio;
use App\Models\FnbOrder;
use App\Models\FnbOrderItem;
use App\Models\FolioCharge;
use Carbon\Carbon;

test('F&B order creation defaults to proses and completing it updates status to selesai', function () {
    // 1. Setup user & models
    $receptionist = User::create([
        'name' => 'Receptionist Staff',
        'email' => 'receptionist_fnb_test@hotelops.com',
        'password' => bcrypt('password123'),
        'role' => 'receptionist',
        'is_active' => true,
    ]);

    $fnbStaff = User::create([
        'name' => 'Fnb Staff',
        'email' => 'fnb_test@hotelops.com',
        'password' => bcrypt('password123'),
        'role' => 'fnb',
        'is_active' => true,
    ]);

    $roomType = RoomType::create([
        'code' => 'DLX',
        'name' => 'Deluxe Room',
        'description' => 'Deluxe Room Description',
        'default_capacity' => 2,
        'base_price' => 800000,
    ]);

    $room = Room::create([
        'room_number' => '102',
        'floor' => 1,
        'room_type_id' => $roomType->id,
        'status' => 'oc',
        'notes' => null,
    ]);

    $guest = Guest::create([
        'name' => 'John Doe',
        'email' => 'johndoe_test@email.com',
        'phone' => '08129990001',
        'nationality' => 'USA',
    ]);

    $reservation = Reservation::create([
        'reservation_code' => 'RSV-FNB-TEST',
        'guest_id' => $guest->id,
        'room_type_id' => $roomType->id,
        'room_id' => $room->id,
        'check_in_date' => Carbon::today(),
        'check_out_date' => Carbon::today()->addDays(2),
        'num_adults' => 2,
        'channel' => 'walk_in',
        'status' => 'checked_in',
        'total_amount' => 1600000,
        'created_by' => $receptionist->id,
    ]);

    $checkIn = CheckIn::create([
        'reservation_id' => $reservation->id,
        'room_id' => $room->id,
        'check_in_time' => Carbon::now(),
        'deposit_amount' => 200000,
        'deposit_method' => 'cash',
        'processed_by' => $receptionist->id,
    ]);

    $folio = GuestFolio::create([
        'check_in_id' => $checkIn->id,
        'guest_id' => $guest->id,
        'folio_number' => 'FOLIO-FNB-TEST',
        'status' => 'open',
        'total_charges' => 1600000,
        'total_payments' => 200000,
        'balance' => 1400000,
    ]);

    // 2. Submit F&B order as Room Service charged to room
    $payload = [
        'outlet' => 'room_service',
        'guest_id' => $guest->id,
        'room_id' => $room->id,
        'charge_to' => 'room',
        'notes' => 'Tanpa bawang merah',
        'items' => [
            [
                'item_name' => 'Nasi Goreng Kampung',
                'quantity' => 2,
                'unit_price' => 65000,
            ],
            [
                'item_name' => 'Ice Sweet Tea',
                'quantity' => 2,
                'unit_price' => 15000,
            ]
        ]
    ];

    $response = $this->actingAs($receptionist)
        ->postJson('/api/fnb/orders', $payload);

    $response->assertStatus(201);
    
    // Check that FnbOrder was created
    $order = FnbOrder::where('room_id', $room->id)->first();
    expect($order)->not->toBeNull();
    expect($order->status)->toBe('proses'); // Default status is 'proses'
    expect((float)$order->subtotal)->toBe(160000.0); // (2*65k) + (2*15k) = 160k
    expect((float)$order->tax)->toBe(16000.0); // 10%
    expect((float)$order->total)->toBe(176000.0); // 160k + 16k = 176k

    // Check that items are saved
    $items = FnbOrderItem::where('order_id', $order->id)->get();
    expect($items->count())->toBe(2);

    // Verify guest folio charge has been created and updated total_charges/balance
    $folioCharge = FolioCharge::where('folio_id', $folio->id)
        ->where('charge_type', 'fnb')
        ->first();
    
    expect($folioCharge)->not->toBeNull();
    expect((float)$folioCharge->amount)->toBe(176000.0);
    
    $folio->refresh();
    expect((float)$folio->total_charges)->toBe(1776000.0); // 1.6m + 176k
    expect((float)$folio->balance)->toBe(1576000.0); // 1.4m + 176k

    // 3. Update order status to selesai (completed) as F&B staff
    $responseUpdate = $this->actingAs($fnbStaff)
        ->patchJson("/api/fnb/orders/{$order->id}/status", [
            'status' => 'selesai',
        ]);

    $responseUpdate->assertStatus(200);
    
    $order->refresh();
    expect($order->status)->toBe('selesai');
});
