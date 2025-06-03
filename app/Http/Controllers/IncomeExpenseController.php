<?php

namespace App\Http\Controllers;

use App\Http\Requests\IncomeExpenseRequest;
use App\Actions\SaveTransactionReceiptsAction;
use App\Actions\IncomeExpense\UpdateAccountBalance;
use App\DataTransferObjects\IncomeExpense\IncomeExpenseDto;
use App\Actions\IncomeExpense\CreateIncomeExpenseTransaction;

class IncomeExpenseController extends Controller
{
    public function store(IncomeExpenseRequest $request)
    {
        $transaction = app()->call(CreateIncomeExpenseTransaction::class, [
            'dto' => IncomeExpenseDto::fromRequest($request)
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
