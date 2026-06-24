<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_number',
        'floor',
        'room_type_id',
        'status',
        'notes',
    ];

    // Relasi: Kamar fisik terhubung ke satu tipe kamar
    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }

    // Relasi: Kamar fisik memiliki banyak tugas kebersihan
    public function housekeepingTasks()
    {
        return $this->hasMany(HousekeepingTask::class);
    }
}
