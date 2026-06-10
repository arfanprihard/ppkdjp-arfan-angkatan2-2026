<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laundry_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guest_id')->constrained('guests')->onDelete('cascade');
            $table->foreignId('room_id')->constrained('rooms')->onDelete('cascade');
            $table->text('items_description');
            $table->integer('item_count')->default(0);
            $table->decimal('total_charge', 12, 2)->default(0);
            $table->enum('status', ['received', 'processing', 'done', 'delivered'])->default('received');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null'); // Staff HK
            $table->dateTime('received_at')->nullable();
            $table->dateTime('delivered_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laundry_requests');
    }
};
