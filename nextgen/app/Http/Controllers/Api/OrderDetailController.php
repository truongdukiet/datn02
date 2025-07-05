<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrderDetail;

class OrderDetailController extends Controller
{
    public function index()
    {
        $details = OrderDetail::with(['order', 'productVariant.product'])->get();
        return response()->json(['success' => true, 'data' => $details]);
    }

    public function show($id)
    {
        $detail = OrderDetail::with(['order', 'productVariant.product'])->find($id);
        if (!$detail) {
            return response()->json(['success' => false, 'message' => 'Order detail not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $detail]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'OrderID' => 'required|integer|exists:orders,OrderID',
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
            'Quantity' => 'required|integer|min:1',
            'Unit_price' => 'required|numeric|min:0',
            'Subtotal' => 'required|numeric|min:0',
        ]);
        $detail = OrderDetail::create($validated);
        return response()->json(['success' => true, 'data' => $detail], 201);
    }

    public function update(Request $request, $id)
    {
        $detail = OrderDetail::find($id);
        if (!$detail) {
            return response()->json(['success' => false, 'message' => 'Order detail not found'], 404);
        }
        $validated = $request->validate([
            'OrderID' => 'sometimes|integer|exists:orders,OrderID',
            'ProductVariantID' => 'sometimes|integer|exists:productvariants,ProductVariantID',
            'Quantity' => 'sometimes|integer|min:1',
            'Unit_price' => 'sometimes|numeric|min:0',
            'Subtotal' => 'sometimes|numeric|min:0',
        ]);
        $detail->update($validated);
        return response()->json(['success' => true, 'data' => $detail]);
    }

    public function destroy($id)
    {
        $detail = OrderDetail::find($id);
        if (!$detail) {
            return response()->json(['success' => false, 'message' => 'Order detail not found'], 404);
        }
        $detail->delete();
        return response()->json(['success' => true, 'message' => 'Order detail deleted']);
    }
}
