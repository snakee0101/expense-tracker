<?php

namespace App\Actions\SavingsPlans;

use App\DataTransferObjects\SavingsPlans\CreateSavingsTransactionDto;
use App\Enums\TransactionStatus;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use Carbon\Carbon;

class CreateSavingsTransactionAction
{
    public function __invoke(CreateSavingsTransactionDto $dto): Transaction
    {
        return $this->createTransaction($dto, ...$this->getModelColumns($dto->isWithdraw));
    }

    public function getModelColumns(bool $isWithdraw): array
    {
        if ($isWithdraw) {
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

        return [
            'relatedModelIdField' => $relatedModelIdField, 
            'relatedModelTypeField' => $relatedModelTypeField, 
            'savingsPlanIdField' => $savingsPlanIdField, 
            'savingsPlanTypeField' => $savingsPlanTypeField
        ];
    }

    public function createTransaction(CreateSavingsTransactionDto $dto, $relatedModelIdField, $relatedModelTypeField, $savingsPlanIdField, $savingsPlanTypeField)
    {
        $status = $dto->date->isFuture() ? TransactionStatus::Pending 
                                        : TransactionStatus::Completed;

        return Transaction::create([
            'name' => $dto->name,
            'date' => $dto->date,
            'amount' => $dto->amount,
            'note' => $dto->note,
            'user_id' => auth()->id(),
            'category_id' => $dto->categoryId,
            $relatedModelIdField => $dto->relatedAccountId,
            $relatedModelTypeField => $dto->relatedAccountType,
            $savingsPlanIdField => $dto->savingsPlanId,
            $savingsPlanTypeField => SavingsPlan::class,
            'status' => $status
        ]);
    }
}
