<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // Validate dữ liệu đầu vào
        $validated = $request->validate([
            'userid' => 'required|integer',
            'receiver_name' => 'required|string',
            'receiver_phone' => 'required|string',
            'shipping_address' => 'required|string',
            'voucherid' => 'nullable|integer',
            'paymentid' => 'required|integer',
            'products' => 'required|array',
            'products.*.productvariantid' => 'required|integer',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        $totalAmount = 0;

        // Tạo đơn hàng
        $order = \App\Models\Order::create([
            'userid' => $validated['userid'],
            'voucherid' => $validated['voucherid'] ?? null,
            'paymentid' => $validated['paymentid'],
            'receiver_name' => $validated['receiver_name'],
            'receiver_phone' => $validated['receiver_phone'],
            'shipping_address' => $validated['shipping_address'],
            'status' => 'pending',
            'create_at' => now(),
            'update_at' => now(),
        ]);

        $orderDetails = [];
        foreach ($validated['products'] as $item) {
            $variant = \App\Models\ProductVariant::find($item['productvariantid']);
            if (!$variant) continue;

            $unitPrice = $variant->Price;
            $subtotal = $unitPrice * $item['quantity'];
            $totalAmount += $subtotal;

            $orderDetail = \App\Models\OrderDetail::create([
                'orderid' => $order->orderid,
                'productid' => $variant->ProductID,
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
            ]);
            $orderDetails[] = $orderDetail;
        }

        // Cập nhật tổng tiền cho đơn hàng
        $order->total_amount = $totalAmount;
        $order->save();

        // Load lại order cùng chi tiết đơn hàng
        $order->load(['user', 'orderDetails.product']);

        return response()->json([
            'status' => 'success',
            'order' => $order,
            'order_details' => $orderDetails
        ]);
    }

    public function index()
    {
        return \App\Models\Order::all();
    }

    public function show($id) { /* ... */ }

    public function update(Request $request, $id) { /* ... */ }

    public function destroy($id) { /* ... */ }
}
