<?php

namespace App\Http\Controllers;

use App\Actions\SaveTransactionReceiptsAction;
use App\Enums\TransactionStatus;
use App\Http\Requests\IncomeExpenseRequest;
use App\Models\Card;
use App\Models\Transaction;
use App\Rules\CheckCardExpiration;
use App\Rules\WithinSpendingLimit;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IncomeExpenseController extends Controller
{
    public function store(IncomeExpenseRequest $request)
    {
        $income = $request->boolean('is_income') ? $request->amount : -$request->amount;
        $transaction_date = Carbon::parse("{$request->date} {$request->time}");

        $destination = ($request->destination_type)::findOrFail($request->destination_id);

        $transaction = Transaction::create([
            'name' => $request->name,
            'date' => $transaction_date,
            'amount' => $income,
            'note' => $request->note,
            'user_id' => auth()->id(),
            'destination_type' => $request->destination_type,
            'destination_id' => $request->destination_id,
            'category_id' => $request->category_id,
            'status' => $transaction_date->isFuture() ? TransactionStatus::Pending : TransactionStatus::Completed
        ]);

        if ($transaction_date->isNowOrPast()) {
            $destination->increment('balance', $income);
        }

        app()->call(SaveTransactionReceiptsAction::class, ['request' => $request, 'transaction' => $transaction]);

        return back();
    }
}
