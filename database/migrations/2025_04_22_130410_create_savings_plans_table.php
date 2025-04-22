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
        Schema::create('savings_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('balance')->default(0);
            $table->decimal('target_balance');
            $table->foreignId('user_id');
            $table->timestamp('due_date');
            $table->text('savings_tips');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savings_plans');
    }
};
