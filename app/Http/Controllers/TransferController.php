<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Contact;
use App\Actions\AccountsList;
use Illuminate\Support\Facades\Storage;
use App\Actions\SaveTransactionReceiptsAction;
use App\Actions\Transfers\DeductFromBalanceAction;
use App\DataTransferObjects\TransactionReceiptsDto;
use App\Http\Requests\Transfers\CreateTransferRequest;
use App\Actions\Transfers\CreateTransferTransactionAction;
use App\DataTransferObjects\Transfers\DeductFromBalanceDto;
use App\DataTransferObjects\Transfers\TransferTransactionDto;

class TransferController extends Controller
{
    public function index()
    {
        return Inertia::render('transfers', [
            'contacts' => Contact::where('user_id', auth()->id())
                                ->latest()
                                ->get()
                                ->map(function($contact) {
                                    $contact->avatar_path = Storage::url($contact->avatar_path);
                                    return $contact;
                                }),
            'accounts' => app()->call(AccountsList::class, ['checkForExpiryDate' => true]),
        ]);
    }

    public function store(CreateTransferRequest $request)
    {
        $transaction = app()->call(CreateTransferTransactionAction::class, ['dto' => TransferTransactionDto::fromRequest($request)]);

        app()->call(DeductFromBalanceAction::class, ['dto' => DeductFromBalanceDto::fromTransaction($transaction)]);

        app()->call(SaveTransactionReceiptsAction::class, ['dto' => TransactionReceiptsDto::fromTransactionData($request, $transaction)]);

        return to_route('transfer.index');
    }
}
