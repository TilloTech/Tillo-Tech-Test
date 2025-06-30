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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('card_type')->nullable(); // Visa, Mastercard, etc.
            $table->string('last_four_digits');
            $table->string('expiry_month');
            $table->string('expiry_year');
            $table->string('transaction_id')->nullable();
            $table->string('status')->default('pending'); // pending, completed, failed
            $table->decimal('amount', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
