<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('contacts', 'name')->where('user_id', auth()->id())
            ],
            'card_number' => ['required', 'regex:/^\d{13,19}$/'],
            'avatar' => ['nullable', 'image', 'file', 'max:1024']
        ]);

        Contact::create([
            'name' => $request->name,
            'card_number' => $request->card_number,
            'avatar_path' => $request->file('avatar')->store('images', 'public'),
            'user_id' => auth()->id(),
        ]);

        return to_route('transfer.index');
    }

    public function update(Request $request, Contact $contact)
    {
        $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('contacts', 'name')->where('user_id', auth()->id())->ignoreModel($contact)
            ],
            'card_number' => ['regex:/^\d{13,19}$/'],
            'avatar' => ['nullable', 'image', 'file', 'max:1024']
        ]);

        $data = $request->only('name', 'card_number');

        if($request->hasFile('avatar')) {
            $data['avatar_path'] = $request->file('avatar')->store('images', 'public');
        }

        $contact->update($data);

        return to_route('transfer.index');
    }
}
