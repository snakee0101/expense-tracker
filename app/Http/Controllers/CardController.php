<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cards\CreateCardRequest;
use App\Http\Requests\Cards\UpdateCardRequest;
use App\Models\Card;
use App\Queries\CardIncomeExpenseChartQuery;
use Inertia\Inertia;

class CardController extends Controller
{
    public function index()
    {
        return Inertia::render('cards', [
            'cards' => Card::where('user_id', auth()->id())->latest('expiry_date')->get(),
            'chartData' => app()->call(CardIncomeExpenseChartQuery::class),
        ]);
    }

    public function store(CreateCardRequest $request)
    {
        Card::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'card_number' => $request->card_number,
            'expiry_date' => $request->expiryDateToCarbon()
        ]);

        return to_route('card.index');
    }

    public function update(UpdateCardRequest $request, Card $card)
    {
        $card->update([
            'name' => $request->name,
            'card_number' => $request->card_number,
            'expiry_date' => $request->expiryDateToCarbon()
        ]);

        return to_route('card.index');
    }
}
