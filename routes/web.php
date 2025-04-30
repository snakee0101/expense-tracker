<?php

use App\Http\Controllers\CardController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\IncomeExpenseController;
use App\Http\Controllers\SavingsPlanController;
use App\Http\Controllers\TransactionCategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\WalletController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('transaction_category', TransactionCategoryController::class);
    Route::resource('transaction', TransactionController::class);
    Route::resource('wallet', WalletController::class);
    Route::resource('card', CardController::class);
    Route::resource('savings_plan', SavingsPlanController::class);
    Route::resource('transfer', TransferController::class);
    Route::resource('contact', ContactController::class);
    Route::post('savings_plan/transaction', [SavingsPlanController::class, 'transaction'])->name('savings_plan.transaction');

    Route::post('income_expense', [IncomeExpenseController::class, 'store'])->name('income_expense.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
