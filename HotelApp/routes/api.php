<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CheckInController;
use App\Http\Controllers\CheckOutController;
use App\Http\Controllers\FolioController;
use App\Http\Controllers\HousekeepingController;
use App\Http\Controllers\LaundryController;
use App\Http\Controllers\FnbOrderController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// ==========================================
// Rute Publik (Tanpa Token)
// ==========================================
Route::post('/login', [AuthController::class, 'login']);

// ==========================================
// Rute Terproteksi (Wajib Token Bearer)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth & Profil
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard Stats
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Kamar (Rooms)
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::get('/rooms/{id}', [RoomController::class, 'show']);
    Route::put('/rooms/{id}/status', [RoomController::class, 'updateStatus']);

    // Tamu (Guests)
    Route::get('/guests', [GuestController::class, 'index']);
    Route::post('/guests', [GuestController::class, 'store']);
    Route::get('/guests/{id}', [GuestController::class, 'show']);
    Route::put('/guests/{id}', [GuestController::class, 'update']);

    // Reservasi
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::put('/reservations/{id}', [ReservationController::class, 'update']);
    Route::patch('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);

    // Check-in & Check-out
    Route::get('/checkins/today', [CheckInController::class, 'expectedArrivals']);
    Route::post('/checkins', [CheckInController::class, 'store']);
    Route::get('/checkouts/today', [CheckOutController::class, 'expectedDepartures']);
    Route::post('/checkouts', [CheckOutController::class, 'store']);

    // Billing / Folio
    Route::get('/folios/{checkInId}', [FolioController::class, 'show']);
    Route::post('/folios/{id}/charges', [FolioController::class, 'addCharge']);
    Route::post('/folios/{id}/settle', [FolioController::class, 'settle']);

    // Housekeeping
    Route::get('/housekeeping/tasks', [HousekeepingController::class, 'index']);
    Route::post('/housekeeping/tasks', [HousekeepingController::class, 'store']);
    Route::patch('/housekeeping/tasks/{id}', [HousekeepingController::class, 'updateStatus']);
    Route::get('/housekeeping/room-board', [HousekeepingController::class, 'roomBoard']);

    // Laundry
    Route::get('/laundry', [LaundryController::class, 'index']);
    Route::post('/laundry', [LaundryController::class, 'store']);
    Route::patch('/laundry/{id}', [LaundryController::class, 'updateStatus']);

    // F&B Orders
    Route::get('/fnb/orders', [FnbOrderController::class, 'index']);
    Route::post('/fnb/orders', [FnbOrderController::class, 'store']);
    Route::patch('/fnb/orders/{id}/status', [FnbOrderController::class, 'updateStatus']);

    // Laporan (Hanya Admin)
    Route::get('/reports/occupancy', [ReportController::class, 'occupancy']);
    Route::get('/reports/revenue', [ReportController::class, 'revenue']);

    // User / Staff Management (Hanya Admin)
    Route::apiResource('users', UserController::class);
});
