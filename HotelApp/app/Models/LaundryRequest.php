<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaundryRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'room_id',
        'items_description',
        'item_count',
        'total_charge',
        'status',
        'assigned_to',
        'received_at',
        'delivered_at',
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Mendapatkan data charge di Folio (relasi polimorfik)
    public function folioCharge()
    {
        return $this->morphOne(FolioCharge::class, 'reference');
    }
}
