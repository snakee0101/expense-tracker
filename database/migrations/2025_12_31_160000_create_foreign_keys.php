<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaction_categories', function (Blueprint $table) {
            $table->foreign('user_id', 'category_owner')
                    ->references('id')
                    ->on('users');
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->foreign('user_id', 'wallet_owner')
                ->references('id')
                ->on('users');
        });
    }

    public function down(): void
    {
        Schema::table('wallets', function (Blueprint $table) {
            $table->dropForeign('wallet_owner');
        });

        Schema::table('transaction_categories', function (Blueprint $table) {
            $table->dropForeign('category_owner');
        });
    }
};
