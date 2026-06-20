<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('check_outs', function (Blueprint $table) {
            $table->boolean('room_inspected')->default(false)->after('payment_method');
            $table->decimal('deposit_amount', 12, 2)->default(0)->after('room_inspected');
            $table->decimal('damage_charges', 12, 2)->default(0)->after('deposit_amount');
            $table->decimal('deposit_refund', 12, 2)->default(0)->after('damage_charges');
        });
    }

    public function down(): void
    {
        Schema::table('check_outs', function (Blueprint $table) {
            $table->dropColumn(['room_inspected', 'deposit_amount', 'damage_charges', 'deposit_refund']);
        });
    }
};
