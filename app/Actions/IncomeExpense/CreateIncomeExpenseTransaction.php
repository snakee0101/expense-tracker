<?php

namespace App\Actions\IncomeExpense;

use App\DataTransferObjects\IncomeExpenseDTO;
use App\Enums\TransactionStatus;
use App\Models\Transaction;
use Carbon\Carbon;

class CreateIncomeExpenseTransaction
{
    public function __invoke(IncomeExpenseDTO $dto): Transaction
    {
        $income = $dto->is_income ? $dto->amount 
                                  : -$dto->amount;

        $transaction_date = Carbon::parse("{$dto->date} {$dto->time}");

        $status = $transaction_date->isFuture() ? TransactionStatus::Pending 
                                                : TransactionStatus::Completed;

        return Transaction::create([
            'name' => $dto->name,
            'date' => $transaction_date,
            'amount' => $income,
            'note' => $dto->note,
            'user_id' => auth()->id(),
            'destination_type' => $dto->destination_type,
            'destination_id' => $dto->destination_id,
            'category_id' => $dto->category_id,
            'status' => $status,
        ]);
    }
}
