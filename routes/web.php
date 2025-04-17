<?php

use App\Http\Controllers\TransactionCategoryController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('transaction_category', TransactionCategoryController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
