<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

// Saat seseorang membuka http://localhost:8000/ (port Laravel), 
// dia hanya akan mendapatkan pesan teks JSON bahwa API sedang berjalan.
Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'HotelOps API is running'
    ]);
})->name('home');

// Route untuk menjalankan migrasi pada server yang sudah dideploy (seperti Railway)
Route::get('/run-migrations', function () {
    try {
        Artisan::call('migrate', ['--force' => true]);
        return response()->json([
            'status' => 'success',
            'message' => 'Migrations run successfully',
            'output' => Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Route untuk melihat log error Laravel pada server yang dideploy untuk diagnosis 500 error
Route::get('/view-logs', function () {
    $logPath = storage_path('logs/laravel.log');
    if (!file_exists($logPath)) {
        return 'Log file does not exist.';
    }
    $lines = file($logPath);
    $lastLines = array_slice($lines, -100);
    return '<pre>' . implode('', $lastLines) . '</pre>';
});

