<?php

namespace App\Http\Requests\SavingsPlans;

use App\Models\Card;
use App\Models\SavingsPlan;
use App\Models\Wallet;
use App\Rules\CheckCardExpiration;
use App\Rules\WithinSavingsBalance;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $account = ($this->related_account_type)::findOrFail($this->related_account_id);
        $savingsPlan = SavingsPlan::findOrFail($this->savings_plan_id);

        return [
            'card' => new CheckCardExpiration($account),
            'amount' => new WithinSavingsBalance($savingsPlan, $this->amount * ($this->boolean('is_withdraw') ? -1 : 1)),
            'related_account_type' => Rule::in(Wallet::class, Card::class),
            'related_account_id' => function (string $attribute, mixed $value, Closure $fail) {
                if (Wallet::where('id', $value)->doesntExist() && Card::where('id', $value)->doesntExist()) {
                    $fail("Selected card or wallet doesn't exist");
                }
            },
            'category_id' => [Rule::exists('transaction_categories', 'id')->where('user_id', auth()->id())],
            'note' => 'nullable',
            'name' => 'required',
            'date' => 'date_format:Y-m-d',
            'time' => 'date_format:H:i:s',
        ];
    }

    public function messages()
    {
        return [
            'name' => 'Transaction name is required'
        ];
    }
}
