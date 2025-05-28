<?php

namespace App\Http\Controllers;

use App\Actions\AccountsList;
use App\Http\Requests\RecurringPayments\CreateRecurringPayment;
use App\Http\Requests\RecurringPayments\UpdateRecurringPayment;
use App\Models\RecurringPayment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecurringPaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('recurring_payments', [
            'payments' => RecurringPayment::where('user_id', auth()->id())
                                        ->latest('period_starting_date')
                                        ->with('destination', 'category')
                                        ->paginate(10),
            'accounts' => app()->call(AccountsList::class)
        ]);
    }

    public function store(CreateRecurringPayment $request)
    {
        RecurringPayment::create([
            'name' => $request->name,
            'user_id' => auth()->id(),
            'note' => $request->note == '' ? null : $request->note,
            'amount' => $request->amount,
            'category_id' => $request->category_id,
            'destination_id' => $request->destination_id,
            'destination_type' => $request->destination_type,
            'period_starting_date' => $request->period_starting_date,
            'repeat_period' => $request->repeat_period,
        ]);

        return to_route('recurring_payment.index');
    }

    public function update(UpdateRecurringPayment $request, RecurringPayment $recurring_payment)
    {
        $recurring_payment->update([
            'name' => $request->name,
            'note' => $request->note == '' ? null : $request->note,
            'amount' => $request->amount,
            'category_id' => $request->category_id,
            'destination_id' => $request->destination_id,
            'destination_type' => $request->destination_type,
            'period_starting_date' => Carbon::parse($request->period_starting_date),
            'repeat_period' => $request->repeat_period,
        ]);

        return to_route('recurring_payment.index');
    }

    public function setActiveState(Request $request, RecurringPayment $recurring_payment)
    {
        $recurring_payment->update([
            'is_active' => $request->is_active
        ]);

        return to_route('recurring_payment.index');
    }
}
