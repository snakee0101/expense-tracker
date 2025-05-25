<?php

namespace App\Http\Requests\Transfers;

use App\Models\Card;
use App\Models\Wallet;
use App\Rules\CheckCardExpiration;
use App\Rules\WithinSpendingLimit;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $date = \DateTime::createFromFormat('Y-m-d', $this->date) !== false ? $this->date
                                                                           : now()->format('Y-m-d');

        return [
            'name' => 'min:3',
            'date' => 'date|date_format:Y-m-d',
            'time' => 'date_format:H:i:s',
            'amount' => ['gt:0', new WithinSpendingLimit(isSpending: true, transactionDate: new CarbonImmutable($transactionDate = Carbon::parse("{$date} {$this->time}")))],
            'source_type' => Rule::in(Wallet::class, Card::class),
            'source_id' => function (string $attribute, mixed $value, Closure $fail) {
                if (Wallet::where('id', $value)->doesntExist() && Card::where('id', $value)->doesntExist()) {
                    $fail("Selected card or wallet doesn't exist");
                }
            },
            'card' => $this->source_type ? new CheckCardExpiration($account = ($this->source_type)::findOrFail($this->source_id)) : 'nullable',
            'receipts' => $this->receipts == [] ? 'nullable' : 'file',
            'category_id' => Rule::exists('transaction_categories', 'id')->where('user_id', auth()->id()),
        ];
    }

    public function messages()
    {
        return [
            'name' => 'Transaction name must be at least 3 characters long',
            'date' => 'Select transaction date',
            'time' => 'Select transaction time',
            'amount.gt' => 'Transaction amount must be greater than 0',
            'category_id' => 'Please select transaction category',
        ];
    }
}
