<?php

use App\Http\Controllers\CardController;
use App\Http\Controllers\TransactionCategoryController;
use App\Http\Controllers\WalletController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('transaction_category', TransactionCategoryController::class);
    Route::resource('wallet', WalletController::class);
    Route::resource('card', CardController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
