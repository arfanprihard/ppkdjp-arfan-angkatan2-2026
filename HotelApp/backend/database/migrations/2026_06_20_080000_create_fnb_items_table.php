<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fnb_items', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->enum('category', ['food', 'beverage', 'dessert', 'snack']);
            $table->decimal('price', 12, 2);
            $table->text('description')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        // Seed default menu items
        DB::table('fnb_items')->insert([
            // Food
            ['name' => 'Nasi Goreng Spesial', 'category' => 'food', 'price' => 45000, 'description' => 'Nasi goreng dengan telur, ayam, dan sayuran', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mie Goreng', 'category' => 'food', 'price' => 40000, 'description' => 'Mie goreng dengan telur dan sayuran', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Ayam Bakar', 'category' => 'food', 'price' => 55000, 'description' => 'Ayam bakar bumbu kecap dengan sambal', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Soto Ayam', 'category' => 'food', 'price' => 35000, 'description' => 'Soto ayam dengan nasi putih', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Rendang Sapi', 'category' => 'food', 'price' => 65000, 'description' => 'Rendang daging sapi empuk', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Gado-Gado', 'category' => 'food', 'price' => 30000, 'description' => 'Sayuran segar dengan bumbu kacang', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sandwich Club', 'category' => 'food', 'price' => 50000, 'description' => 'Club sandwich dengan kentang goreng', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Burger Premium', 'category' => 'food', 'price' => 60000, 'description' => 'Beef burger premium dengan keju dan salad', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],

            // Beverage
            ['name' => 'Es Teh Manis', 'category' => 'beverage', 'price' => 12000, 'description' => 'Teh manis dingin', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Jus Jeruk', 'category' => 'beverage', 'price' => 20000, 'description' => 'Jus jeruk segar', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Kopi Hitam', 'category' => 'beverage', 'price' => 18000, 'description' => 'Kopi hitam panas', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Cappuccino', 'category' => 'beverage', 'price' => 28000, 'description' => 'Cappuccino dengan latte art', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Air Mineral', 'category' => 'beverage', 'price' => 8000, 'description' => 'Air mineral botol', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Jus Alpukat', 'category' => 'beverage', 'price' => 25000, 'description' => 'Jus alpukat segar dengan susu', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],

            // Dessert
            ['name' => 'Es Krim Coklat', 'category' => 'dessert', 'price' => 22000, 'description' => '2 scoop es krim coklat premium', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Pisang Goreng', 'category' => 'dessert', 'price' => 18000, 'description' => 'Pisang goreng crispy dengan madu', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Pudding Karamel', 'category' => 'dessert', 'price' => 20000, 'description' => 'Pudding karamel lembut', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],

            // Snack
            ['name' => 'French Fries', 'category' => 'snack', 'price' => 25000, 'description' => 'Kentang goreng dengan saus', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Chicken Wings', 'category' => 'snack', 'price' => 35000, 'description' => '6 pcs sayap ayam goreng crispy', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Tahu Goreng', 'category' => 'snack', 'price' => 15000, 'description' => 'Tahu goreng dengan sambal kecap', 'is_available' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('fnb_items');
    }
};
