<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionCategories\CreateCategoryRequest;
use App\Http\Requests\TransactionCategories\UpdateCategoryRequest;
use App\Models\TransactionCategory;
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

    public function store(CreateCategoryRequest $request)
    {
        TransactionCategory::create([
            'user_id' => auth()->id(),
            'image_path' => $request->file('image')->store('images', 'public'),
            'name' => $request->name
        ]);

        return to_route('transaction_category.index');
    }

    public function update(UpdateCategoryRequest $request, TransactionCategory $category)
    {
        $data = $request->only('name');

        if($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('images', 'public');
        }

        $category->update($data);

        return to_route('transaction_category.index');
    }
}
