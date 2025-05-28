<?php

namespace App\Http\Controllers;

use App\Actions\AccountsList;
use App\Actions\SaveTransactionReceiptsAction;
use App\Actions\Transfers\CreateTransferTransactionAction;
use App\Actions\Transfers\DeductFromBalanceAction;
use App\Http\Requests\Transfers\CreateTransferRequest;
use App\Models\Contact;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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
        $transaction = app()->call(CreateTransferTransactionAction::class, ['request' => $request]);

        app()->call(DeductFromBalanceAction::class, ['transaction' => $transaction]);

        app()->call(SaveTransactionReceiptsAction::class, ['request' => $request, 'transaction' => $transaction]);

        return to_route('transfer.index');
    }
}
