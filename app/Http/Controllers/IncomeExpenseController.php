<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Models\Attachment;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class IncomeExpenseController extends Controller
{
    public function store(Request $request)
    {
        $income = $request->boolean('is_income') ? $request->amount : -$request->amount;
        $transaction_date = Carbon::parse("{$request->date} {$request->time}");

        $transaction = Transaction::create([
            'name' => $request->name,
            'date' => $transaction_date,
            'amount' => $income,
            'note' => $request->note,
            'user_id' => auth()->id(),
            'destination_type' => $request->destination_type,
            'destination_id' => $request->destination_id,
            'category_id' => $request->category_id,
            'status' => $transaction_date->isFuture() ? TransactionStatus::Pending : TransactionStatus::Completed
        ]);

        if ($transaction_date->isNowOrPast()) {
            $destination = ($request->destination_type)::findOrFail($request->destination_id);
            $destination->increment('balance', $income);
        }

        foreach ($request->file('receipts') ?? [] as $file) {
            $filePath = $file->store('attachments', 'public');

            $transaction->attachments()->create([
                'original_filename' => $file->getClientOriginalName(),
                'storage_location' => $filePath
            ]);
        }

        return back();
    }
}
