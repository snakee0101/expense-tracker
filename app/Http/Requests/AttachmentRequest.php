<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class AttachmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('owns-model', $this->route('attachment')->transaction);
    }
}
