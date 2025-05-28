<?php

namespace App\Http\Controllers;

use App\Actions\AccountsList;
use App\Actions\Payments\CreatePaymentTransactionAction;
use App\Actions\Payments\DeductFromBalanceAction;
use App\Actions\SaveTransactionReceiptsAction;
use App\Http\Requests\Payments\CreatePaymentRequest;
use App\Http\Requests\Payments\MakePaymentRequest;
use App\Http\Requests\Payments\UpdatePaymentRequest;
use App\Models\Payment;
use App\Models\PaymentCategory;
use App\Models\TransactionCategory;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('payments', [
            'payments' => Payment::where('user_id', auth()->id())
                ->latest()
                ->get(),
            'paymentCategories' => PaymentCategory::where('user_id', auth()->id())
                ->latest()
                ->get()
                ->map(function($paymentCategory) {
                    $paymentCategory->image_path = Storage::url($paymentCategory->image_path);
                    return $paymentCategory;
                }),
            'transactionCategories' => TransactionCategory::where('user_id', auth()->id())->latest()->get(),
            'accounts' => app()->call(AccountsList::class, ['checkForExpiryDate' => true])
        ]);
    }

    public function store(CreatePaymentRequest $request)
    {
        Payment::create([
            ...$request->validated(),
            'user_id' => auth()->id()
        ]);

        return to_route('payment.index');
    }

    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        $payment->update($request->validated());

        return to_route('payment.index');
    }

    public function transaction(MakePaymentRequest $request, Payment $payment)
    {
        $transaction = app()->call(CreatePaymentTransactionAction::class, ['request' => $request, 'payment' => $payment]);

        app()->call(DeductFromBalanceAction::class, ['transaction' => $transaction, 'payment' => $payment]);

        app()->call(SaveTransactionReceiptsAction::class, ['request' => $request, 'transaction' => $transaction]);

        return to_route('payment.index');
    }
}
