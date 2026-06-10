<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fnb_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 20)->unique(); // Contoh: FNB-20260609-001
            $table->enum('outlet', ['resto', 'lounge', 'room_service']);
            $table->foreignId('guest_id')->nullable()->constrained('guests')->onDelete('set null');
            $table->foreignId('room_id')->nullable()->constrained('rooms')->onDelete('set null');
            $table->enum('charge_to', ['room', 'cash', 'card'])->default('cash');
            $table->enum('status', ['pending', 'preparing', 'served', 'closed', 'cancelled'])->default('pending');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null'); // Staff F&B
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fnb_orders');
    }
};
