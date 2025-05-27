<?php

namespace App\Http\Controllers;

use App\Http\Requests\AttachmentRequest;
use App\Models\Attachment;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    public function download(AttachmentRequest $request, Attachment $attachment)
    {
        return Storage::disk('public')->download($attachment->storage_location, $attachment->original_filename);
    }
}
