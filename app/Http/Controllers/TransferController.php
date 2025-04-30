<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Contact;
use App\Models\TransactionCategory;
use App\Models\Wallet;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TransferController extends Controller
{
    public function index()
    {
        $accounts = Wallet::where('user_id', auth()->id())->get()->map(function (Wallet $wallet) {
            return [
                'id' => $wallet->id,
                'type' => Wallet::class,
                'name' => $wallet->name,
                'balance' => $wallet->balance
            ];
        });

        $accounts->push(...Card::where('user_id', auth()->id())->get()->map(function (Card $card) {
            return [
                'id' => $card->id,
                'type' => Card::class,
                'name' => $card->name,
                'balance' => $card->balance
            ];
        }));

        return Inertia::render('transfers', [
            'contacts' => Contact::where('user_id', auth()->id())
                                ->latest()
                                ->get()
                                ->map(function($contact) {
                                    $contact->avatar_path = Storage::url($contact->avatar_path);
                                    return $contact;
                                }),
            'transactionCategories' => TransactionCategory::where('user_id', auth()->id())
                                ->latest()
                                ->get(),
            'accounts' => $accounts
        ]);
    }
}
