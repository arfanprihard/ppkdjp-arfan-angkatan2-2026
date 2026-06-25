<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE housekeeping_tasks MODIFY COLUMN task_type ENUM('room_cleaning', 'turndown', 'deep_clean', 'pool', 'public_area', 'room_inspection', 'extra_bed', 'laundry') NOT NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE housekeeping_tasks MODIFY COLUMN task_type ENUM('room_cleaning', 'turndown', 'deep_clean', 'pool', 'public_area', 'room_inspection', 'extra_bed') NOT NULL");
        }
    }
};
