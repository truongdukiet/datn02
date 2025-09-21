<?php
namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Voucher;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\User;
use App\Models\ProductVariant;
use App\Models\Review;

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

            // Xử lý voucher
            $voucher = null;
            if (!empty($validated['VoucherID'])) {
                $voucher = Voucher::find($validated['VoucherID']);

                // Kiểm tra voucher hợp lệ
                if (!$voucher || $voucher->Quantity <= 0 ||
                    now() > $voucher->Expiry_date ||
                    !$voucher->Status) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Voucher không hợp lệ hoặc đã hết hạn'
                    ], 400);
                }

                // Giảm số lượng voucher
                $voucher->decrement('Quantity');
            }

            // Thiết lập trạng thái mặc định nếu không có
            if (!isset($validated['Status'])) {
                $validated['Status'] = 'pending';
            }

            // Thêm thời gian trạng thái
            $now = now();
            $validated['Create_at'] = $now;
            $validated['Pending_at'] = $now;

            // Tạo đơn hàng
            $orderData = $validated;
            unset($orderData['order_details']);
            $order = Order::create($orderData);

            // Tạo chi tiết đơn hàng
            if (isset($validated['order_details'])) {
                foreach ($validated['order_details'] as $detail) {
                    $detail['OrderID'] = $order->OrderID;
                    OrderDetail::create($detail);
                }
            }

            // Xóa giỏ hàng
            $cart = Cart::where('UserID', $validated['UserID'])->first();
            if ($cart) {
                $cart->items()->delete();
            }

            // Cập nhật thông tin người dùng nếu cần
            $user = User::find($validated['UserID']);
            if ($user) {
                $updateData = [];
                
                // Cập nhật tên nếu chưa có
                if (empty($user->Fullname) && !empty($validated['Receiver_name'])) {
                    $updateData['Fullname'] = $validated['Receiver_name'];
                }
                
                // Cập nhật số điện thoại nếu chưa có
                if (empty($user->Phone) && !empty($validated['Receiver_phone'])) {
                    $updateData['Phone'] = $validated['Receiver_phone'];
                }
                
                // Cập nhật địa chỉ nếu chưa có
                if (empty($user->Address) && !empty($validated['Shipping_address'])) {
                    $updateData['Address'] = $validated['Shipping_address'];
                }
                
                // Nếu có dữ liệu để cập nhật
                if (!empty($updateData)) {
                    $user->update($updateData);
                    
                    // Thêm thông tin cập nhật vào response
                    $responseData['user_updated'] = true;
                    $responseData['updated_user_data'] = $updateData;
                }
            }

            // Tạo URL xem đơn hàng
            $orderUrl = "http://localhost:5173/myorder/{$order->OrderID}";

            // Gửi mail xác nhận đơn hàng
            Mail::send([], [], function ($message) use ($user, $order, $orderUrl) {
                $message->to($user->Email)
                    ->subject('Xác nhận đơn hàng #' . $order->OrderID)
                    ->html("
                        <p>Xin chào {$user->Fullname},</p>
                        <p>Cảm ơn bạn đã đặt hàng tại cửa hàng chúng tôi.</p>
                        <p><strong>Mã đơn hàng:</strong> #{$order->OrderID}</p>
                        <p><strong>Tổng giá trị:</strong> " . number_format($order->Total_amount) . " VNĐ</p>
                        <p><strong>Địa chỉ giao hàng:</strong> {$order->Shipping_address}</p>
                        <p><strong>Số điện thoại:</strong> {$order->Receiver_phone}</p>
                        <p><strong>Chi tiết đơn hàng:</strong></p>
                        <p>Bạn có thể theo dõi đơn hàng tại: <a href='{$orderUrl}'>{$orderUrl}</a></p>
                        <p>Trân trọng,</p>
                        <p>NextGen Team</p>
                    ");
            });

            return response()->json([
                'success' => true,
                'message' => 'Order Create successfully',
                'data' => $order
            ], 201);

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

            // Xử lý cập nhật thời gian trạng thái
            $now = now();
            if (isset($validated['Status'])) {
                switch ($validated['Status']) {
                    case 'pending':
                        $validated['Pending_at'] = $now;
                        break;
                    case 'processing':
                        $validated['Processing_at'] = $now;
                        break;
                    case 'shipped':
                        $validated['Shipping_at'] = $now;
                        break;
                    case 'completed':
                        $validated['Completed_at'] = $now;
                        break;
                    case 'cancelled':
                        $validated['Cancelled_at'] = $now;
                        break;
                }
            }

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
            // Get the authenticated user ID
            $userId = Auth::id();
            
            // Lấy đơn hàng với các thông tin cơ bản
            $order = Order::with(['user', 'voucher', 'paymentGateway'])
                        ->find($orderId);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            // Lấy chi tiết đơn hàng với reviews của user đã đặt hàng
            $orderDetails = OrderDetail::where('OrderID', $orderId)
                                    ->with(['productVariant.product'])
                                    ->get();

            // Format dữ liệu trả về
            $response = [
                'order_info' => [
                    'id' => $order->OrderID,
                    'user_id' => $order->UserID,
                    'status' => $order->Status,
                    'total_amount' => $order->Total_amount,
                    'receiver_name' => $order->Receiver_name,
                    'receiver_phone' => $order->Receiver_phone,
                    'shipping_address' => $order->Shipping_address,
                    'Create_at' => $order->Create_at,
                    'pending_at' => $order->Pending_at,
                    'processing_at' => $order->Processing_at,
                    'shipping_at' => $order->Shipping_at,
                    'completed_at' => $order->Completed_at,
                    'cancelled_at' => $order->Cancelled_at,
                    'payment_method' => $order->paymentGateway->Name ?? null,
                    'voucher_code' => $order->voucher->Code ?? null
                ],
                'order_details' => $orderDetails->map(function($detail) use ($userId) {
                    // Kiểm tra xem người dùng hiện tại đã đánh giá sản phẩm này chưa
                    $isReviewed = Review::where('UserID', $userId)
                        ->where('ProductVariantID', $detail->ProductVariantID)
                        ->exists();
                    
                    // Lấy thông tin đánh giá nếu có
                    $review = null;
                    if ($isReviewed) {
                        $review = Review::where('UserID', $userId)
                            ->where('ProductVariantID', $detail->ProductVariantID)
                            ->first();
                    }
                    
                    return [
                        'OrderDetailID'    => $detail->OrderDetailID,
                        'UserID'          => $userId,
                        'ProductVariantID' => $detail->ProductVariantID,
                        'product_name'     => $detail->productVariant->product->Name ?? null,
                        'variant_name'     => $detail->productVariant->Name ?? null,
                        'quantity'         => $detail->Quantity,
                        'Unit_price'       => $detail->Unit_price,
                        'Subtotal'         => $detail->Subtotal,
                        'Image'            => $detail->productVariant->product->Image ?? null,
                        // Thêm thông tin product_variant
                        'product_variant' => [
                            'Image'            => $detail->productVariant->Image ?? null,
                            'Price'            => $detail->productVariant->Price ?? null,
                            'ProductID'        => $detail->productVariant->product->ProductID ?? null,
                            'ProductVariantID' => $detail->productVariant->ProductVariantID ?? null,
                            'Sku'              => $detail->productVariant->Sku ?? null,
                            'Stock'            => $detail->productVariant->Stock ?? null,
                            'Update_at'        => $detail->productVariant->updated_at,
                            'Create_at'       => $detail->productVariant->Create_at,
                        ],
                        // Thêm thông tin đánh giá
                        'is_reviewed' => $isReviewed,
                        'review' => $review ? [
                            'ReviewID' => $review->ReviewID,
                            'Star_rating' => $review->Star_rating,
                            'Comment' => $review->Comment,
                            'Status' => $review->Status,
                            'Create_at' => $review->Create_at,
                        ] : null
                    ];
                }),
            ];

            return response()->json([
                'success' => true,
                'data' => $response
            ]);

        } catch (\Exception $e) {
            \Log::error('Order detail error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get order details: ' . $e->getMessage()
            ], 500);
        }
    }
}