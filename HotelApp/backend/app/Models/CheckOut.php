<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckOut extends Model
{
    use HasFactory;

    protected $fillable = [
        'check_in_id',
        'check_out_time',
        'total_bill',
        'total_paid',
        'payment_method',
        'processed_by',
        'feedback_rating',
        'feedback_notes',
        'room_inspected',
        'deposit_amount',
        'damage_charges',
        'deposit_refund',
    ];

    // Relasi ke CheckIn
    public function checkIn()
    {
        return $this->belongsTo(CheckIn::class);
    }

    // Relasi ke User (Staff FO)
    public function staff()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
