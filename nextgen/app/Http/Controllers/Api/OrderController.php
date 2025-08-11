<?php
namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
class OrderController extends Controller
{
    public function index()
    {
        try {
            $orders = Order::with(['user', 'voucher', 'paymentGateway', 'orderDetails.productVariant.product'])->get();
            return response()->json(['success' => true, 'data' => $orders]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve orders: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $order = Order::with(['user', 'voucher', 'paymentGateway', 'orderDetails.productVariant.product'])->find($id);
            
            if (!$order) {
                return response()->json(['success' => false, 'message' => 'Order not found'], 404);
            }
            
            return response()->json(['success' => true, 'data' => $order]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'UserID' => 'required|integer|exists:users,UserID',
                'VoucherID' => 'nullable|integer|exists:voucher,VoucherID',
                'PaymentID' => 'nullable|integer|exists:payment_gateway,PaymentID',
                'Status' => 'nullable|string',
                'Total_amount' => 'required|numeric|min:0',
                'Receiver_name' => 'required|string|max:255',
                'Receiver_phone' => 'required|string|max:255',
                'Shipping_address' => 'required|string',
                'order_details' => 'nullable|array',
                'order_details.*.ProductVariantID' => 'sometimes|integer|exists:productvariants,ProductVariantID',
                'order_details.*.Quantity' => 'sometimes|integer|min:1',
                'order_details.*.Unit_price' => 'sometimes|numeric|min:0',
                'order_details.*.Subtotal' => 'nullable|numeric|min:0',
            ]);

            $orderData = $validated;
            unset($orderData['order_details']);
            $order = Order::create($orderData);

            if (isset($validated['order_details'])) {
                foreach ($validated['order_details'] as $detail) {
                    $detail['OrderID'] = $order->OrderID;
                    \App\Models\OrderDetail::create($detail);
                }
            }

            $order->load(['orderDetails.productVariant.product']);
            return response()->json(['success' => true, 'data' => $order], 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $order = Order::find($id);
            if (!$order) {
                return response()->json(['success' => false, 'message' => 'Order not found'], 404);
            }

            $validated = $request->validate([
                'UserID' => 'sometimes|integer|exists:users,UserID',
                'VoucherID' => 'nullable|integer|exists:voucher,VoucherID',
                'PaymentID' => 'nullable|integer|exists:payment_gateway,PaymentID',
                'Status' => 'sometimes|string|in:pending,processing,completed,cancelled,shipped',
                'Total_amount' => 'sometimes|numeric|min:0',
                'Receiver_name' => 'sometimes|string|max:255',
                'Receiver_phone' => 'sometimes|string|max:255',
                'Shipping_address' => 'sometimes|string',
            ]);

            $order->update($validated);
            $order->load(['user', 'voucher', 'paymentGateway', 'orderDetails.productVariant.product']);

            return response()->json([
                'success' => true,
                'message' => 'Order updated successfully',
                'data' => $order
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $order = Order::find($id);
            if (!$order) {
                return response()->json(['success' => false, 'message' => 'Order not found'], 404);
            }

            $order->orderDetails()->delete();
            $order->delete();

            return response()->json(['success' => true, 'message' => 'Order deleted']);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getUserOrders($userId)
    {
        try {
            $orders = Order::where('UserID', $userId)
                         ->with(['orderDetails.productVariant.product'])
                         ->orderBy('Create_at', 'desc')
                         ->get();

            return response()->json([
                'success' => true,
                'data' => $orders
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user orders: ' . $e->getMessage()
            ], 500);
        }
    }

    public function cancelOrder($orderId)
    {
        try {
            $order = Order::find($orderId);
            
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            $order->Status = 'cancelled';
            $order->save();

            return response()->json([
                'success' => true,
                'message' => 'Đã hủy đơn hàng thành công',
                'data' => $order
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel order: ' . $e->getMessage()
            ], 500);
        }
    }

       public function getOrderDetail($orderId)
    {
        try {
            // Lấy đơn hàng với các thông tin cơ bản
            $order = Order::with(['user', 'voucher', 'paymentGateway'])
                        ->find($orderId);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            // Lấy chi tiết đơn hàng theo cách tương tự viewCart
            $orderDetails = OrderDetail::where('OrderID', $orderId)
                                    ->with(['productVariant.product'])
                                    ->get();

            // Format dữ liệu trả về
            $response = [
                'order_info' => [
                    'id' => $order->OrderID,
                    'status' => $order->Status,
                    'total_amount' => $order->Total_amount,
                    'receiver_name' => $order->Receiver_name,
                    'receiver_phone' => $order->Receiver_phone,
                    'shipping_address' => $order->Shipping_address,
                    'created_at' => $order->created_at,
                    'payment_method' => $order->paymentGateway->Name ?? null,
                    'voucher_code' => $order->voucher->Code ?? null
                ],
                'order_details' => $orderDetails->map(function($detail) {
                    return [
                        'product_name' => $detail->productVariant->product->Name ?? null,
                        'variant_name' => $detail->productVariant->Name ?? null,
                        'quantity' => $detail->Quantity,
                        'Unit_price' => $detail->Unit_price,
                        'Subtotal' => $detail->Subtotal,
                        'Image' => $detail->productVariant->product->Image ?? null
                    ];
                })
            ];

            return response()->json([
                'success' => true,
                'data' => $response
            ]);

        } catch (\Exception $e) {
            \Log::error('Order detail error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get order details'
            ], 500);
        }
    }
}