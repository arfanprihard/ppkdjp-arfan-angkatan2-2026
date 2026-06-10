<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('room_types', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique(); // Contoh: 'STD', 'DLX', 'SUT'
            $table->string('name', 100);          // Contoh: 'Standard Room', 'Deluxe Room'
            $table->text('description')->nullable();
            $table->integer('default_capacity')->default(2); // Kapasitas standar orang
            $table->decimal('base_price', 12, 2)->default(0); // Harga dasar per malam
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_types');
    }
};
