<?php

namespace App\Http\Controllers;

use App\Models\TransactionCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('transaction_categories', [
            'transactionCategoryPaginator' => TransactionCategory::where('user_id', auth()->id())->paginate()
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
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
