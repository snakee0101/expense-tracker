<?php

namespace App\Actions;

use App\Models\Card;
use App\Models\Wallet;

class AccountsList
{
    public function __invoke($checkForExpiryDate = false)
    {
        $accounts = Wallet::where('user_id', auth()->id())
                        ->get()
                        ->map(fn (Wallet $wallet) => $this->mapWalletFields($wallet));

        $accounts->push(
            ...Card::where('user_id', auth()->id())
                   ->when($checkForExpiryDate, function ($q) {
                       $q->whereDate('expiry_date', '>=', now());
                   })->get()
                     ->map(fn (Card $card) => $this->mapCardFields($card))
        );

        return $accounts;
    }

    public function mapWalletFields(Wallet $wallet): array
    {
        return [
            'id' => $wallet->id,
            'type' => Wallet::class,
            'name' => $wallet->name,
            'balance' => $wallet->balance,
            'card_number' => null
        ];
    }

    public function mapCardFields(Card $card): array
    {
        return [
            'id' => $card->id,
            'type' => Card::class,
            'name' => $card->name,
            'balance' => $card->balance,
            'card_number' => $card->card_number
        ];
    }
}
