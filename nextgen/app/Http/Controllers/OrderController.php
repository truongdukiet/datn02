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
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Thêm chi tiết đơn hàng
        foreach ($validated['products'] as $item) {
            $variant = \App\Models\ProductVariant::find($item['productvariantid']);
            if (!$variant) continue;

            $unitPrice = $variant->Price;
            $subtotal = $unitPrice * $item['quantity'];
            $totalAmount += $subtotal;

            \App\Models\OrderDetail::create([
                'orderid' => $order->orderid,
                'productid' => $variant->ProductID,
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
            ]);
        }

        // Cập nhật tổng tiền cho đơn hàng
        $order->total_amount = $totalAmount;
        $order->save();

        return response()->json(['status' => 'success', 'order_id' => $order->orderid]);
    }
}
