<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'default_capacity',
        'base_price',
    ];

    // Relasi: Satu tipe kamar memiliki banyak kamar fisik
    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
}
