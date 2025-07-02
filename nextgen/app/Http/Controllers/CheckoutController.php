<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\PaymentGateway;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    /**
     * Hiển thị trang thanh toán.
     *
     * @return \Illuminate\View\View|\Illuminate\Http\RedirectResponse
     */
    public function index()
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please login to checkout.');
        }

        $userId = Auth::id();
        $cartItems = Cart::where('UserID', $userId)
                         ->with(['productVariant.product', 'productVariant.attributes.attribute'])
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

    /**
     * Xử lý quá trình đặt hàng.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function placeOrder(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please login to place an order.');
        }

        $request->validate([
            'receiver_name' => 'required|string|max:255',
            'receiver_phone' => 'required|string|max:255',
            'shipping_address' => 'required|string',
            'payment_id' => 'required|exists:payment_gateway,PaymentID',
            'voucher_code' => 'nullable|string|exists:voucher,Code',
        ]);

        $userId = Auth::id();
        $cartItems = Cart::where('UserID', $userId)->with('productVariant')->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        DB::beginTransaction();
        try {
            $totalAmount = $cartItems->sum(function($item) {
                return $item->Quantity * $item->productVariant->Price;
            });

            $voucherId = null;
            if ($request->filled('voucher_code')) {
                $voucher = Voucher::where('Code', $request->input('voucher_code'))
                                  ->where('Quantity', '>', 0)
                                  ->where('Expiry_date', '>=', now()->toDateString())
                                  ->first();
                if ($voucher) {
                    // Áp dụng giảm giá voucher
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
                'InvoiceCode' => 'INV-' . uniqid(), // Tạo mã hóa đơn duy nhất
                'UserID' => $userId,
                'VoucherID' => $voucherId,
                'PaymentID' => $request->input('payment_id'),
                'Status' => 'Pending', // Trạng thái ban đầu
                'Total_amount' => max(0, $totalAmount), // Đảm bảo tổng tiền không âm
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
                    'ProductVariantID' => $item->ProductVariantID,
                    'Quantity' => $item->Quantity,
                    'Unit_price' => $item->productVariant->Price,
                    'Subtotal' => $item->Quantity * $item->productVariant->Price,
                ]);

                // Giảm số lượng sản phẩm trong kho (stock)
                $item->productVariant->decrement('Stock', $item->Quantity);
            }

            // Xóa các sản phẩm khỏi giỏ hàng sau khi đặt hàng thành công
            Cart::where('UserID', $userId)->delete();

            DB::commit();
            return redirect()->route('order.success', $order->OrderID)->with('success', 'Order placed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withInput()->with('error', 'Failed to place order: ' . $e->getMessage());
        }
    }

    // Phương thức hiển thị trang đặt hàng thành công (tùy chọn)
    public function success($orderId)
    {
        $order = Order::with(['orderDetails.productVariant.product', 'paymentGateway'])->findOrFail($orderId);
        return view('checkout.success', compact('order'));
    }
}
