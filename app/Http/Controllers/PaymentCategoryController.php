<?php

namespace App\Http\Controllers;

use App\Models\PaymentCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PaymentCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('payment_categories')->where('user_id', auth()->id())
            ],
            'image' => ['required', 'image', 'file', 'max:1024']
        ]);

        PaymentCategory::create([
            'user_id' => auth()->id(),
            'image_path' => $request->file('image')->store('images', 'public'),
            'name' => $request->name
        ]);

        return to_route('payment_category.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentCategory $paymentCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentCategory $paymentCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PaymentCategory $category)
    {
        $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('payment_categories', 'name')
                    ->where('user_id', auth()->id())
                    ->ignoreModel($category)
            ],
            'image' => ['nullable', 'image', 'file', 'max:1024']
        ]);

        $data = $request->only('name');

        if($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('images', 'public');
        }

        $category->update($data);

        return to_route('payment_category.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentCategory $paymentCategory)
    {
        //
    }
}
