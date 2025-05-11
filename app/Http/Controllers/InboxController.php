<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class InboxController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('inbox', [
            'notifications' => auth()->user()->notifications
        ]);
    }

    public function read_notification(Request $request, $notificationId)
    {
        $notification = auth()->user()->notifications->find($notificationId);

        $notification->markAsRead();
    }
}
