<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SpendingLimit;

class SpendingLimitController extends Controller
{
    public function store(Request $request)
    {
        $spendingLimit = SpendingLimit::firstWhere('user_id', auth()->id());

        $spendingLimit->update([
            'limit_amount' => $request->limit_amount,
            'day_of_month_period_start' => $request->day_of_month_period_start
        ]);

        return to_route('dashboard');
    }

    public function destroy()
    {
        $spendingLimit = SpendingLimit::firstWhere('user_id', auth()->id());

        $spendingLimit->update([
            'limit_amount' => null,
            'day_of_month_period_start' => null
        ]);
        
        return to_route('dashboard');
    }
}
