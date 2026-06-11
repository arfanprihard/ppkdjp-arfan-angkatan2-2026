<?php

namespace App\Models;

use App\Models\GuestFolio;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FolioCharge extends Model
{
    use HasFactory;

    protected $fillable = [
        'folio_id',
        'charge_type',
        'description',
        'amount',
        'quantity',
        'charge_date',
        'reference_id',
        'reference_type',
        'created_by',
    ];

    // Relasi ke GuestFolio
    public function folio()
    {
        return $this->belongsTo(GuestFolio::class);
    }

    // Relasi ke User (Staff pembuat transaksi)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relasi Polimorfik ke sumber charge (Misal: LaundryRequest atau FnbOrder)
    public function reference()
    {
        return $this->morphTo();
    }
}
