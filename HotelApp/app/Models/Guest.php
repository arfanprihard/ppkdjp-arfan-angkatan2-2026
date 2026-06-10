<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'id_type',
        'id_number',
        'phone',
        'email',
        'address',
        'nationality',
    ];

    // Relasi: Satu tamu bisa memiliki banyak reservasi
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
