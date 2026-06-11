<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guest_folios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('check_in_id')->constrained('check_ins')->onDelete('cascade');
            $table->foreignId('guest_id')->constrained('guests')->onDelete('cascade');
            $table->string('folio_number', 20)->unique(); // Contoh: FOLIO-101-202606
            $table->enum('status', ['open', 'settled', 'void'])->default('open');
            $table->decimal('total_charges', 12, 2)->default(0);
            $table->decimal('total_payments', 12, 2)->default(0);
            $table->decimal('balance', 12, 2)->default(0); // Sisa tagihan
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guest_folios');
    }
};
