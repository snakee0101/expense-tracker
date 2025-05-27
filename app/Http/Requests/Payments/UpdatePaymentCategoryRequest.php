<?php

namespace App\Http\Requests\Payments;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UpdatePaymentCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('owns-model', $this->route('category'));
    }

    public function rules(): array
    {
        return [
            'name' => [
                'min: 3',
                Rule::unique('payment_categories', 'name')
                    ->where('user_id', auth()->id())
                    ->ignoreModel($this->route('category'))
            ],
            'image' => ['nullable', 'image', 'file', 'max:1024']
        ];
    }

    public function messages()
    {
        return [
            'name.min' => 'Category name must be at least 3 characters long',
            'name.unique' => 'Category has already been taken',
            'image.max' => 'Image size must be less than 1 MB'
        ];
    }
}
