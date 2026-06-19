<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('check_outs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('check_in_id')->constrained('check_ins')->onDelete('cascade');
            $table->dateTime('check_out_time');
            $table->decimal('total_bill', 12, 2)->default(0);
            $table->decimal('total_paid', 12, 2)->default(0);
            $table->enum('payment_method', ['cash', 'credit_card', 'debit', 'transfer', 'city_ledger'])->default('cash');
            $table->foreignId('processed_by')->constrained('users')->onDelete('restrict'); // Staff FO
            $table->integer('feedback_rating')->nullable(); // Skala 1-5
            $table->text('feedback_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('check_outs');
    }
};
