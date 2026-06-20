<?php

use App\Models\User;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\Guest;
use App\Models\Reservation;
use App\Models\CheckIn;
use App\Models\GuestFolio;
use App\Models\HousekeepingTask;
use Carbon\Carbon;

test('checkout creates housekeeping task and completing task syncs room status', function () {
    // 1. Setup user & models
    $receptionist = User::create([
        'name' => 'Receptionist Staff',
        'email' => 'receptionist_test@hotelops.com',
        'password' => bcrypt('password123'),
        'role' => 'receptionist',
        'is_active' => true,
    ]);

    $housekeeping = User::create([
        'name' => 'Housekeeping Staff',
        'email' => 'housekeeping_test@hotelops.com',
        'password' => bcrypt('password123'),
        'role' => 'housekeeping',
        'is_active' => true,
    ]);

    $roomType = RoomType::create([
        'code' => 'STD',
        'name' => 'Standard Room',
        'description' => 'Standard Room Description',
        'default_capacity' => 2,
        'base_price' => 500000,
    ]);

    $room = Room::create([
        'room_number' => '101',
        'floor' => 1,
        'room_type_id' => $roomType->id,
        'status' => 'oc', // Occupied Clean
        'notes' => null,
    ]);

    $guest = Guest::create([
        'name' => 'Guest Name',
        'email' => 'guest@email.com',
        'phone' => '08123456789',
        'nationality' => 'Indonesia',
    ]);

    $reservation = Reservation::create([
        'reservation_code' => 'RSV-TEST-001',
        'guest_id' => $guest->id,
        'room_type_id' => $roomType->id,
        'room_id' => $room->id,
        'check_in_date' => Carbon::today(),
        'check_out_date' => Carbon::today()->addDays(2),
        'num_adults' => 2,
        'channel' => 'walk_in',
        'status' => 'checked_in',
        'total_amount' => 1000000,
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
        'folio_number' => 'FOLIO-101-TEST',
        'status' => 'open',
        'total_charges' => 1000000,
        'total_payments' => 200000,
        'balance' => 800000,
    ]);

    // Create and complete room_inspection task first to satisfy checkout requirement
    $inspectionTask = HousekeepingTask::create([
        'room_id' => $room->id,
        'task_type' => 'room_inspection',
        'priority' => 'urgent',
        'status' => 'completed',
        'completed_at' => Carbon::now(),
        'assigned_to' => $housekeeping->id,
    ]);

    // 2. Perform checkout (as receptionist)
    $response = $this->actingAs($receptionist)
        ->postJson('/api/checkouts', [
            'check_in_id' => $checkIn->id,
            'payment_method' => 'cash',
            'feedback_rating' => 5,
            'feedback_notes' => 'Sangat memuaskan',
        ]);

    $response->assertStatus(200);
    
    // Verify room status is set to 'vd' (Vacant Dirty)
    $room->refresh();
    expect($room->status)->toBe('vd');

    // Verify a housekeeping task was created
    $task = HousekeepingTask::where('room_id', $room->id)->where('task_type', 'room_cleaning')->first();
    expect($task)->not->toBeNull();
    expect($task->task_type)->toBe('room_cleaning');
    expect($task->status)->toBe('pending');

    // 3. Update task status (as housekeeping)
    // First, change status to 'in_progress'
    $response = $this->actingAs($housekeeping)
        ->patchJson("/api/housekeeping/tasks/{$task->id}", [
            'status' => 'in_progress',
        ]);

    $response->assertStatus(200);
    $task->refresh();
    expect($task->status)->toBe('in_progress');
    expect($task->assigned_to)->toBe($housekeeping->id);

    // Then, change status to 'completed'
    $response = $this->actingAs($housekeeping)
        ->patchJson("/api/housekeeping/tasks/{$task->id}", [
            'status' => 'completed',
        ]);

    $response->assertStatus(200);
    $task->refresh();
    expect($task->status)->toBe('completed');
    expect($task->completed_at)->not->toBeNull();
    expect($task->assigned_to)->toBe($housekeeping->id);

    // Verify room status is set to 'vc' (Vacant Clean)
    $room->refresh();
    expect($room->status)->toBe('vc');
});

test('housekeeping task completion syncs occupied dirty to occupied clean', function () {
    $housekeeping = User::create([
        'name' => 'Housekeeping Staff',
        'email' => 'housekeeping_test_2@hotelops.com',
        'password' => bcrypt('password123'),
        'role' => 'housekeeping',
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
        'room_number' => '202',
        'floor' => 2,
        'room_type_id' => $roomType->id,
        'status' => 'od', // Occupied Dirty (tamu masih menginap tapi kamar kotor)
        'notes' => null,
    ]);

    $task = HousekeepingTask::create([
        'room_id' => $room->id,
        'task_type' => 'room_cleaning',
        'priority' => 'medium',
        'status' => 'pending',
        'notes' => 'Tamu minta dibersihkan kamarnya siang ini.',
    ]);

    // Update task status to completed
    $response = $this->actingAs($housekeeping)
        ->patchJson("/api/housekeeping/tasks/{$task->id}", [
            'status' => 'completed',
        ]);

    $response->assertStatus(200);
    $task->refresh();
    expect($task->assigned_to)->toBe($housekeeping->id);
    
    // Verify room status becomes 'oc' (Occupied Clean)
    $room->refresh();
    expect($room->status)->toBe('oc');
});

