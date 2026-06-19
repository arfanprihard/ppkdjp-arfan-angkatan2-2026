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
        // 1. Guests Table: unique constraints
        Schema::table('guests', function (Blueprint $table) {
            $indexes = Schema::getIndexes('guests');
            $indexNames = array_column($indexes, 'name');

            if (!in_array('guests_id_number_unique', $indexNames)) {
                $table->unique('id_number');
            }
            if (!in_array('guests_email_unique', $indexNames)) {
                $table->unique('email');
            }
        });

        // 2. Rooms Table: change room_type_id foreign key constraint and add status index
        Schema::table('rooms', function (Blueprint $table) {
            $indexes = Schema::getIndexes('rooms');
            $indexNames = array_column($indexes, 'name');

            try {
                $table->dropForeign(['room_type_id']);
                $table->foreign('room_type_id')->references('id')->on('room_types')->onDelete('restrict');
            } catch (\Exception $e) {
                // If it fails (e.g. already restrict or SQLite environment), ignore
            }

            if (!in_array('rooms_status_index', $indexNames)) {
                $table->index('status');
            }
        });

        // 3. Reservations Table: change guest_id and room_type_id foreign keys, add status index
        Schema::table('reservations', function (Blueprint $table) {
            $indexes = Schema::getIndexes('reservations');
            $indexNames = array_column($indexes, 'name');

            try {
                $table->dropForeign(['guest_id']);
                $table->foreign('guest_id')->references('id')->on('guests')->onDelete('restrict');
            } catch (\Exception $e) {}

            try {
                $table->dropForeign(['room_type_id']);
                $table->foreign('room_type_id')->references('id')->on('room_types')->onDelete('restrict');
            } catch (\Exception $e) {}

            if (!in_array('reservations_status_index', $indexNames)) {
                $table->index('status');
            }
        });

        // 4. Check-Ins Table: change processed_by foreign key constraint
        Schema::table('check_ins', function (Blueprint $table) {
            try {
                $table->dropForeign(['processed_by']);
                $table->foreign('processed_by')->references('id')->on('users')->onDelete('restrict');
            } catch (\Exception $e) {}
        });

        // 5. Check-Outs Table: change processed_by foreign key constraint
        Schema::table('check_outs', function (Blueprint $table) {
            try {
                $table->dropForeign(['processed_by']);
                $table->foreign('processed_by')->references('id')->on('users')->onDelete('restrict');
            } catch (\Exception $e) {}
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('check_outs', function (Blueprint $table) {
            try {
                $table->dropForeign(['processed_by']);
                $table->foreign('processed_by')->references('id')->on('users')->onDelete('cascade');
            } catch (\Exception $e) {}
        });

        Schema::table('check_ins', function (Blueprint $table) {
            try {
                $table->dropForeign(['processed_by']);
                $table->foreign('processed_by')->references('id')->on('users')->onDelete('cascade');
            } catch (\Exception $e) {}
        });

        Schema::table('reservations', function (Blueprint $table) {
            try {
                $table->dropForeign(['guest_id']);
                $table->foreign('guest_id')->references('id')->on('guests')->onDelete('cascade');
            } catch (\Exception $e) {}

            try {
                $table->dropForeign(['room_type_id']);
                $table->foreign('room_type_id')->references('id')->on('room_types')->onDelete('cascade');
            } catch (\Exception $e) {}

            try {
                $table->dropIndex(['status']);
            } catch (\Exception $e) {}
        });

        Schema::table('rooms', function (Blueprint $table) {
            try {
                $table->dropForeign(['room_type_id']);
                $table->foreign('room_type_id')->references('id')->on('room_types')->onDelete('cascade');
            } catch (\Exception $e) {}

            try {
                $table->dropIndex(['status']);
            } catch (\Exception $e) {}
        });

        Schema::table('guests', function (Blueprint $table) {
            try {
                $table->dropUnique(['id_number']);
                $table->dropUnique(['email']);
            } catch (\Exception $e) {}
        });
    }
};
