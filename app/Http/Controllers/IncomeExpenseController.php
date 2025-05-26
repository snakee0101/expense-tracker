<?php

namespace App\Http\Controllers;

use App\Actions\IncomeExpense\CreateIncomeExpenseTransaction;
use App\Actions\IncomeExpense\UpdateAccountBalance;
use App\Actions\SaveTransactionReceiptsAction;
use App\Http\Requests\IncomeExpenseRequest;

class IncomeExpenseController extends Controller
{
    public function store(IncomeExpenseRequest $request)
    {
        $transaction = app()->call(CreateIncomeExpenseTransaction::class, [
            'request' => $request
        ]);

        app()->call(UpdateAccountBalance::class, [
            'transaction' => $transaction,
            'income' => $transaction->amount
        ]);

        app()->call(SaveTransactionReceiptsAction::class, [
            'request' => $request,
            'transaction' => $transaction
        ]);

        return back();
    }
}
