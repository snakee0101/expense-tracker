<?php

namespace App\Http\Controllers;

use App\Models\SavingsPlan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SavingsPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('savings_plans', [
            'savings_plans' => SavingsPlan::where('user_id', auth()->id())
                ->latest()
                ->get()
        ]);
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
        $validated = $request->validate([
            'name' => [
                'min: 3',
                Rule::unique('cards')->where('user_id', auth()->id())
            ],
            'target_balance' => ['required', 'numeric', 'gt:0'],
            'due_date' => ['required', 'date-format:Y-m-d H:i:s'],
            'savings_tips' => ['nullable']
        ]);

        SavingsPlan::create([
            'user_id' => auth()->id(),
            ...$validated
        ]);

        return to_route('savings_plan.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(SavingsPlan $savingsPlan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SavingsPlan $savingsPlan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SavingsPlan $savingsPlan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SavingsPlan $savingsPlan)
    {
        //
    }
}
