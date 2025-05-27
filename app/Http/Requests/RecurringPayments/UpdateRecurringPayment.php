<?php

namespace App\Http\Requests\RecurringPayments;

use App\Models\Card;
use App\Models\TransactionCategory;
use App\Models\Wallet;
use App\Rules\CheckCardExpiration;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UpdateRecurringPayment extends FormRequest
{
    public function authorize(): bool
    {
        $destination = ($this->destination_type)::find($this->destination_id);

        return Gate::allows('owns-model', TransactionCategory::find($this->category_id))
            && Gate::allows('owns-model', $destination)
            && Gate::allows('owns-model', $this->route('recurring_payment'));
    }

    public function rules(): array
    {
        return [
            'name' => 'min:3',
            'date' => 'date|date_format:Y-m-d',
            'card' => $this->destination_type ? new CheckCardExpiration($account = ($this->destination_type)::find($this->destination_id)) : 'nullable',
            'category_id' => Rule::exists('transaction_categories', 'id')->where('user_id', auth()->id()),
            'amount' => 'gt:0',
            'destination_type' => Rule::in(Wallet::class, Card::class),
            'destination_id' => function (string $attribute, mixed $value, Closure $fail) {
                if (Wallet::where('id', $value)->doesntExist() && Card::where('id', $value)->doesntExist()) {
                    $fail("Selected card or wallet doesn't exist");
                }
            },
            'repeat_period' => 'between:1,31',
            'note' => 'nullable'
        ];
    }

    public function messages()
    {
        return [
            'name' => 'Recurring payment name must be at least 3 characters long',
            'date' => 'Select repeat period starting date',
            'category_id' => 'Please select transaction category',
            'amount' => 'Transaction amount must be greater than 0',
            'repeat_period' => 'Day of month must be between 1 and 31',
        ];
    }
}
