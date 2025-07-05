<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller; // Đảm bảo Controller được import

class Cart extends Controller
{
    /**
     * Thêm sản phẩm vào giỏ hàng.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addToCart(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'product_id' => 'required|integer',
            'name' => 'required|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $request->session()->get('cart', []); // Lấy giỏ hàng từ session, nếu không có thì tạo mảng rỗng
        $productId = $request->input('product_id');

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $request->input('quantity'); // Cập nhật số lượng
        } else {
            // Thêm sản phẩm mới vào giỏ hàng
            $cart[$productId] = [
                "product_id" => $productId,
                "name" => $request->input('name'),
                "quantity" => $request->input('quantity'),
                "price" => $request->input('price'),
                "image" => $request->input('image', null) // Có thể thêm trường image nếu cần
            ];
        }

        $request->session()->put('cart', $cart); // Lưu giỏ hàng vào session

        return response()->json([
            'message' => 'Sản phẩm đã được thêm vào giỏ hàng.',
            'cart' => array_values($cart) // Trả về giỏ hàng dưới dạng mảng các đối tượng
        ], 200);
    }

    /**
     * Xem tất cả các sản phẩm trong giỏ hàng.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function viewCart(Request $request)
    {
        $cart = $request->session()->get('cart', []);
        return response()->json([
            'message' => 'Giỏ hàng của bạn.',
            'cart' => array_values($cart), // Trả về giỏ hàng dưới dạng mảng các đối tượng
            'total_items' => count($cart),
            'total_price' => array_reduce($cart, function($sum, $item) {
                return $sum + ($item['price'] * $item['quantity']);
            }, 0)
        ], 200);
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateCartItem(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'product_id' => 'required|integer',
            'quantity' => 'required|integer|min:0', // Cho phép quantity = 0 để xóa sản phẩm
        ]);

        $cart = $request->session()->get('cart', []);
        $productId = $request->input('product_id');
        $newQuantity = $request->input('quantity');

        if (isset($cart[$productId])) {
            if ($newQuantity <= 0) {
                unset($cart[$productId]); // Xóa sản phẩm nếu số lượng là 0 hoặc âm
                $message = 'Sản phẩm đã được xóa khỏi giỏ hàng.';
            } else {
                $cart[$productId]['quantity'] = $newQuantity; // Cập nhật số lượng
                $message = 'Số lượng sản phẩm đã được cập nhật.';
            }
            $request->session()->put('cart', $cart); // Lưu giỏ hàng đã cập nhật
            return response()->json([
                'message' => $message,
                'cart' => array_values($cart)
            ], 200);
        }

        return response()->json([
            'message' => 'Sản phẩm không tồn tại trong giỏ hàng.'
        ], 404);
    }

    /**
     * Xóa một sản phẩm khỏi giỏ hàng.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function removeFromCart(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'product_id' => 'required|integer',
        ]);

        $cart = $request->session()->get('cart', []);
        $productId = $request->input('product_id');

        if (isset($cart[$productId])) {
            unset($cart[$productId]); // Xóa sản phẩm khỏi giỏ hàng
            $request->session()->put('cart', $cart); // Lưu giỏ hàng đã cập nhật
            return response()->json([
                'message' => 'Sản phẩm đã được xóa khỏi giỏ hàng.'
            ], 200);
        }

        return response()->json([
            'message' => 'Sản phẩm không tồn tại trong giỏ hàng.'
        ], 404);
    }

    /**
     * Xóa sạch toàn bộ giỏ hàng.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function clearCart(Request $request)
    {
        $request->session()->forget('cart'); // Xóa toàn bộ giỏ hàng khỏi session
        return response()->json([
            'message' => 'Giỏ hàng đã được làm trống.'
        ], 200);
    }
}
