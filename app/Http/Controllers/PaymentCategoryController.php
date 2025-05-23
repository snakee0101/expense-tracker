<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payments\CreatePaymentCategoryRequest;
use App\Http\Requests\Payments\UpdatePaymentCategoryRequest;
use App\Models\PaymentCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PaymentCategoryController extends Controller
{
    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function store(CreatePaymentCategoryRequest $request)
    {
        PaymentCategory::create([
            'user_id' => auth()->id(),
            'image_path' => $request->file('image')->store('images', 'public'),
            'name' => $request->name
        ]);

        return to_route('payment_category.index');
    }

    public function show(PaymentCategory $paymentCategory)
    {
        //
    }

    public function edit(PaymentCategory $paymentCategory)
    {
        //
    }

    public function update(UpdatePaymentCategoryRequest $request, PaymentCategory $category)
    {
        $data = $request->only('name');

        if($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('images', 'public');
        }

        $category->update($data);

        return to_route('payment_category.index');
    }

    public function destroy(PaymentCategory $paymentCategory)
    {
        //
    }
}
