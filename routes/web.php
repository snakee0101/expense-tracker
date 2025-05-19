<?php

use App\Http\Controllers\InboxController;
use App\Http\Controllers\PaymentCategoryController;
use App\Http\Controllers\PaymentController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CardController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\SavingsPlanController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\IncomeExpenseController;
use App\Http\Controllers\SpendingLimitController;
use App\Http\Controllers\RecurringPaymentController;
use App\Http\Controllers\TransactionCategoryController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('transaction_category', TransactionCategoryController::class)->except('update');
    Route::post('transaction_category/{transactionCategory}/update', [TransactionCategoryController::class, 'update'])->name('transaction_category.update');

    Route::resource('transaction', TransactionController::class);
    Route::get('transactions/export', [TransactionController::class, 'export'])->name('transaction.export');
    Route::get('transactions/{transaction}/cancel', [TransactionController::class, 'cancel'])->name('transaction.cancel');
    Route::get('transactions/{transaction}/redo', [TransactionController::class, 'redo'])->name('transaction.redo');

    Route::resource('recurring_payment', RecurringPaymentController::class);
    Route::resource('wallet', WalletController::class);
    Route::resource('card', CardController::class);
    Route::resource('savings_plan', SavingsPlanController::class);
    Route::resource('transfer', TransferController::class);
    Route::resource('payment', PaymentController::class);
    Route::resource('payment_category', PaymentCategoryController::class);

    Route::resource('contact', ContactController::class)->except('update');
    Route::post('contact/{contact}/update', [ContactController::class, 'update'])->name('contact.update');

    Route::post('savings_plan/transaction', [SavingsPlanController::class, 'transaction'])->name('savings_plan.transaction');
    Route::get('download_attachment/{attachment}', [AttachmentController::class, 'download'])->name('download_attachment');

    Route::post('income_expense', [IncomeExpenseController::class, 'store'])->name('income_expense.store');
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('spending_limit', [SpendingLimitController::class, 'store'])->name('spending_limit.store');
    Route::delete('spending_limit', [SpendingLimitController::class, 'destroy'])->name('spending_limit.destroy');

    Route::get('inbox', [InboxController::class, 'index'])->name('inbox.index');
    Route::post('inbox/read_notification/{notificationId}', [InboxController::class, 'read_notification'])->name('inbox.read_notification');
    Route::post('inbox/delete_notification/{notificationId}', [InboxController::class, 'delete_notification'])->name('inbox.delete_notification');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
