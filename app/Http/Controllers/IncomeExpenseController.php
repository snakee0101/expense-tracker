<?php

namespace App\Http\Controllers;

use App\Http\Requests\IncomeExpenseRequest;
use App\Actions\SaveTransactionReceiptsAction;
use App\Actions\IncomeExpense\UpdateAccountBalance;
use App\DataTransferObjects\IncomeExpenseDto;
use App\Actions\IncomeExpense\CreateIncomeExpenseTransaction;
use App\DataTransferObjects\TransactionReceiptsDto;

class IncomeExpenseController extends Controller
{
    public function store(IncomeExpenseRequest $request)
    {
        $transaction = app()->call(CreateIncomeExpenseTransaction::class, [
            'dto' => IncomeExpenseDto::fromRequest($request)
        ]);

        app()->call(UpdateAccountBalance::class, [
            'transaction' => $transaction
        ]);

        app()->call(SaveTransactionReceiptsAction::class, [
            'dto' => TransactionReceiptsDto::fromTransactionData($request, $transaction),
        ]);

        return back();
    }
}
