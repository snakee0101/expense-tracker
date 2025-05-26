<?php

namespace App\Actions\SavingsPlans;

use App\Enums\TransactionStatus;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use Carbon\Carbon;

class CreateSavingsTransactionAction
{
    public function __invoke($request): Transaction
    {
        list($relatedModelIdField, $relatedModelTypeField, $savingsPlanIdField, $savingsPlanTypeField) = $this->getModelColumns($request);

        $transactionDate = Carbon::parse("{$request->date} {$request->time}");

        return $this->createTransaction($request, $transactionDate, $relatedModelIdField, $relatedModelTypeField, $savingsPlanIdField, $savingsPlanTypeField);
    }

    public function getModelColumns($request): array
    {
        if ($request->boolean('is_withdraw')) {
            $relatedModelIdField = 'destination_id';
            $relatedModelTypeField = 'destination_type';
            $savingsPlanIdField = 'source_id';
            $savingsPlanTypeField = 'source_type';
        } else {
            $relatedModelIdField = 'source_id';
            $relatedModelTypeField = 'source_type';
            $savingsPlanIdField = 'destination_id';
            $savingsPlanTypeField = 'destination_type';
        }

        return [$relatedModelIdField, $relatedModelTypeField, $savingsPlanIdField, $savingsPlanTypeField];
    }

    public function createTransaction($request, $transactionDate, $relatedModelIdField, $relatedModelTypeField, $savingsPlanIdField, $savingsPlanTypeField)
    {
        return Transaction::create([
            'name' => $request->name,
            'date' => $transactionDate,
            'amount' => $request->amount,
            'note' => $request->note,
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            $relatedModelIdField => $request->related_account_id,
            $relatedModelTypeField => $request->related_account_type,
            $savingsPlanIdField => $request->savings_plan_id,
            $savingsPlanTypeField => SavingsPlan::class,
            'status' => $transactionDate->isFuture() ? TransactionStatus::Pending : TransactionStatus::Completed
        ]);
    }
}
