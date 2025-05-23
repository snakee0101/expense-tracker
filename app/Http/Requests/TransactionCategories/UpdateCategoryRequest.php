<?php

namespace App\Http\Requests\TransactionCategories;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
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
                Rule::unique('transaction_categories', 'name')
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
            'name.unique' => 'Category name has already been taken',
            'image.max' => 'Image size must be less than 1 MB'
        ];
    }
}
