<?php

namespace App\Models;

use App\Enums\TransactionStatus;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpendingLimit extends Model
{
    use HasFactory;

    protected $guarded = [];

    /** 
     * Calculates spending limit relative to specific date,
     * Also, you could filter transactions with specific statuses (useful when processing pending transactions)
    */
    public function amountSpent(CarbonImmutable|null $currentDate = null, array $statuses = [TransactionStatus::Completed]): null|float
    {
        $currentDate ??= new CarbonImmutable(now());

        if ($currentDate->dayOfMonth <= $this->day_of_month_period_start) { //suppose period starts at 15th day, but now is 7th
            $startingDate = $currentDate->subMonth()->setDay($this->day_of_month_period_start)->setTime(0,0,0); //then the date range starts at 15th day of previous month and ends now
            $endingDate = $currentDate;
        } else {
            $startingDate = $currentDate->setDay($this->day_of_month_period_start)->setTime(0,0,0); //otherwise the period starts at $spendingLimit->day_of_month_period_start at current month and ends now
            $endingDate = $currentDate;
        }

        /**
         *  1. Card and Wallet transactions - income/expense (for those only the destination_type is set to Wallet or Card) - just take the expenses (amount < 0)
         *  2. Transfer - it is an expense (no need to change sign)
         * */
        return Transaction::selectRaw('SUM(
                                            CASE
                                                 WHEN source_type IS NULL AND destination_type IN (?, ?) AND amount < 0 THEN -amount
                                                 WHEN destination_type = ? THEN amount
                                            END
                                      ) AS amount_spent',
            [
                Wallet::class, Card::class,
                Contact::class
            ])
            ->where('user_id', auth()->id())
            ->whereIn('status', $statuses)
            ->whereBetween('date', [$startingDate, $endingDate])
            ->value('amount_spent');
    }
}
