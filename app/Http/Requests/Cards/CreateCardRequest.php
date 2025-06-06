<?php

namespace App\Http\Requests\Cards;

use App\Rules\ExpiryDate;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateCardRequest extends FormRequest
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
                Rule::unique('cards')->where('user_id', auth()->id())
            ],
            'card_number' => ['required', 'regex:/^\d{13,19}$/'],
            'expiry_date' => ['required', new ExpiryDate]
        ];
    }

    public function messages()
    {
        return [
            'name.min' => 'Card name must be at least 3 characters long',
            'name.unique' => 'Card name has already been taken',
            'card_number' => 'Card number must be 13-19 digits long',
        ];
    }

    public function expiryDateToCarbon()
    {
        [$month, $year] = explode('/', $this->expiry_date);

        $year = '20' . $year;

        $expiryDate = Carbon::createFromDate($year, $month, 1);

        return $expiryDate->endOfMonth();
    }
}
