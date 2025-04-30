<?php

namespace App\Http\Controllers;

use App\Models\TransactionCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TransactionCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('transaction_categories', [
            'transactionCategoryPaginator' => TransactionCategory::where('user_id', auth()->id())
                                                                ->latest()
                                                                ->paginate()
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('transaction_categories')->where('user_id', auth()->id())
            ],
            'image' => ['required', 'image', 'file', 'max:1024']
        ]);

        TransactionCategory::create([
            'user_id' => auth()->id(),
            'image_path' => $request->file('image')->store('images', 'public'),
            'name' => $request->name
        ]);

        return to_route('transaction_category.index');
    }

    public function show(TransactionCategory $transactionCategory)
    {
        //
    }

    public function edit(TransactionCategory $transactionCategory)
    {
        //
    }

    public function update(Request $request, TransactionCategory $transactionCategory)
    {
        //
    }

    public function destroy(TransactionCategory $transactionCategory)
    {
        //
    }
}
