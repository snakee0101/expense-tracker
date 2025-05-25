<?php

namespace App\Http\Controllers;

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
        $transaction_date = Carbon::parse("{$request->date} {$request->time}");
        $source = ($request->source_type)::findOrFail($request->source_id);

        $transaction = Transaction::create(array(
            'name' => $payment->name,
            'date' => $transaction_date,
            'amount' => $request->amount,
            'note' => $request->note,
            'user_id' => auth()->id(),
            'source_type' => $request->source_type,
            'source_id' => $request->source_id,
            'destination_type' => Payment::class,
            'destination_id' => $payment->id,
            'category_id' => $payment->category_id,
            'status' => $transaction_date->isFuture() ? TransactionStatus::Pending : TransactionStatus::Completed
        ));

        if ($transaction_date->isNowOrPast()) {
            $source->decrement('balance', $payment->amount);
        }

        foreach ($request->receipts ? $request->file('receipts') : [] as $file) {
            $filePath = $file->store('attachments', 'public');

            $transaction->attachments()->create([
                'original_filename' => $file->getClientOriginalName(),
                'storage_location' => $filePath
            ]);
        }

        return to_route('payment.index');
    }
}
