<?php

namespace App\Http\Controllers;

use App\Actions\Payments\CreatePaymentTransactionAction;
use App\Actions\Payments\DeductFromBalanceAction;
use App\Actions\Payments\SavePaymentTransactionReceiptsAction;
use App\Enums\TransactionStatus;
use App\Http\Requests\Payments\CreatePaymentRequest;
use App\Http\Requests\Payments\MakePaymentRequest;
use App\Http\Requests\Payments\UpdatePaymentRequest;
use App\Models\Card;
use App\Models\Contact;
use App\Models\Payment;
use App\Models\PaymentCategory;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\Wallet;
use App\Rules\CheckCardExpiration;
use App\Rules\WithinSpendingLimit;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $accounts = Wallet::where('user_id', auth()->id())->get()->map(function (Wallet $wallet) {
            return [
                'id' => $wallet->id,
                'type' => Wallet::class,
                'name' => $wallet->name,
                'balance' => $wallet->balance
            ];
        });

        $accounts->push(...Card::where('user_id', auth()->id())->whereDate('expiry_date', '>=', now())->get()->map(function (Card $card) {
            return [
                'id' => $card->id,
                'type' => Card::class,
                'name' => $card->name,
                'balance' => $card->balance
            ];
        }));

        return Inertia::render('payments', [
            'payments' => Payment::whereHas('paymentCategory', function ($q) {
                    $q->where('user_id', auth()->id());
                })
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
            'accounts' => $accounts,
            'transactionStatusList' => TransactionStatus::toSelectOptions()
        ]);
    }

    public function create()
    {
        //
    }

    public function store(CreatePaymentRequest $request)
    {
        Payment::create($request->validated());

        return to_route('payment.index');
    }

    public function show(Payment $payment)
    {
        //
    }


    public function edit(Payment $payment)
    {
        //
    }

    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        $payment->update($request->validated());

        return to_route('payment.index');
    }

    public function destroy(Payment $payment)
    {
        //
    }

    public function transaction(MakePaymentRequest $request, Payment $payment)
    {
        $transaction = app()->call(CreatePaymentTransactionAction::class, ['request' => $request, 'payment' => $payment]);

        app()->call(DeductFromBalanceAction::class, ['transaction' => $transaction, 'payment' => $payment]);

        app()->call(SavePaymentTransactionReceiptsAction::class, ['request' => $request, 'transaction' => $transaction]);

        return to_route('payment.index');
    }
}
