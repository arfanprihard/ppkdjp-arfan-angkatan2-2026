<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('folio_charges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('folio_id')->constrained('guest_folios')->onDelete('cascade');
            $table->enum('charge_type', ['room', 'fnb', 'laundry', 'minibar', 'extra_bed', 'other']);
            $table->string('description');
            $table->decimal('amount', 12, 2);
            $table->integer('quantity')->default(1);
            $table->date('charge_date');

            // Kolom polimorfik nullable untuk link ke order F&B / Laundry
            $table->nullableMorphs('reference'); // Menghasilkan: reference_id & reference_type

            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('folio_charges');
    }
};
