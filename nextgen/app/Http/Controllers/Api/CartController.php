<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductVariant; // Import ProductVariant Model
use App\Models\Cart; // Import Cart Model (đại diện cho giỏ hàng chính của người dùng)
use App\Models\CartItem; // Giả định bạn có một model CartItem cho từng sản phẩm trong giỏ hàng
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log; // Import Log facade để debug

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     * Không sử dụng trong trường hợp này vì chúng ta có viewCart cụ thể.
     */
    public function index()
    {
        // Để trống
    }

    /**
     * Store a newly created resource in storage.
     * Không sử dụng trong trường hợp này vì chúng ta có addToCart cụ thể.
     */
    public function store(Request $request)
    {
        // Để trống
    }

    /**
     * Display the specified resource.
     * Không sử dụng trong trường hợp này.
     */
    public function show(string $id)
    {
        // Để trống
    }

    /**
     * Update the specified resource in storage.
     * Không sử dụng trong trường hợp này vì chúng ta có updateCartItem cụ thể.
     */
    public function update(Request $request, string $id)
    {
        // Để trống
    }

    /**
     * Remove the specified resource from storage.
     * Không sử dụng trong trường hợp này vì chúng ta có removeFromCart cụ thể.
     */
    public function destroy(string $id)
    {
        // Để trống
    }

    /**
     * Thêm sản phẩm vào giỏ hàng hoặc cập nhật số lượng nếu đã tồn tại.
     * Xử lý POST request đến '/api/carts' (theo routes/api.php của bạn).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addToCart(Request $request)
    {
        try {
            $request->validate([
                'ProductVariantID' => 'required|integer|exists:product_variants,ProductVariantID', // Đảm bảo tên bảng và cột chính xác
                'Quantity' => 'required|integer|min:1',
            ]);

            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['message' => 'Vui lòng đăng nhập.'], 401);
            }

            // Tìm giỏ hàng chính của user, nếu chưa có thì tạo mới
            // Giả định bảng 'carts' chỉ chứa 1 record cho mỗi UserID
            $cart = Cart::firstOrCreate(['UserID' => $userId]);

            // Tìm mục sản phẩm trong giỏ hàng (trong bảng cart_items)
            // Giả định Cart model có quan hệ 'items()' trỏ đến CartItem model
            $cartItem = $cart->items()->where('ProductVariantID', $request->ProductVariantID)->first();

            if ($cartItem) {
                $cartItem->Quantity += $request->Quantity;
                // Nếu bạn đã cấu hình UPDATED_AT trong CartItem model, không cần gán thủ công
                // $cartItem->Update_at = now();
                $cartItem->save();
            } else {
                // Tạo mục giỏ hàng mới trong bảng cart_items
                $cartItem = $cart->items()->create([
                    'ProductVariantID' => $request->ProductVariantID,
                    'Quantity' => $request->Quantity,
                    // Nếu bạn đã cấu hình CREATED_AT/UPDATED_AT trong CartItem model, không cần gán thủ công
                    // 'Create_at' => now(),
                    // 'Update_at' => now(),
                ]);
            }

            // Trả về toàn bộ giỏ hàng với các quan hệ được tải
            $updatedCartItems = $cart->items()->with('productVariant.product')->get();

            return response()->json([
                'message' => 'Sản phẩm đã được thêm vào giỏ hàng.',
                'cart_item' => $cartItem, // Trả về mục vừa thêm/cập nhật
                'cart_items' => $updatedCartItems // Trả về toàn bộ giỏ hàng đã cập nhật
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in addToCart:', ['errors' => $e->errors()]);
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error in addToCart: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.'], 500);
        }
    }

    /**
     * Hiển thị nội dung giỏ hàng của người dùng hiện tại.
     * Xử lý GET request đến '/api/carts' (theo routes/api.php của bạn).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function viewCart(Request $request)
    {
        try {
            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['message' => 'Vui lòng đăng nhập để xem giỏ hàng.'], 401);
            }

            $cart = Cart::where('UserID', $userId)->first();

            // Nếu không tìm thấy giỏ hàng chính, trả về mảng rỗng
            $cartItems = $cart
                ? $cart->items()->with('productVariant.product')->get()
                : collect([]); // Sử dụng collect([]) thay vì [] để nhất quán

            return response()->json([
                'cart_items' => $cartItems
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error in viewCart: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Có lỗi xảy ra khi tải giỏ hàng từ server.'], 500);
        }
    }

    /**
     * Cập nhật số lượng của một sản phẩm trong giỏ hàng.
     * Xử lý PUT request đến '/api/carts' (theo routes/api.php của bạn).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCartItem(Request $request)
    {
        try {
            $request->validate([
                'ProductVariantID' => 'required|integer|exists:product_variants,ProductVariantID',
                'Quantity' => 'required|integer|min:0', // Cho phép Quantity = 0 để xóa sản phẩm
            ]);

            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['message' => 'Vui lòng đăng nhập để cập nhật giỏ hàng.'], 401);
            }

            $cart = Cart::where('UserID', $userId)->first();
            if (!$cart) {
                return response()->json(['message' => 'Giỏ hàng không tồn tại.'], 404);
            }

            $cartItem = $cart->items()->where('ProductVariantID', $request->ProductVariantID)->first();
            if (!$cartItem) {
                return response()->json(['message' => 'Sản phẩm không có trong giỏ hàng.'], 404);
            }

            if ($request->Quantity == 0) {
                $cartItem->delete();
                $message = 'Sản phẩm đã được xóa khỏi giỏ hàng.';
            } else {
                $cartItem->Quantity = $request->Quantity;
                // Nếu bạn đã cấu hình UPDATED_AT trong CartItem model, không cần gán thủ công
                // $cartItem->Update_at = now();
                $cartItem->save();
                $message = 'Số lượng sản phẩm đã được cập nhật.';
            }

            // Trả về toàn bộ giỏ hàng với các quan hệ được tải
            $updatedCartItems = $cart->items()->with('productVariant.product')->get();

            return response()->json([
                'message' => $message,
                'cart_items' => $updatedCartItems
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in updateCartItem:', ['errors' => $e->errors()]);
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error in updateCartItem: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Có lỗi xảy ra khi cập nhật sản phẩm.'], 500);
        }
    }

    /**
     * Xóa một sản phẩm khỏi giỏ hàng.
     * Xử lý DELETE request đến '/api/carts/item' (theo routes/api.php của bạn).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeFromCart(Request $request)
    {
        try {
            $request->validate([
                'ProductVariantID' => 'required|integer|exists:product_variants,ProductVariantID',
            ]);

            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['message' => 'Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng.'], 401);
            }

            $cart = Cart::where('UserID', $userId)->first();
            if (!$cart) {
                return response()->json(['message' => 'Giỏ hàng không tồn tại.'], 404);
            }

            $cartItem = $cart->items()->where('ProductVariantID', $request->ProductVariantID)->first();
            if (!$cartItem) {
                return response()->json(['message' => 'Sản phẩm không có trong giỏ hàng.'], 404);
            }

            $cartItem->delete();

            // Trả về toàn bộ giỏ hàng với các quan hệ được tải
            $updatedCartItems = $cart->items()->with('productVariant.product')->get();

            return response()->json([
                'message' => 'Sản phẩm đã được xóa khỏi giỏ hàng.',
                'cart_items' => $updatedCartItems
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in removeFromCart:', ['errors' => $e->errors()]);
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error in removeFromCart: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng.'], 500);
        }
    }

    /**
     * Xóa toàn bộ giỏ hàng của người dùng.
     * Xử lý DELETE request đến '/api/carts' (theo routes/api.php của bạn).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearCart(Request $request)
    {
        try {
            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['message' => 'Vui lòng đăng nhập để xóa giỏ hàng.'], 401);
            }

            $cart = Cart::where('UserID', $userId)->first();
            if ($cart) {
                $cart->items()->delete(); // Xóa tất cả các mục trong giỏ hàng này
            }

            return response()->json([
                'message' => 'Giỏ hàng đã được xóa thành công.',
                'cart_items' => [] // Trả về mảng rỗng sau khi xóa
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error in clearCart: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Có lỗi xảy ra khi xóa toàn bộ giỏ hàng.'], 500);
        }
    }

    /**
     * Phương thức trợ giúp để lấy các mục trong giỏ hàng của một người dùng cụ thể.
     * Phương thức này không được sử dụng trong các phương thức công khai của controller này
     * và có thể gây nhầm lẫn về việc nó trả về đối tượng Cart hay CartItem.
     * Khuyến nghị: có thể xóa hoặc đổi tên/sửa đổi để trả về CartItem Collection.
     */
    // protected function getCartItems($userId)
    // {
    //     if ($userId === null) {
    //         return collect();
    //     }
    //     return Cart::where('UserID', $userId)
    //                     ->with('productVariant')
    //                     ->get();
    // }
}
