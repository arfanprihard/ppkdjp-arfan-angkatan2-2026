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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_number', 10)->unique(); // Contoh: '101', '102', '201'
            $table->integer('floor');                    // Lokasi lantai kamar
            $table->foreignId('room_type_id')->constrained('room_types')->onDelete('restrict'); // Relasi ke tipe kamar

            // Status kamar sesuai standar hotel (default: vc / kosong bersih)
            $table->enum('status', ['vc', 'vd', 'oc', 'od', 'ooo', 'oos'])->default('vc')->index();
            // Keterangan status:
            // vc = Vacant Clean (Kosong bersih - siap pakai)
            // vd = Vacant Dirty (Kosong kotor - perlu dibersihkan)
            // oc = Occupied Clean (Terisi bersih)
            // od = Occupied Dirty (Terisi kotor)
            // ooo = Out of Order (Rusak)
            // oos = Out of Service (Renovasi/tutup sementara)

            $table->text('notes')->nullable(); // Catatan tambahan (misal: "AC berisik")
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
