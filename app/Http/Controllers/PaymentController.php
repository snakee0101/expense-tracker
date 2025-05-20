<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Contact;
use App\Models\Payment;
use App\Models\PaymentCategory;
use App\Models\TransactionCategory;
use App\Models\Wallet;
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
            'accounts' => $accounts
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('payments')->where('payment_category_id', $request->payment_category_id),
            ],
            'amount' => ['gt:0'],
            'account_number' => ['required'],
            'payment_category_id' => [Rule::exists('payment_categories', 'id')->where('user_id', auth()->id())],
            'category_id' => [Rule::exists('transaction_categories', 'id')->where('user_id', auth()->id())]
        ]);

        Payment::create($validated);

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

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('payments')->where('payment_category_id', $request->payment_category_id)->ignoreModel($payment),
            ],
            'amount' => ['gt:0'],
            'account_number' => ['required'],
            'payment_category_id' => [Rule::exists('payment_categories', 'id')->where('user_id', auth()->id())],
            'category_id' => [Rule::exists('transaction_categories', 'id')->where('user_id', auth()->id())]
        ]);

        $payment->update($validated);

        return to_route('payment.index');
    }

    public function destroy(Payment $payment)
    {
        //
    }
}
