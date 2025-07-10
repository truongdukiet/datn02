<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\OrderDetail;
use Illuminate\Http\Request;

class OrderDetailController extends Controller
{
    // Lấy tất cả chi tiết đơn hàng
    public function index()
    {
        return response()->json(OrderDetail::all());
    }

    // Lấy chi tiết đơn hàng theo ID
    public function show($id)
    {
        $orderDetail = OrderDetail::find($id);
        if (!$orderDetail) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($orderDetail);
    }

    // Tạo mới chi tiết đơn hàng
    public function store(Request $request)
    {
        $validated = $request->validate([
            'orderid' => 'required|integer',
            'productid' => 'required|integer',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric',
            'subtotal' => 'required|numeric',
        ]);
        $orderDetail = OrderDetail::create($validated);
        return response()->json($orderDetail, 201);
    }

    // Cập nhật chi tiết đơn hàng
    public function update(Request $request, $id)
    {
        $orderDetail = OrderDetail::find($id);
        if (!$orderDetail) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $validated = $request->validate([
            'orderid' => 'sometimes|integer',
            'productid' => 'sometimes|integer',
            'quantity' => 'sometimes|integer|min:1',
            'unit_price' => 'sometimes|numeric',
            'subtotal' => 'sometimes|numeric',
        ]);
        $orderDetail->update($validated);
        return response()->json($orderDetail);
    }

    // Xóa chi tiết đơn hàng
    public function destroy($id)
    {
        $orderDetail = OrderDetail::find($id);
        if (!$orderDetail) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $orderDetail->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
