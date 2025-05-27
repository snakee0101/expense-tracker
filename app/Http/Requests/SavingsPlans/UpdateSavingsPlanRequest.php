<?php

namespace App\Http\Requests\SavingsPlans;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UpdateSavingsPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('owns-model', $this->route('savings_plan'));
    }

    public function rules(): array
    {
        $savingsPlan = $this->route('savings_plan');

        return [
            'name' => [
                'min: 3',
                Rule::unique('savings_plans')
                    ->where('user_id', auth()->id())
                    ->ignoreModel($savingsPlan)
            ],
            'target_balance' => ['required', 'numeric', "gte:{$savingsPlan->balance}"],
            'due_date' => ['required', 'date-format:Y-m-d H:i:s', 'after:today'],
            'savings_tips' => ['nullable']
        ];
    }

    public function messages()
    {
        return [
            'name.min' => 'Savings plan name must be at least 3 characters long',
            'name.unique' => 'Savings plan name must be unique',
            'target_balance' => 'Target balance must be greater than current balance',
            'due_date.required' => 'Select Due date',
            'due_date.after' => 'Selected date must be in the future'
        ];
    }
}
