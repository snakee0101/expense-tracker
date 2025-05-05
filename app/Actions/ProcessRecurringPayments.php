<?php

namespace App\Actions;

use App\Enums\TransactionStatus;
use App\Models\RecurringPayment;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Collection;

class ProcessRecurringPayments
{
    public function __invoke()
    {
        $this->pendingPayments()->each(
            fn(RecurringPayment $payment) => $this->processPayment($payment)
        );
    }

    protected function processPayment(RecurringPayment $payment)
    {
        $couldBeUpdatedToMatchCurrentDate = true;

        while($couldBeUpdatedToMatchCurrentDate) {
            $payment->refresh();

            $transaction = $this->createTransaction($payment);
            $this->decrementAccountBalance($transaction);
            $couldBeUpdatedToMatchCurrentDate = $this->updatePaymentPeriod($payment);
        }
    }

    protected function decrementAccountBalance(Transaction $transaction): void
    {
        $transaction->destination->fill(['balance' => $transaction->destination->balance + $transaction->amount]);
        $transaction->destination->save();
    }

    protected function createTransaction(RecurringPayment $payment): Transaction
    {
        return Transaction::create([
            'name' => $payment->name,
            'date' => $payment->period_starting_date->addDays($payment->repeat_period),
            'amount' => -$payment->amount,
            'note' => $payment->note,
            'user_id' => $payment->user_id,
            'category_id' => $payment->category_id,
            'destination_id' => $payment->destination_id,
            'destination_type' => $payment->destination_type,
            'status' => TransactionStatus::Completed
        ]);
    }

    protected function pendingPayments(): Collection
    {
        return RecurringPayment::whereRaw('CURRENT_DATE() >= DATE_ADD(period_starting_date, INTERVAL repeat_period DAY)')->get();
    }

    protected function updatePaymentPeriod(RecurringPayment $payment): bool
    {
        $nextPeriodStartingDate = $payment->period_starting_date->addDays($payment->repeat_period);

        $payment->period_starting_date = $nextPeriodStartingDate;
        $payment->save();

        return now()->startOfDay()->isAfter($nextPeriodStartingDate->startOfDay()); //ignore time parts
    }
}
