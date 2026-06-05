<?php

use App\Http\Controllers\LatihanController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/latihan', [LatihanController::class, 'index']);
Route::get('/tambah', [LatihanController::class, 'tambah'])->name('tambah');
Route::get('/kurang', [LatihanController::class, 'kurang'])->name('kurang');
Route::get('/bagi', [LatihanController::class, 'bagi'])->name('bagi');
Route::get('/kali', [LatihanController::class, 'kali'])->name('kali');
Route::post('/action-tambah', [LatihanController::class, 'actionTambah'])->name('action-tambah');
Route::post('/action-kurang', [LatihanController::class, 'actionKurang'])->name('action-kurang');
Route::post('/action-bagi', [LatihanController::class, 'actionBagi'])->name('action-bagi');
Route::post('/action-kali', [LatihanController::class, 'actionKali'])->name('action-kali');

Route::get('/profile', [ProfileController::class, 'index']);

// Route::get('profile', function () {
//     return view('profile.index');
// });

// Login
Route::get('/', [LoginController::class, 'index'])->name('login');

//

Route::post('action-login', [LoginController::class, 'actionLogin'])->name('action-login');
Route::post('action-logout', [LoginController::class, 'actionLogout'])->name('action-logout');

Route::middleware(['auth', 'prevent-back'])->group(function () {
    Route::get('dashboard', function () {
        return view('dashboard.index');
    });
});

Route::resource('user', UserController::class);
Route::resource('role', RoleController::class);
