<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\RecurringPayment;
use App\Models\TransactionCategory;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecurringPaymentController extends Controller
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

        $accounts->push(...Card::where('user_id', auth()->id())->get()->map(function (Card $card) {
            return [
                'id' => $card->id,
                'type' => Card::class,
                'name' => $card->name,
                'balance' => $card->balance
            ];
        }));

        return Inertia::render('recurring_payments', [
            'payments' => RecurringPayment::where('user_id', auth()->id())
                                        ->latest('period_starting_date')
                                        ->with('destination', 'category')
                                        ->paginate(10),
            'transactionCategories' => TransactionCategory::where('user_id', auth()->id())
                ->latest()
                ->get(),
            'accounts' => $accounts
        ]);
    }

    public function store(Request $request)
    {
        RecurringPayment::create([
            'name' => $request->name,
            'user_id' => auth()->id(),
            'note' => $request->note == '' ? null : $request->note,
            'amount' => $request->amount,
            'category_id' => $request->category_id,
            'destination_id' => $request->destination_id,
            'destination_type' => $request->destination_type,
            'period_starting_date' => $request->period_starting_date,
            'repeat_period' => $request->repeat_period,
        ]);

        return to_route('recurring_payment.index');
    }
}
