<?php

namespace App\Http\Controllers;

use App\Http\Requests\Transfers\CreateContactRequest;
use App\Http\Requests\Transfers\UpdateContactRequest;
use App\Models\Contact;

class ContactController extends Controller
{
    public function store(CreateContactRequest $request)
    {
        Contact::create([
            'name' => $request->name,
            'card_number' => $request->card_number,
            'avatar_path' => $request->hasFile('avatar') ? $request->file('avatar')->store('images', 'public') : Contact::defaultAvatarPath(),
            'user_id' => auth()->id(),
        ]);

        return to_route('transfer.index');
    }

    public function update(UpdateContactRequest $request, Contact $contact)
    {
        $data = $request->only('name', 'card_number');

        if($request->hasFile('avatar')) {
            $data['avatar_path'] = $request->file('avatar')->store('images', 'public');
        }

        $contact->update($data);

        return to_route('transfer.index');
    }
}
