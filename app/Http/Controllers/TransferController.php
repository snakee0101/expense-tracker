<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Models\Card;
use App\Models\Contact;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\Wallet;
use Carbon\Carbon;
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

    public function store(Request $request)
    {
        $transactionDate = Carbon::parse("{$request->date} {$request->time}");

        $transaction = Transaction::create([
            'name' => $request->name,
            'date' => $transactionDate,
            'amount' => $request->amount,
            'note' => $request->note,
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            'source_id' => $request->source_id,
            'source_type' => $request->source_type,
            'destination_id' => $request->contact_id,
            'destination_type' => Contact::class,
            'status' => $transactionDate->isFuture() ? TransactionStatus::Pending : TransactionStatus::Completed
        ]);

        if ($transactionDate->isNowOrPast()) {
            //change balance of wallet/card where you transfer money from
            $account = ($request->source_type)::findOrFail($request->source_id);
            $account->decrement('balance', $request->amount);
        }

        foreach ($request->file('receipts') ?? [] as $file) {
            $filePath = $file->store('attachments', 'public');

            $transaction->attachments()->create([
                'original_filename' => $file->getClientOriginalName(),
                'storage_location' => $filePath
            ]);
        }

        return to_route('transfer.index');
    }
}
