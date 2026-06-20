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
use App\Http\Controllers\FnbItemController;
use Illuminate\Support\Facades\Route;

// ==========================================
// Rute Publik (Tanpa Token)
// ==========================================
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// ==========================================
// Rute Terproteksi (Wajib Login & Membawa Token Sanctum)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    // 1. RUTE GLOBAL (Dapat diakses oleh ALL ROLES staf yang sudah login)
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']); // DashboardController akan membedakan data stats di tingkat query


    // 2. RUTE KAMAR / ROOMS (Dapat diakses oleh Admin, Resepsionis, & Housekeeping)
    Route::middleware('role:admin,receptionist,housekeeping')->group(function () {
        Route::get('/rooms', [RoomController::class, 'index']);
        Route::get('/rooms/{id}', [RoomController::class, 'show']);
        Route::put('/rooms/{id}/status', [RoomController::class, 'updateStatus']); // Untuk checkout (FO) & membersihkan kamar (HK)
        Route::get('/room-types', [RoomController::class, 'getRoomTypes']);
    });


    // 3. RUTE FRONT OFFICE - Reservasi, Check-in/out, Tamu, Billing (Dapat diakses oleh Admin & Resepsionis)
    Route::middleware('role:admin,receptionist')->group(function () {
        // Tamu (Guests)
        Route::get('/guests', [GuestController::class, 'index']);
        Route::post('/guests', [GuestController::class, 'store']);
        Route::get('/guests/{id}', [GuestController::class, 'show']);
        Route::put('/guests/{id}', [GuestController::class, 'update']);
        Route::delete('/guests/{id}', [GuestController::class, 'destroy']);

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
        Route::get('/checkouts/{checkInId}/inspection-status', [CheckOutController::class, 'getInspectionStatus']);
        Route::post('/checkouts/{checkInId}/request-inspection', [CheckOutController::class, 'requestInspection']);

        // Billing / Guest Folio
        Route::get('/folios/{checkInId}', [FolioController::class, 'show']);
        Route::post('/folios/{id}/charges', [FolioController::class, 'addCharge']);
        Route::post('/folios/{id}/settle', [FolioController::class, 'settle']);
    });


    // 4. RUTE HOUSEKEEPING - Kebersihan & Laundry (Dapat diakses oleh Admin & Housekeeping)
    Route::middleware('role:admin,housekeeping')->group(function () {
        // Housekeeping Tasks
        Route::get('/housekeeping/tasks', [HousekeepingController::class, 'index']);
        Route::post('/housekeeping/tasks', [HousekeepingController::class, 'store']);
        Route::patch('/housekeeping/tasks/{id}', [HousekeepingController::class, 'updateStatus']);
        Route::get('/housekeeping/room-board', [HousekeepingController::class, 'roomBoard']);

        // Laundry Requests
        Route::get('/laundry', [LaundryController::class, 'index']);
        Route::post('/laundry', [LaundryController::class, 'store']);
        Route::patch('/laundry/{id}', [LaundryController::class, 'updateStatus']);
    });


    // 5. RUTE FOOD & BEVERAGE ORDERS
    // Membuat Order (Bisa diakses oleh Admin, F&B, dan Resepsionis khusus untuk membuat Room Service)
    Route::post('/fnb/orders', [FnbOrderController::class, 'store'])->middleware('role:admin,fnb,receptionist');
    
    // Lihat Order (Bisa diakses oleh Admin, F&B, dan Resepsionis)
    Route::get('/fnb/orders', [FnbOrderController::class, 'index'])->middleware('role:admin,fnb,receptionist');

    // Mengelola Order Status (Hanya Admin & F&B Service)
    Route::patch('/fnb/orders/{id}/status', [FnbOrderController::class, 'updateStatus'])->middleware('role:admin,fnb');

    // Menu F&B Items (Lihat: Admin, F&B, Resepsionis | Kelola: Admin Only)
    Route::get('/fnb/items', [FnbItemController::class, 'index'])->middleware('role:admin,fnb,receptionist');
    Route::middleware('role:admin')->group(function () {
        Route::post('/fnb/items', [FnbItemController::class, 'store']);
        Route::put('/fnb/items/{id}', [FnbItemController::class, 'update']);
        Route::delete('/fnb/items/{id}', [FnbItemController::class, 'destroy']);
    });


    // 5b. RUTE LAPORAN HARIAN DIVISI / ROLE (Non-Admin)
    Route::get('/reports/receptionist', [ReportController::class, 'receptionistDailyReport'])->middleware('role:admin,receptionist');
    Route::get('/reports/housekeeping', [ReportController::class, 'housekeepingDailyReport'])->middleware('role:admin,housekeeping');
    Route::get('/reports/fnb', [ReportController::class, 'fnbDailyReport'])->middleware('role:admin,fnb');

    // 6. RUTE KHUSUS ADMINISTRATOR (Hanya Admin)
    Route::middleware('role:admin')->group(function () {
        // Laporan Keuangan & Okupansi
        Route::get('/reports/occupancy', [ReportController::class, 'occupancy']);
        Route::get('/reports/revenue', [ReportController::class, 'revenue']);

        // Manajemen Akun Staf (CRUD)
        Route::apiResource('users', UserController::class);

        // Manajemen Kamar (CRUD)
        Route::post('/rooms', [RoomController::class, 'store']);
        Route::put('/rooms/{id}', [RoomController::class, 'update']);
        Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);
    });
});
