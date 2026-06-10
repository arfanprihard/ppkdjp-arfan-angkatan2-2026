<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_code',
        'guest_id',
        'room_id',
        'room_type_id',
        'check_in_date',
        'check_out_date',
        'num_adults',
        'num_children',
        'channel',
        'ota_name',
        'status',
        'special_request',
        'total_amount',
        'created_by',
    ];

    // Relasi ke Guest
    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    // Relasi ke Room
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    // Relasi ke RoomType
    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }

    // Relasi ke User (Staff pembuat)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
