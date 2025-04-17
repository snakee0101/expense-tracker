<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index()
    {
        return Inertia::render('wallets', [
            'wallets' => Wallet::where('user_id', auth()->id())
                                ->orderBy('name')
                                ->get()
        ]);
    }
}
