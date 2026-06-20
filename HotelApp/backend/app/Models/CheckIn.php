<?php

namespace App\Models;

use App\Models\GuestFolio;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckIn extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'room_id',
        'check_in_time',
        'deposit_amount',
        'security_deposit',
        'deposit_method',
        'processed_by',
        'notes',
    ];

    // Relasi ke Reservation
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    // Relasi ke Room
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    // Relasi ke User (Staff FO)
    public function staff()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    // Relasi ke CheckOut (Satu check-in berpasangan dengan satu check-out)
    public function checkOut()
    {
        return $this->hasOne(CheckOut::class);
    }

    // Relasi ke GuestFolio (Satu check-in memiliki satu folio tagihan)
    public function folio()
    {
        return $this->hasOne(GuestFolio::class);
    }
}
