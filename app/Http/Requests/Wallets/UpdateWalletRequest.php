<?php

namespace App\Http\Requests\Wallets;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWalletRequest extends FormRequest
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
                Rule::unique('wallets')->where('user_id', auth()->id())->ignoreModel($this->route('wallet'))
            ]
        ];
    }

    public function messages()
    {
        return [
            'name.min' => 'Wallet name must be at least 3 characters long',
            'name.unique' => 'Wallet name has already been taken',
        ];
    }
}
