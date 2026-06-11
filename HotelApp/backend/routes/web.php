<?php

use Illuminate\Support\Facades\Route;

// Saat seseorang membuka http://localhost:8000/ (port Laravel), 
// dia hanya akan mendapatkan pesan teks JSON bahwa API sedang berjalan.
Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'HotelOps API is running'
    ]);
});
