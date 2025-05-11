<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class InboxMessage extends Notification
{
    use Queueable;

    public function __construct(protected string $header,
                                protected string $description,
                                protected string $htmlContent)
    {

    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'header' => $this->header,
            'description' => $this->description,
            'htmlContent' => $this->htmlContent
        ];
    }
}
