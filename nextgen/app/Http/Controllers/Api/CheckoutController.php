<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\PaymentGateway;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\ProductVariant;
use App\Models\CartItem;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class CheckoutController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please login to checkout.');
        }

        $userId = Auth::id();
        $cartItems = Cart::where('UserID', $userId)
                         ->with(['productVariant']) // Loại bỏ các mối quan hệ không cần thiết
                         ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty. Please add some products.');
        }

        $paymentGateways = PaymentGateway::all();
        $totalAmount = $cartItems->sum(function($item) {
            return $item->Quantity * $item->productVariant->Price;
        });

        return view('checkout.index', compact('cartItems', 'paymentGateways', 'totalAmount'));
    }

    public function placeOrder(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please login to place an order.');
        }

        $request->validate([
            'receiver_name'     => 'required|string|max:255',
            'receiver_phone'    => 'required|string|max:255',
            'shipping_address'  => 'required|string',
            'payment_id'        => 'required|exists:payment_gateway,PaymentID',
            'voucher_code'      => 'nullable|string|exists:voucher,Code',
        ]);

        $userId = Auth::id();
        $cartItems = Cart::where('UserID', $userId)->with('productVariant')->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        DB::beginTransaction();
        try {
            $totalAmount = $cartItems->sum(function($item) {
                return $item->Quantity * $item->productVariant->Price; // Kiểm tra giá trị
            });

            $voucherId = null;
            if ($request->filled('voucher_code')) {
                $voucher = Voucher::where('Code', $request->input('voucher_code'))
                                  ->where('Quantity', '>', 0)
                                  ->where('Expiry_date', '>=', now()->toDateString())
                                  ->first();
                if ($voucher) {
                    $totalAmount -= $voucher->Value;
                    $voucherId = $voucher->VoucherID;
                    $voucher->decrement('Quantity'); // Giảm số lượng voucher
                } else {
                    DB::rollBack();
                    return redirect()->back()->withInput()->with('error', 'Invalid or expired voucher code.');
                }
            }

            // Tạo đơn hàng mới
            $order = Order::create([
                'InvoiceCode' => 'INV-' . uniqid(),
                'UserID' => $userId,
                'VoucherID' => $voucherId,
                'PaymentID' => $request->input('payment_id'),
                'Status' => 'Pending',
                'Total_amount' => max(0, $totalAmount),
                'Receiver_name' => $request->input('receiver_name'),
                'Receiver_phone' => $request->input('receiver_phone'),
                'Shipping_address' => $request->input('shipping_address'),
                'Create_at' => now(),
                'Update_at' => now(),
            ]);

            // Thêm chi tiết đơn hàng
            foreach ($cartItems as $item) {
                OrderDetail::create([
                    'OrderID' => $order->OrderID,
                    'ProductVariantID' => $item->productVariant->ProductVariantID, // Sử dụng thuộc tính đúng
                    'Quantity' => $item->Quantity,
                    'Unit_price' => $item->productVariant->Price,
                    'Subtotal' => $item->Quantity * $item->productVariant->Price,
                ]);

                // Giảm số lượng sản phẩm trong kho
                $item->productVariant->decrement('Stock', $item->Quantity);
            }
            $cartItems = Cart::where('UserID', $userId)
                             ->with(['productVariant.product', 'productVariant.attributes.attribute'])
                             ->get();
            foreach ($cartItems as $cartItem) {
                CartItem::where('CartID', $cartItem->CartID)->delete();
            }
            // Xóa các sản phẩm khỏi giỏ hàng
            Cart::where('UserID', $userId)->delete();

            DB::commit();
            return redirect()->route('order.success', $order->OrderID)->with('success', 'Order placed successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withInput()->with('error', 'Failed to place order: ' . $e->getMessage());
        }
    }

    public function success($orderId)
    {
        $order = Order::with(['orderDetails.productVariant', 'paymentGateway'])->findOrFail($orderId);
        return view('checkout.success', compact('order'));
    }

  public function checkout(Request $request, $userId)
    {
        // if (!Auth::check()) {
        //     return response()->json(['error' => 'Unauthorized'], 401);
        // }

        $request->validate([
            'cartItems' => 'required|array',
            'cartItems.*.ProductVariantID' => 'required|integer',
            'cartItems.*.Quantity' => 'required|integer|min:1',
            'totalAmount' => 'required|numeric',
            'receiverName' => 'required|string',
            'receiverPhone' => 'required|string',
            'address' => 'required|string',
            'paymentMethod' => 'required|string',
        ]);


        $cartItems = Cart::where('UserID', $userId)->with('productVariant')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Your cart is empty.'], 400);
        }

        DB::beginTransaction();
        try {
            $totalAmount = $request->input('totalAmount');

            // Tạo đơn hàng mới
            $order = Order::create([
                'InvoiceCode' => 'INV-' . uniqid(),
                'UserID' => $userId,
                'Total_amount' => $totalAmount,
                'Status' => 'Pending',
                'Receiver_name' => $request->input('receiverName'),
                'Receiver_phone' => $request->input('receiverPhone'),
                'Shipping_address' => $request->input('address'),
                'Payment_method' => $request->input('paymentMethod'),
                'Create_at' => now(),
                'Update_at' => now(),
            ]);

            foreach ($request->input('cartItems') as $item) {
                $productVariant = ProductVariant::find($item['ProductVariantID']);
                if (!$productVariant) {
                    return response()->json(['error' => 'Invalid ProductVariantID'], 400);
                }

                OrderDetail::create([
                    'OrderID' => $order->OrderID,
                    'ProductVariantID' => $item['ProductVariantID'],
                    'Quantity' => $item['Quantity'],
                    'Unit_price' => $productVariant->Price,
                    'Subtotal' => $item['Quantity'] * $productVariant->Price,
                ]);
            }

            // Xóa tất cả các mục trong giỏ hàng
            CartItem::where('CartID', $cartItems->first()->CartID)->delete(); // Xóa tất cả các mục dựa trên CartID
            Cart::where('UserID', $userId)->delete(); // Xóa giỏ hàng

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Order placed successfully!', 'orderId' => $order->OrderID]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to place order: ' . $e->getMessage()], 500);
        }
    }

