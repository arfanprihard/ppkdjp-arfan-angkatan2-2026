<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Locker extends Model
{
    protected $fillable = ['locker_name', 'batch', 'major_name', 'status'];
}
