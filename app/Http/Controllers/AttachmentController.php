<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    public function download(Request $request, Attachment $attachment)
    {
        return Storage::disk('public')->download($attachment->storage_location, $attachment->original_filename);
    }
}
