<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Models\Reservation;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * Otomatisasi status reservasi:
 * - Mengubah status 'confirmed' yang melewati tanggal check-out menjadi 'no_show'.
 * - Mengubah status 'pending' yang melewati tanggal check-in menjadi 'cancelled'.
 */
Artisan::command('reservations:auto-no-show', function () {
    $today = now()->toDateString();
    
    // 1. Confirmed -> No Show (jika check_out_date <= hari ini)
    $noShowCount = Reservation::where('status', 'confirmed')
        ->where('check_out_date', '<=', $today)
        ->update(['status' => 'no_show']);
        
    // 2. Pending -> Cancelled (jika check_in_date < hari ini)
    $cancelledCount = Reservation::where('status', 'pending')
        ->where('check_in_date', '<', $today)
        ->update(['status' => 'cancelled']);
        
    $this->info("Auto No-Show: {$noShowCount} reservations updated to 'no_show'.");
    $this->info("Auto Cancel: {$cancelledCount} pending reservations updated to 'cancelled'.");
})->purpose('Automatically mark past confirmed reservations as no_show and pending as cancelled');

// Jadwalkan agar berjalan setiap hari pada pukul 12:00 siang
Schedule::command('reservations:auto-no-show')->dailyAt('12:00');
