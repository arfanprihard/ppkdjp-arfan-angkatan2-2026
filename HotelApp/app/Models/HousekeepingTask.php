<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HousekeepingTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'task_type',
        'priority',
        'status',
        'assigned_to',
        'notes',
        'completed_at',
    ];

    // Relasi ke Kamar (Room) yang dibersihkan/dikerjakan
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    // Relasi ke User (Staff HK yang ditugaskan)
    public function assignedStaff()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
