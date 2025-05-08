<?php

namespace App\Http\Controllers;

use App\Models\SpendingLimit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $spendingLimit = SpendingLimit::firstWhere('user_id', auth()->id());

        return Inertia::render('dashboard', [
            'spendingLimit' => $spendingLimit,
            'amountSpent' => $spendingLimit->amountSpent()
        ]);
    }
}
