<?php

namespace App\Actions\Dashboard;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class ExpenseBreakdownDateRange
{
    public function __invoke()
    {
        if (Cache::has('expenseBreakdownDateRangeStart')) {
            $expenseBreakdownStartingDate = request()->has('expenseBreakdownDateRangeStart') ? Carbon::parse(request('expenseBreakdownDateRangeStart'))
                                                                                            : Carbon::parse(Cache::get('expenseBreakdownDateRangeStart'));

            $expenseBreakdownEndingDate = request()->has('expenseBreakdownDateRangeEnd') ? Carbon::parse(request('expenseBreakdownDateRangeEnd'))
                                                                                        : Carbon::parse(Cache::get('expenseBreakdownDateRangeEnd'));
        } else {
            $expenseBreakdownStartingDate = request()->has('expenseBreakdownDateRangeStart') ? Carbon::parse(request('expenseBreakdownDateRangeStart'))
                                                                                            : now()->subMonth();

            $expenseBreakdownEndingDate = request()->has('expenseBreakdownDateRangeEnd') ? Carbon::parse(request('expenseBreakdownDateRangeEnd'))
                                                                                         : now();
        }

        Cache::delete('expenseBreakdownDateRangeStart');
        Cache::delete('expenseBreakdownDateRangeEnd');

        Cache::rememberForever('expenseBreakdownDateRangeStart', fn () => $expenseBreakdownStartingDate->format('Y-m-d H:i:s'));
        Cache::rememberForever('expenseBreakdownDateRangeEnd', fn () => $expenseBreakdownEndingDate->format('Y-m-d H:i:s'));

        return [$expenseBreakdownStartingDate, $expenseBreakdownEndingDate];
    }
}
