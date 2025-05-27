<?php

namespace App\Http\Requests\Transfers;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UpdateContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('owns-model', $this->route('contact'));
    }

    public function rules(): array
    {
        return [
            'name' => [
                'min: 3',
                Rule::unique('contacts', 'name')
                    ->where('user_id', auth()->id())
                    ->ignoreModel($this->route('contact'))
            ],
            'card_number' => ['regex:/^\d{13,19}$/'],
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
