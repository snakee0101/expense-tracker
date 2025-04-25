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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamp('date');
            $table->decimal('amount');
            $table->string('note')->nullable();
            $table->foreignId('category_id');
            $table->foreignId('user_id');
            $table->nullableMorphs('source');
            $table->morphs('destination'); //transactions always have source and destination. If its one-sided transaction (like income/expense) - then only destination will be set
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