public function payment(Request $request)
{
    try {
        // Xác thực dữ liệu đầu vào
        $validated = $request->validate([
            'UserID' => 'required|integer|exists:users,UserID',
            'Total_amount' => 'required|numeric|min:0',
            'Receiver_name' => 'required|string|max:255',
            'Receiver_phone' => 'required|string|max:255',
            'Shipping_address' => 'required|string',
            'order_details' => 'required|array',
            'order_details.*.ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
            'order_details.*.Quantity' => 'required|integer|min:1',
            'order_details.*.Unit_price' => 'required|numeric|min:0',
            'order_details.*.Subtotal' => 'required|numeric|min:0',
        ]);

        // Tạo đơn hàng
        $orderData = $validated;
        unset($orderData['order_details']);
        $order = Order::create($orderData);

        // Lưu order details
        foreach ($validated['order_details'] as $detail) {
            $detail['OrderID'] = $order->OrderID;
            \App\Models\OrderDetail::create($detail);
        }

        // Tính tổng số tiền từ order details
        $totalAmount = array_sum(array_column($validated['order_details'], 'Subtotal'));

        // Cấu hình VNPay
        $vnpayConfig = include base_path('config/config.php');
        $vnp_TmnCode = $vnpayConfig['vnp_TmnCode'];
        $vnp_HashSecret = $vnpayConfig['vnp_HashSecret'];
        $vnp_Url = $vnpayConfig['vnp_Url'];
        $vnp_ReturnUrl = $vnpayConfig['vnp_Returnurl'];

        // Tạo dữ liệu cho VNPay
        $vnp_TxnRef = time() . rand(1000, 9999); // Mã giao dịch duy nhất
        $vnp_Amount = (int)($totalAmount * 100);
        $vnp_IpAddr = $request->ip();
        $expireDate = date('YmdHis', strtotime('+15 minutes'));

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_ExpireDate" => $expireDate,
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => "vn",
            "vnp_OrderInfo" => "Thanh toan GD: " . $vnp_TxnRef,
            "vnp_OrderType" => "other",
            "vnp_ReturnUrl" => $vnp_ReturnUrl,
            "vnp_TxnRef" => $vnp_TxnRef,
        ];

        // Loại bỏ giá trị rỗng
        $inputData = array_filter($inputData, function($value) {
            return $value !== null && $value !== '';
        });

        // Sắp xếp dữ liệu theo key
        ksort($inputData);
        
        // Tạo chuỗi dữ liệu để hash (hashdata) và chuỗi query
        $hashdata = "";
        $query = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            // Tạo chuỗi hashdata
            if ($i == 0) {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= "&" . urlencode($key) . "=" . urlencode($value);
            }
            
            // Tạo chuỗi query
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
            $i++;
        }

        // Tạo URL base
        $vnp_Url = $vnp_Url . "?" . $query;
        
        // Tạo chữ ký bảo mật từ chuỗi hashdata
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        // Log để debug
        \Log::info('===== VNPAY SIGNATURE DEBUG =====');
        \Log::info('Input Data: ' . print_r($inputData, true));
        \Log::info('Hash Data: ' . $hashdata);
        \Log::info('Generated Secure Hash: ' . $vnpSecureHash);
        \Log::info('Full Payment URL: ' . $vnp_Url);
        \Log::info('===============================');

        return response()->json([
            'success' => true,
            'paymentUrl' => $vnp_Url
        ]);
        
    } catch (\Exception $e) {
        \Log::error('Payment error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
}

public function payment_return(Request $request)
{
    require_once(base_path('config/config.php'));

    $vnp_SecureHash = $request->input('vnp_SecureHash');
    $inputData = $request->except('vnp_SecureHash');

    ksort($inputData);
    $hashData = http_build_query($inputData);

    $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

    if ($secureHash == $vnp_SecureHash) {
        if ($request->input('vnp_ResponseCode') == '00') {
            // Giao dịch thành công
            return redirect()->route('thank-you')->with('success', 'Giao dịch thành công');
        } else {
            return redirect()->route('cart')->with('error', 'Giao dịch không thành công');
        }
    } else {
        return redirect()->route('cart')->with('error', 'Chữ ký không hợp lệ');
    }
}

}
