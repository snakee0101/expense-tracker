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
                ->get(),
            'accounts' => $accounts
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
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
        //
    }

    public function destroy(Payment $payment)
    {
        //
    }
}
