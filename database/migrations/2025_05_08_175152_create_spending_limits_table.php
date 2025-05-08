<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('spending_limits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->decimal('limit_amount')->nullable(); //if limit is null - then there is no limit - this is a global limit (all cards/wallets included) of spending per month; when the limit is reached - you can no longer spend
            $table->unsignedTinyInteger('day_of_month_period_start')->nullable(); // here you set the day when the period starts; for example, if period starts at '15' day - then it ends on '15' day of the next month;
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spending_limits');
    }
};
