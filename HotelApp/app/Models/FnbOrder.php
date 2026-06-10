<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FnbOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'outlet',
        'guest_id',
        'room_id',
        'charge_to',
        'status',
        'subtotal',
        'tax',
        'total',
        'notes',
        'created_by',
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relasi One-to-Many ke item pesanan
    public function items()
    {
        return $this->hasMany(FnbOrderItem::class, 'order_id');
    }

    // Mendapatkan data charge di Folio (relasi polimorfik)
    public function folioCharge()
    {
        return $this->morphOne(FolioCharge::class, 'reference');
    }
}
