<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentGateway;

class PaymentGatewayController extends Controller
{
    public function index()
    {
        $gateways = PaymentGateway::all();
        return response()->json(['success' => true, 'data' => $gateways]);
    }

    public function show($id)
    {
        $gateway = PaymentGateway::with('orders')->find($id);
        if (!$gateway) {
            return response()->json(['success' => false, 'message' => 'Payment gateway not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $gateway]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Name' => 'required|string|max:255|unique:payment_gateway,Name'
        ]);
        $gateway = PaymentGateway::create($validated);
        return response()->json(['success' => true, 'data' => $gateway], 201);
    }

    public function update(Request $request, $id)
    {
        $gateway = PaymentGateway::find($id);
        if (!$gateway) {
            return response()->json(['success' => false, 'message' => 'Payment gateway not found'], 404);
        }
        $validated = $request->validate([
            'Name' => 'sometimes|string|max:255|unique:payment_gateway,Name,' . $id . ',PaymentID'
        ]);
        $gateway->update($validated);
        return response()->json(['success' => true, 'data' => $gateway]);
    }

    public function destroy($id)
    {
        $gateway = PaymentGateway::find($id);
        if (!$gateway) {
            return response()->json(['success' => false, 'message' => 'Payment gateway not found'], 404);
        }
        // Nếu có đơn hàng sử dụng thì không cho xóa
        if ($gateway->orders()->count() > 0) {
            return response()->json(['success' => false, 'message' => 'Cannot delete: Payment gateway is used in orders'], 400);
        }
        $gateway->delete();
        return response()->json(['success' => true, 'message' => 'Payment gateway deleted']);
    }
}
