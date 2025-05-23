<?php

namespace App\Http\Requests\Payments;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'min: 3',
                Rule::unique('payments')->where('payment_category_id', $this->payment_category_id)->ignoreModel($this->route('payment')),
            ],
            'amount' => ['gt:0'],
            'account_number' => ['required'],
            'payment_category_id' => [Rule::exists('payment_categories', 'id')->where('user_id', auth()->id())],
            'category_id' => [Rule::exists('transaction_categories', 'id')->where('user_id', auth()->id())]
        ];
    }

    public function messages()
    {
        return [
            'name.min' => 'Payment name must be at least 3 characters long',
            'name.unique' => 'Payment name must be unique within its category',
            'account_number' => 'Enter account number',
            'amount' => 'Payment amount must be greater than 0',
            'payment_category_id' => 'Please select payment category',
            'category_id' => 'Please select transaction category',
        ];
    }
}
