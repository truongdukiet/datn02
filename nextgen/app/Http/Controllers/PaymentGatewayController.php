<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use Illuminate\Http\Request;

class PaymentGatewayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(PaymentGateway::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Name' => 'required|string|max:255'
        ]);
        $gateway = PaymentGateway::create($validated);
        return response()->json($gateway, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $gateway = PaymentGateway::find($id);
        if (!$gateway) {
            return response()->json(['message' => 'Payment gateway not found'], 404);
        }
        return response()->json($gateway);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $gateway = PaymentGateway::find($id);
        if (!$gateway) {
            return response()->json(['message' => 'Payment gateway not found'], 404);
        }
        $validated = $request->validate([
            'Name' => 'required|string|max:255'
        ]);
        $gateway->update($validated);
        return response()->json($gateway->fresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $gateway = PaymentGateway::find($id);
        if (!$gateway) {
            return response()->json(['message' => 'Payment gateway not found'], 404);
        }
        $gateway->delete();
        return response()->json(['message' => 'Payment gateway deleted']);
    }
}
