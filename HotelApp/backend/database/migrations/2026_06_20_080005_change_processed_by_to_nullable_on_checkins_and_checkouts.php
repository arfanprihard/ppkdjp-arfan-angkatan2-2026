<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Update check_ins
        if (DB::getDriverName() !== 'sqlite') {
            Schema::table('check_ins', function (Blueprint $table) {
                $table->dropForeign(['processed_by']);
            });
        }

        Schema::table('check_ins', function (Blueprint $table) {
            $table->unsignedBigInteger('processed_by')->nullable()->change();
            $table->foreign('processed_by')->references('id')->on('users')->onDelete('set null');
        });

        // 2. Update check_outs
        if (DB::getDriverName() !== 'sqlite') {
            Schema::table('check_outs', function (Blueprint $table) {
                $table->dropForeign(['processed_by']);
            });
        }

        Schema::table('check_outs', function (Blueprint $table) {
            $table->unsignedBigInteger('processed_by')->nullable()->change();
            $table->foreign('processed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        // Biarkan tetap nullable dan set null karena ini perilaku yang lebih baik untuk audit log transaksi
    }
};
