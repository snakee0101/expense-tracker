<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecurringPayments\CreateRecurringPayment;
use App\Http\Requests\RecurringPayments\UpdateRecurringPayment;
use App\Models\Card;
use App\Models\RecurringPayment;
use App\Models\TransactionCategory;
use App\Models\Wallet;
use App\Rules\CheckCardExpiration;
use Carbon\Carbon;
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
                'balance' => $wallet->balance,
                'card_number' => null
            ];
        });

        $accounts->push(...Card::where('user_id', auth()->id())->get()->map(function (Card $card) {
            return [
                'id' => $card->id,
                'type' => Card::class,
                'name' => $card->name,
                'balance' => $card->balance,
                'card_number' => $card->card_number
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

    public function store(CreateRecurringPayment $request)
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

    public function update(UpdateRecurringPayment $request, RecurringPayment $recurring_payment)
    {
        $recurring_payment->update([
            'name' => $request->name,
            'note' => $request->note == '' ? null : $request->note,
            'amount' => $request->amount,
            'category_id' => $request->category_id,
            'destination_id' => $request->destination_id,
            'destination_type' => $request->destination_type,
            'period_starting_date' => Carbon::parse($request->period_starting_date),
            'repeat_period' => $request->repeat_period,
        ]);

        return to_route('recurring_payment.index');
    }
}
