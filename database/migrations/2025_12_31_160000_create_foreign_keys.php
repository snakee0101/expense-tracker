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

        Schema::table('cards', function (Blueprint $table) {
            $table->foreign('user_id', 'card_owner')
                ->references('id')
                ->on('users');
        });

        Schema::table('savings_plans', function (Blueprint $table) {
            $table->foreign('user_id', 'savings_plan_owner')
                    ->references('id')
                    ->on('users');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->foreign('category_id', 'transaction_category_id')
                ->references('id')
                ->on('transaction_categories');

            $table->foreign('user_id', 'transaction_user_id')
                ->references('id')
                ->on('users');
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->foreign('user_id', 'contact_owner_id')
                ->references('id')
                ->on('users');
        });

        Schema::table('attachments', function (Blueprint $table) {
            $table->foreign('transaction_id', 'fk_transaction_id')
                ->references('id')
                ->on('transactions');
        });

        Schema::table('recurring_payments', function (Blueprint $table) {
            $table->foreign('user_id', 'fk_recurring_payment_owner_id')
                ->references('id')
                ->on('users');

            $table->foreign('category_id', 'recurring_payment_transaction_category_id')
                ->references('id')
                ->on('transaction_categories');
        });

        Schema::table('spending_limits', function (Blueprint $table) {
            $table->foreign('user_id', 'spending_limit_owner_id')
                ->references('id')
                ->on('users');
        });
    }

    public function down(): void
    {
        Schema::table('spending_limits', function (Blueprint $table) {
            $table->dropForeign( 'spending_limit_owner_id');
        });

        Schema::table('recurring_payments', function (Blueprint $table) {
            $table->dropForeign('fk_recurring_payment_owner_id');
            $table->dropForeign('recurring_payment_transaction_category_id');
        });

        Schema::table('attachments', function (Blueprint $table) {
            $table->dropForeign('fk_transaction_id');
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->dropForeign('contact_owner_id');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign('transaction_category_id');
            $table->dropForeign('transaction_user_id');
        });

        Schema::table('savings_plans', function (Blueprint $table) {
            $table->dropForeign('savings_plan_owner');
        });

        Schema::table('cards', function (Blueprint $table) {
            $table->dropForeign('card_owner');
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->dropForeign('wallet_owner');
        });

        Schema::table('transaction_categories', function (Blueprint $table) {
            $table->dropForeign('category_owner');
        });
    }
};
