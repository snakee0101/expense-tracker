<?php

namespace App\Http\Requests\SavingsPlans;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateSavingsPlanRequest extends FormRequest
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
                Rule::unique('savings_plans')
                    ->where('user_id', auth()->id())
            ],
            'target_balance' => ['required', 'numeric', 'gt:0'],
            'due_date' => ['required', 'date-format:Y-m-d H:i:s', 'after:today'],
            'savings_tips' => ['nullable']
        ];
    }

    public function messages()
    {
        return [
            'name.min' => 'Savings plan name must be at least 3 characters long',
            'name.unique' => 'Savings plan name must be unique',
            'target_balance' => 'Target balance must be greater than 0',
            'due_date.required' => 'Select Due date',
            'due_date.after' => 'Selected date must be in the future'
        ];
    }
}
