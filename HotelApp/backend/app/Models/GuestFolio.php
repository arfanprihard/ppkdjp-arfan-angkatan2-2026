<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestFolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'check_in_id',
        'guest_id',
        'folio_number',
        'status',
        'total_charges',
        'total_payments',
        'balance',
    ];

    // Relasi ke CheckIn
    public function checkIn()
    {
        return $this->belongsTo(CheckIn::class);
    }

    // Relasi ke Guest
    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    // Relasi: Satu folio bisa memiliki banyak item tagihan (charges)
    public function charges()
    {
        return $this->hasMany(FolioCharge::class, 'folio_id');
    }
}
