<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('id_type', ['ktp', 'passport', 'sim'])->default('ktp');
            $table->string('id_number', 50)->nullable()->unique();
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable()->unique();
            $table->text('address')->nullable();
            $table->string('nationality', 100)->default('Indonesia');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
