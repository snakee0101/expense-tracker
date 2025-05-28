<?php

namespace App\Http\Controllers;

use App\Http\Requests\Wallets\CreateWalletRequest;
use App\Http\Requests\Wallets\UpdateWalletRequest;
use App\Models\Wallet;
use App\Queries\WalletIncomeExpenseChartQuery;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index()
    {
        return Inertia::render('wallets', [
            'wallets' => Wallet::where('user_id', auth()->id())->latest()->get(),
            'chartData' => app()->call(WalletIncomeExpenseChartQuery::class)
        ]);
    }

    public function store(CreateWalletRequest $request)
    {
        Wallet::create([
            'user_id' => auth()->id(),
            'name' => $request->name
        ]);

        return to_route('wallet.index');
    }

    public function update(UpdateWalletRequest $request, Wallet $wallet)
    {
        $wallet->update([
            'name' => $request->name
        ]);

        return to_route('wallet.index');
    }
}
