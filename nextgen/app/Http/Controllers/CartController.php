<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Hiển thị trang giỏ hàng.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        if (!Auth::check()) {
            // Xử lý giỏ hàng tạm thời cho khách hoặc yêu cầu đăng nhập
            // Để đơn giản, ví dụ này yêu cầu người dùng đăng nhập
            return redirect()->route('login')->with('error', 'Please login to view your cart.');
        }

        $userId = Auth::id();
        $cartItems = Cart::where('UserID', $userId)
                         ->with(['productVariant.product', 'productVariant.attributes.attribute'])
                         ->get();

        return view('cart.index', compact('cartItems'));
    }

    /**
     * Thêm sản phẩm vào giỏ hàng (Xử lý từ form HTML).
     * (Thường API sẽ xử lý việc này, nhưng có thể có form đơn giản cho web)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function add(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please login to add items to cart.');
        }

        $request->validate([
            'product_variant_id' => 'required|exists:productvariants,ProductVariantID',
            'quantity' => 'required|integer|min:1',
        ]);

        $userId = Auth::id();
        $productVariantId = $request->input('product_variant_id');
        $quantity = $request->input('quantity');

        $cartItem = Cart::where('UserID', $userId)
                        ->where('ProductVariantID', $productVariantId)
                        ->first();

        if ($cartItem) {
            $cartItem->Quantity += $quantity;
            $cartItem->Update_at = now();
            $cartItem->save();
        } else {
            Cart::create([
                'UserID' => $userId,
                'ProductVariantID' => $productVariantId,
                'Quantity' => $quantity,
                'Create_at' => now(),
                'Update_at' => now(),
            ]);
        }

        return redirect()->route('cart.index')->with('success', 'Product added to cart!');
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $request->validate([
            'cart_id' => 'required|exists:cart,CartID',
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = Cart::where('CartID', $request->input('cart_id'))
                        ->where('UserID', Auth::id())
                        ->firstOrFail();

        $cartItem->Quantity = $request->input('quantity');
        $cartItem->Update_at = now();
        $cartItem->save();

        return redirect()->route('cart.index')->with('success', 'Cart updated successfully!');
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng.
     *
     * @param  int  $cartId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function remove($cartId)
    {
        Cart::where('CartID', $cartId)
            ->where('UserID', Auth::id())
            ->delete();

        return redirect()->route('cart.index')->with('success', 'Product removed from cart!');
    }
}
