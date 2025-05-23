<?php

namespace App\Http\Requests\Payments;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreatePaymentCategoryRequest extends FormRequest
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
                Rule::unique('payment_categories')->where('user_id', auth()->id())
            ],
            'image' => ['required', 'image', 'file', 'max:1024']
        ];
    }

    public function messages()
    {
        return [
            'name.min' => 'Category name must be at least 3 characters long',
            'name.unique' => 'Category has already been taken',
            'image.required' => 'Category image is required',
            'image.max' => 'Image size must be less than 1 MB'
        ];
    }
}
