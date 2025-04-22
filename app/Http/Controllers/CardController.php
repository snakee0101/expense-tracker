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
        $validated = $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('cards')->where('user_id', auth()->id())
            ],
            'card_number' => ['required', 'regex:/^\d{13,19}$/'],
            'expiry_date' => ['required', 'date-format:Y-m-d H:i:s']
        ]);

        Card::create([
            'user_id' => auth()->id(),
            ...$validated
        ]);

        return to_route('card.index');
    }
}
