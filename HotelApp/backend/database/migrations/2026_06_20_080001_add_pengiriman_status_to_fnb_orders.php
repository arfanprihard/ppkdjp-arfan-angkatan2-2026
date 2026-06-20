<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Ubah enum status dari ['proses', 'selesai'] menjadi ['proses', 'pengiriman', 'selesai']
        if (DB::connection()->getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE fnb_orders MODIFY COLUMN status ENUM('proses', 'pengiriman', 'selesai') DEFAULT 'proses'");
        }
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE fnb_orders MODIFY COLUMN status ENUM('proses', 'selesai') DEFAULT 'proses'");
        }
    }
};
