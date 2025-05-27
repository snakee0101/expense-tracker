<?php

namespace App\Http\Requests;

use App\Models\Card;
use App\Models\Wallet;
use App\Rules\CheckCardExpiration;
use App\Rules\WithinSpendingLimit;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class IncomeExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        $destination = ($this->destination_type)::findOrFail($this->destination_id);

        return Gate::allows('owns-model', $destination);
    }

    public function rules(): array
    {
        $transaction_date = Carbon::parse("{$this->date} {$this->time}");

        return [
            'name' => 'min:3',
            'date' => 'date_format:Y-m-d',
            'time' => 'date_format:H:i:s',
            'is_income' => 'boolean',
            'amount' => new WithinSpendingLimit(isSpending: $this->boolean('is_income') == false, transactionDate: new CarbonImmutable($transaction_date)),
            'receipts' => $this->receipts == [] ? 'nullable' : 'array',
            'receipts.*' => 'file',
            'card' => new CheckCardExpiration($destination = ($this->destination_type)::findOrFail($this->destination_id)),
            'note' => 'nullable',
            'category_id' => Rule::exists('transaction_categories', 'id')->where('user_id', auth()->id()),
            'destination_type' => Rule::in(Wallet::class, Card::class),
            'destination_id' => function (string $attribute, mixed $value, Closure $fail) {
                if (Wallet::where('id', $value)->doesntExist() && Card::where('id', $value)->doesntExist()) {
                    $fail("Selected card or wallet doesn't exist");
                }
            },
        ];
    }

    public function messages()
    {
        return [
            'name' => 'Transaction name must be at least 3 characters long',
            'date' => 'Select transaction date',
            'time' => 'Select transaction time',
            'amount' => 'Transaction amount must be a number and be greater than 0',
            'category_id' => 'Please select transaction category',
        ];
    }
}
