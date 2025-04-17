<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CardController extends Controller
{
    public function index()
    {
        return Inertia::render('cards', [
            'cards' => Card::where('user_id', auth()->id())
                                ->latest()
                                ->get()
        ]);
    }

    public function store(Request $request)
    {
        /*$request->validate([
            'name' => [
                'min: 3',
                Rule::unique('wallets')->where('user_id', auth()->id())
            ]
        ]);

        Wallet::create([
            'user_id' => auth()->id(),
            'name' => $request->name
        ]);

        return to_route('wallet.index');*/
    }
}
