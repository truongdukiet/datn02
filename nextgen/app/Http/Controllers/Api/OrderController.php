<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'voucher', 'paymentGateway', 'orderDetails.productVariant.product'])->get();
        return response()->json(['success' => true, 'data' => $orders]);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'voucher', 'paymentGateway', 'orderDetails.productVariant.product'])->find($id);
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $order]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'UserID' => 'required|integer|exists:users,UserID',
            'VoucherID' => 'nullable|integer|exists:voucher,VoucherID',
            'PaymentID' => 'nullable|integer|exists:payment_gateway,PaymentID',
            'Status' => 'nullable|string',
            'Total_amount' => 'required|numeric|min:0',
            'Receiver_name' => 'required|string|max:255',
            'Receiver_phone' => 'required|string|max:255',
            'Shipping_address' => 'required|string',
        ]);
        $order = Order::create($validated);
        return response()->json(['success' => true, 'data' => $order], 201);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }
        $validated = $request->validate([
            'UserID' => 'sometimes|integer|exists:users,UserID',
            'VoucherID' => 'nullable|integer|exists:voucher,VoucherID',
            'PaymentID' => 'nullable|integer|exists:payment_gateway,PaymentID',
            'Status' => 'nullable|string',
            'Total_amount' => 'sometimes|numeric|min:0',
            'Receiver_name' => 'sometimes|string|max:255',
            'Receiver_phone' => 'sometimes|string|max:255',
            'Shipping_address' => 'sometimes|string',
        ]);
        $order->update($validated);
        return response()->json(['success' => true, 'data' => $order]);
    }

    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }
        $order->delete();
        return response()->json(['success' => true, 'message' => 'Order deleted']);
    }
}
