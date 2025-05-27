<?php

namespace App\Http\Requests\Payments;

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

class MakePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $source = ($this->source_type)::find($this->source_id);

        return Gate::allows('owns-model', $source)
            && Gate::allows('owns-model', $this->route('payment'));
    }

    public function rules(): array
    {
        $transaction_date = Carbon::parse("{$this->date} {$this->time}");
        $source = empty($this->source_type) == false && empty($this->source_id) == false ? ($this->source_type)::findOrFail($this->source_id) : null;

        return [
            'date' => 'date_format:Y-m-d',
            'time' => 'date_format:H:i:s',
            'source_type' => Rule::in(Wallet::class, Card::class),
            'amount' => new WithinSpendingLimit(isSpending: true, transactionDate: new CarbonImmutable($transaction_date)),
            'card' => $source ? new CheckCardExpiration($source) : 'nullable',
            'note' => 'nullable',
            'source_id' => function (string $attribute, mixed $value, Closure $fail) {
                if (Wallet::where('id', $value)->doesntExist() && Card::where('id', $value)->doesntExist()) {
                    $fail("Selected card or wallet doesn't exist");
                }
            },
            'receipts' => $this->receipts == [] ? 'nullable' : 'array',
            'receipts.*' => 'file',
        ];
    }

    public function messages()
    {
        return [
            'date' => 'Select correct payment date',
            'time' => 'Select correct payment time',
        ];
    }
}
