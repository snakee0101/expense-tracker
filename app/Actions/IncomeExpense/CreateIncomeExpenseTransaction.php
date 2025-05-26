<?php

namespace App\Actions\IncomeExpense;

use App\Enums\TransactionStatus;
use App\Http\Requests\IncomeExpenseRequest;
use App\Models\Transaction;
use Carbon\Carbon;

class CreateIncomeExpenseTransaction
{
    public function __invoke(IncomeExpenseRequest $request): Transaction
    {
        $income = $request->boolean('is_income') ? $request->amount : -$request->amount;
        $transaction_date = Carbon::parse("{$request->date} {$request->time}");

        return Transaction::create([
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
    }
}
