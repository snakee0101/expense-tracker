<?php

namespace App\Http\Controllers;

use App\Actions\SaveTransactionReceiptsAction;
use App\Actions\Transfers\CreateTransferTransactionAction;
use App\Actions\Transfers\DeductFromBalanceAction;
use App\Enums\TransactionStatus;
use App\Http\Requests\Transfers\CreateTransferRequest;
use App\Models\Card;
use App\Models\Contact;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\Wallet;
use App\Rules\CheckCardExpiration;
use App\Rules\WithinSpendingLimit;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
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
                'balance' => $wallet->balance,
                'card_number' => null
            ];
        });

        $accounts->push(...Card::where('user_id', auth()->id())->whereDate('expiry_date', '>=', now())->get()->map(function (Card $card) {
            return [
                'id' => $card->id,
                'type' => Card::class,
                'name' => $card->name,
                'balance' => $card->balance,
                'card_number' => $card->card_number
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
            'accounts' => $accounts,
            'transactionStatusList' => TransactionStatus::toSelectOptions()
        ]);
    }

    public function store(CreateTransferRequest $request)
    {
        $transaction = app()->call(CreateTransferTransactionAction::class, ['request' => $request]);

        app()->call(DeductFromBalanceAction::class, ['transaction' => $transaction]);

        app()->call(SaveTransactionReceiptsAction::class, ['request' => $request, 'transaction' => $transaction]);

        return to_route('transfer.index');
    }
}
