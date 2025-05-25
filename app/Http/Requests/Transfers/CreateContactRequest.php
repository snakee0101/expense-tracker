<?php

namespace App\Http\Requests\Transfers;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateContactRequest extends FormRequest
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
                Rule::unique('contacts', 'name')->where('user_id', auth()->id())
            ],
            'card_number' => ['required', 'regex:/^\d{13,19}$/'],
            'avatar' => ['nullable', 'image', 'file', 'max:1024']
        ];
    }

    public function messages()
    {
        return [
            'name.min' => 'Contact name must be at least 3 characters long',
            'name.unique' => 'Contact name has already been taken',
            'card_number' => 'Card number must be 13-19 digits long',
            'avatar.image' => 'Avatar must be an image',
            'avatar.max' => 'Avatar image size must be less than 1 MB'
        ];
    }
}
