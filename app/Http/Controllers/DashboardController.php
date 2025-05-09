<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\SpendingLimit;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $spendingLimit = SpendingLimit::firstWhere('user_id', auth()->id());

        return Inertia::render('dashboard', [
            'spendingLimit' => $spendingLimit,
            'amountSpent' => $spendingLimit->amountSpent()
        ]);
    }
}
