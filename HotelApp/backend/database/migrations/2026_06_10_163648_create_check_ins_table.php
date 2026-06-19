<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('check_ins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations')->onDelete('cascade');
            $table->foreignId('room_id')->constrained('rooms')->onDelete('cascade');
            $table->dateTime('check_in_time');
            $table->decimal('deposit_amount', 12, 2)->default(0);
            $table->enum('deposit_method', ['cash', 'credit_card', 'debit', 'transfer'])->default('cash');
            $table->foreignId('processed_by')->constrained('users')->onDelete('restrict'); // Staff FO
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('check_ins');
    }
};
