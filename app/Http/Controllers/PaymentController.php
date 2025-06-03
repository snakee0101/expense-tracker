<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Payment;
use App\Actions\AccountsList;
use App\Models\PaymentCategory;
use Illuminate\Support\Facades\Storage;
use App\Actions\SaveTransactionReceiptsAction;
use App\Actions\Payments\DeductFromBalanceAction;
use App\Http\Requests\Payments\MakePaymentRequest;
use App\DataTransferObjects\TransactionReceiptsDto;
use App\Http\Requests\Payments\CreatePaymentRequest;
use App\Http\Requests\Payments\UpdatePaymentRequest;
use App\Actions\Payments\CreatePaymentTransactionAction;
use App\DataTransferObjects\Payments\DeductFromBalanceDto;
use App\DataTransferObjects\Payments\CreatePaymentTransactionDto;

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
        $transaction = app()->call(CreatePaymentTransactionAction::class, ['dto' => CreatePaymentTransactionDto::fromPayment($request, $payment)]);

        app()->call(DeductFromBalanceAction::class, ['dto' => DeductFromBalanceDto::fromTransactionData($transaction, $payment)]);

        app()->call(SaveTransactionReceiptsAction::class, ['dto' => TransactionReceiptsDto::fromTransactionData($request, $transaction)]);

        return to_route('payment.index');
    }
}
