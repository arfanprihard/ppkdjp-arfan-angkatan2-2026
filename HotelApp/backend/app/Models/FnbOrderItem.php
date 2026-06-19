<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FnbOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'item_name',
        'quantity',
        'unit_price',
        'subtotal',
        'notes',
    ];

    public function order()
    {
        return $this->belongsTo(FnbOrder::class, 'order_id');
    }
}