test('checkout processes security deposit refund minus damage charges correctly', function () {
    // 1. Setup user & models
    $receptionist = User::create([
        'name' => 'Receptionist Staff',
        'email' => 'receptionist_test_sd@hotelops.com',
        'password' => bcrypt('password123'),
        'role' => 'receptionist',
        'is_active' => true,
    ]);

    $housekeeping = User::create([
        'name' => 'Housekeeping Staff',
        'email' => 'housekeeping_test_sd@hotelops.com',
        'password' => bcrypt('password123'),
        'role' => 'housekeeping',
        'is_active' => true,
    ]);

    $roomType = RoomType::create([
        'code' => 'SD_TYPE',
        'name' => 'Standard Room',
        'description' => 'Description',
        'default_capacity' => 2,
        'base_price' => 500000,
    ]);

    $room = Room::create([
        'room_number' => '102',
        'floor' => 1,
        'room_type_id' => $roomType->id,
        'status' => 'oc',
    ]);

    $guest = Guest::create([
        'name' => 'John Guest',
        'email' => 'john.guest@email.com',
        'phone' => '08123456789',
        'nationality' => 'Indonesia',
    ]);

    $reservation = Reservation::create([
        'reservation_code' => 'RSV-SD-001',
        'guest_id' => $guest->id,
        'room_type_id' => $roomType->id,
        'room_id' => $room->id,
        'check_in_date' => Carbon::today(),
        'check_out_date' => Carbon::today()->addDays(1),
        'num_adults' => 2,
        'channel' => 'walk_in',
        'status' => 'checked_in',
        'total_amount' => 500000,
        'created_by' => $receptionist->id,
    ]);

    $checkIn = CheckIn::create([
        'reservation_id' => $reservation->id,
        'room_id' => $room->id,
        'check_in_time' => Carbon::now(),
        'deposit_amount' => 500000, // room payment
        'security_deposit' => 300000, // security deposit (e.g. 300.000)
        'deposit_method' => 'cash',
        'processed_by' => $receptionist->id,
    ]);

    $folio = GuestFolio::create([
        'check_in_id' => $checkIn->id,
        'guest_id' => $guest->id,
        'folio_number' => 'FOLIO-102-SD',
        'status' => 'open',
        'total_charges' => 500000, // room charge
        'total_payments' => 500000, // room payment
        'balance' => 0,
    ]);

    // Create a room_inspection task
    $inspectionTask = HousekeepingTask::create([
        'room_id' => $room->id,
        'task_type' => 'room_inspection',
        'priority' => 'urgent',
        'status' => 'pending',
    ]);

    // Complete inspection task and add a damage charge of 100,000
    $response = $this->actingAs($housekeeping)
        ->patchJson("/api/housekeeping/tasks/{$inspectionTask->id}", [
            'status' => 'completed',
            'damage_charges' => [
                ['item_name' => 'Gelas Pecah', 'amount' => 100000]
            ]
        ]);

    $response->assertStatus(200);

    // Verify folio has the damage charge
    $folio->refresh();
    expect($folio->total_charges)->toEqual(600000); // 500k room + 100k damage
    expect($folio->balance)->toEqual(100000);

    // Now, checkout
    $response = $this->actingAs($receptionist)
        ->postJson('/api/checkouts', [
            'check_in_id' => $checkIn->id,
            'payment_method' => 'cash',
            'feedback_notes' => 'Good stay',
        ]);

    $response->assertStatus(200);

    // Verify checkout record
    $checkOut = \App\Models\CheckOut::where('check_in_id', $checkIn->id)->first();
    expect($checkOut)->not->toBeNull();
    expect((float)$checkOut->deposit_amount)->toEqual(300000.00);
    expect((float)$checkOut->damage_charges)->toEqual(100000.00);
    expect((float)$checkOut->deposit_refund)->toEqual(200000.00); // 300k - 100k = 200k refund!
});

test('deleting guest with past reservations cleans up database successfully', function () {
    $receptionist = User::create([
        'name' => 'Receptionist Staff',
        'email' => 'receptionist_test_del@hotelops.com',
        'password' => bcrypt('password123'),
        'role' => 'receptionist',
        'is_active' => true,
    ]);

    $roomType = RoomType::create([
        'code' => 'DEL_TYPE',
        'name' => 'Room Type',
        'description' => 'Desc',
        'default_capacity' => 2,
        'base_price' => 500000,
    ]);

    $room = Room::create([
        'room_number' => '103',
        'floor' => 1,
        'room_type_id' => $roomType->id,
        'status' => 'vc',
    ]);

    $guest = Guest::create([
        'name' => 'Delete Me',
        'email' => 'delete.me@email.com',
        'phone' => '08123456789',
        'nationality' => 'Indonesia',
    ]);

    // Create a past/cancelled reservation
    $reservation = Reservation::create([
        'reservation_code' => 'RSV-DEL-001',
        'guest_id' => $guest->id,
        'room_type_id' => $roomType->id,
        'room_id' => $room->id,
        'check_in_date' => Carbon::today()->subDays(5),
        'check_out_date' => Carbon::today()->subDays(3),
        'num_adults' => 2,
        'channel' => 'walk_in',
        'status' => 'cancelled', // non-active
        'total_amount' => 500000,
        'created_by' => $receptionist->id,
    ]);

    // Now request to delete the guest (must be authenticated as receptionist or admin)
    $response = $this->actingAs($receptionist)
        ->deleteJson("/api/guests/{$guest->id}");

    $response->assertStatus(200);

    // Verify guest is deleted
    expect(Guest::find($guest->id))->toBeNull();
    // Verify associated reservation is also deleted
    expect(Reservation::find($reservation->id))->toBeNull();
});
