<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Rute umum (tidak butuh login untuk mengaksesnya)
Route::post('/login', [AuthController::class, 'login']);
// Rute yang harus dilindungi (wajib menyertakan Token API saat mengakses)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
