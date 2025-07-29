<?php

namespace App\Http\Controllers\Api; // Định nghĩa không gian tên (namespace) cho Controller này

use App\Http\Controllers\Controller; // Nhập lớp Controller cơ bản của Laravel
use Illuminate\Http\Request; // Nhập lớp Request để xử lý các yêu cầu HTTP
use App\Models\ProductVariant; // Nhập ProductVariant Model
use App\Models\Cart; // LƯU Ý QUAN TRỌNG: Model này được giả định là đại diện cho BẢNG 'cart_items'
// use App\Models\CartItem; // Nếu bạn có một Model riêng cho CartItem (ví dụ: mapping tới bảng cart_items), hãy dùng nó thay vì Cart ở trên.
use Illuminate\Support\Facades\Auth; // Nhập Facade Auth để lấy ID người dùng
use Carbon\Carbon; // Nhập lớp Carbon để làm việc với thời gian
use Illuminate\Support\Facades\Log; // Import Log facade để debug

class CartController extends Controller // Khai báo lớp CartController
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
     * @param  \Illuminate\Http\Request  $request Đối tượng Request chứa dữ liệu gửi lên từ client
     * @return \Illuminate\Http\JsonResponse Trả về một phản hồi JSON cho client
     */
    public function addToCart(Request $request)
    {
        try {
            // Xác thực dữ liệu đầu vào
            $request->validate([
                // Đảm bảo tên bảng là 'product_variants' (snake_case) nếu đó là tên thực tế trong DB
                'ProductVariantID' => 'required|integer|exists:product_variants,ProductVariantID',
                'Quantity' => 'required|integer|min:1',
            ]);

            $userId = Auth::id();
            if (!$userId) {
                Log::warning('addToCart: Unauthorized attempt to add to cart.');
                return response()->json(['message' => 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.'], 401);
            }

            $productVariantId = $request->input('ProductVariantID');
            $quantity = $request->input('Quantity');

            // Tìm kiếm mục giỏ hàng hiện có cho người dùng và biến thể sản phẩm này
            // Giả định Model Cart đang map tới bảng 'cart_items'
            $cartItem = Cart::where('UserID', $userId)
                             ->where('ProductVariantID', $productVariantId)
                             ->first();

            if ($cartItem) {
                // Nếu mục đã tồn tại, cập nhật số lượng
                $cartItem->Quantity += $quantity;
                // Nếu bạn đã cấu hình UPDATED_AT trong Cart model, không cần gán thủ công Carbon::now()
                // $cartItem->Update_at = Carbon::now();
                $cartItem->save();
                Log::info('addToCart: Updated existing cart item.', ['user_id' => $userId, 'product_variant_id' => $productVariantId, 'new_quantity' => $cartItem->Quantity]);
            } else {
                // Nếu mục chưa tồn tại, tạo mới
                $cartItem = Cart::create([
                    'UserID' => $userId,
                    'ProductVariantID' => $productVariantId,
                    'Quantity' => $quantity,
                    // Nếu bạn đã cấu hình CREATED_AT/UPDATED_AT trong Cart model, không cần gán thủ công Carbon::now()
                    // 'Create_at' => Carbon::now(),
                    // 'Update_at' => Carbon::now(),
                ]);
                Log::info('addToCart: Created new cart item.', ['user_id' => $userId, 'product_variant_id' => $productVariantId, 'quantity' => $quantity]);
            }

            // Trả về toàn bộ giỏ hàng với các quan hệ được tải để frontend cập nhật
            $updatedCartItems = $this->getCartItemsForApi($userId);

            return response()->json([
                'message' => 'Sản phẩm đã được thêm vào giỏ hàng thành công.',
                'cart_item' => $cartItem->load(['productVariant.product', 'productVariant.attributes.attribute']), // Tải lại mục vừa thêm/cập nhật
                'cart_items' => $updatedCartItems // Trả về toàn bộ giỏ hàng đã cập nhật
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in addToCart:', ['errors' => $e->errors(), 'request_data' => $request->all()]);
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error in addToCart: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
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
                Log::warning('viewCart: Unauthorized attempt to view cart.');
                return response()->json(['message' => 'Vui lòng đăng nhập để xem giỏ hàng của bạn.'], 401);
            }

            // Lấy tất cả các mục trong giỏ hàng của người dùng
            // Giả định Model Cart đang map tới bảng 'cart_items'
            $cartItems = Cart::where('UserID', $userId)
                             ->with(['productVariant.product', 'productVariant.attributes.attribute'])
                             ->get();

            Log::info('viewCart: Successfully fetched cart items.', ['user_id' => $userId, 'item_count' => $cartItems->count()]);
            return response()->json([
                'message' => 'Giỏ hàng của bạn:',
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
                'ProductVariantID' => 'required|integer|exists:product_variants,ProductVariantID', // Đảm bảo tên bảng và cột chính xác
                'Quantity' => 'required|integer|min:0', // Cho phép Quantity = 0 để xóa sản phẩm
            ]);

            $userId = Auth::id();
            if (!$userId) {
                Log::warning('updateCartItem: Unauthorized attempt to update cart.');
                return response()->json(['message' => 'Vui lòng đăng nhập để cập nhật giỏ hàng.'], 401);
            }

            $productVariantId = $request->input('ProductVariantID');
            $quantity = $request->input('Quantity');

            // Tìm mục giỏ hàng cần cập nhật
            // Giả định Model Cart đang map tới bảng 'cart_items'
            $cartItem = Cart::where('UserID', $userId)
                             ->where('ProductVariantID', $productVariantId)
                             ->first();

            if (!$cartItem) {
                Log::warning('updateCartItem: Cart item not found for update.', ['user_id' => $userId, 'product_variant_id' => $productVariantId]);
                return response()->json(['message' => 'Sản phẩm không có trong giỏ hàng.'], 404);
            }

            if ($quantity === 0) {
                // Nếu số lượng là 0, xóa mục khỏi giỏ hàng
                $cartItem->delete();
                $message = 'Sản phẩm đã được xóa khỏi giỏ hàng.';
                Log::info('updateCartItem: Removed item due to quantity 0.', ['user_id' => $userId, 'product_variant_id' => $productVariantId]);
            } else {
                // Cập nhật số lượng
                $cartItem->Quantity = $quantity;
                // Nếu bạn đã cấu hình UPDATED_AT trong Cart model, không cần gán thủ công Carbon::now()
                // $cartItem->Update_at = Carbon::now();
                $cartItem->save();
                $message = 'Số lượng sản phẩm đã được cập nhật.';
                Log::info('updateCartItem: Updated item quantity.', ['user_id' => $userId, 'product_variant_id' => $productVariantId, 'new_quantity' => $quantity]);
            }

            // Trả về toàn bộ giỏ hàng với các quan hệ được tải
            $updatedCartItems = $this->getCartItemsForApi($userId);

            return response()->json([
                'message' => $message,
                'cart_items' => $updatedCartItems
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in updateCartItem:', ['errors' => $e->errors(), 'request_data' => $request->all()]);
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error in updateCartItem: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
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
                'ProductVariantID' => 'required|integer|exists:product_variants,ProductVariantID', // Đảm bảo tên bảng và cột chính xác
            ]);

            $userId = Auth::id();
            if (!$userId) {
                Log::warning('removeFromCart: Unauthorized attempt to remove item.');
                return response()->json(['message' => 'Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng.'], 401);
            }

            $productVariantId = $request->input('ProductVariantID');

            // Tìm mục giỏ hàng cần xóa
            // Giả định Model Cart đang map tới bảng 'cart_items'
            $cartItem = Cart::where('UserID', $userId)
                             ->where('ProductVariantID', $productVariantId)
                             ->first();

            if (!$cartItem) {
                Log::warning('removeFromCart: Cart item not found for removal.', ['user_id' => $userId, 'product_variant_id' => $productVariantId]);
                return response()->json(['message' => 'Sản phẩm không có trong giỏ hàng.'], 404);
            }

            $cartItem->delete();
            Log::info('removeFromCart: Successfully removed cart item.', ['user_id' => $userId, 'product_variant_id' => $productVariantId]);

            // Trả về toàn bộ giỏ hàng với các quan hệ được tải
            $updatedCartItems = $this->getCartItemsForApi($userId);

            return response()->json([
                'message' => 'Sản phẩm đã được xóa khỏi giỏ hàng thành công.',
                'cart_items' => $updatedCartItems
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in removeFromCart:', ['errors' => $e->errors(), 'request_data' => $request->all()]);
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error in removeFromCart: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
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
                Log::warning('clearCart: Unauthorized attempt to clear cart.');
                return response()->json(['message' => 'Vui lòng đăng nhập để xóa giỏ hàng.'], 401);
            }

            // Xóa tất cả các mục trong giỏ hàng của người dùng
            // Giả định Model Cart đang map tới bảng 'cart_items'
            Cart::where('UserID', $userId)->delete();
            Log::info('clearCart: Successfully cleared cart.', ['user_id' => $userId]);

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
     * Phương thức trợ giúp để lấy các mục trong giỏ hàng của một người dùng cụ thể
     * với tất cả các mối quan hệ cần thiết cho API frontend.
     *
     * @param  int|null  $userId ID của người dùng.
     * @return \Illuminate\Database\Eloquent\Collection Trả về một Collection các đối tượng Cart (CartItem) Model
     */
    protected function getCartItemsForApi($userId)
    {
        if ($userId === null) {
            return collect(); // Trả về Collection rỗng nếu không có UserID
        }

        // Giả định Model Cart đang map tới bảng 'cart_items'
        return Cart::where('UserID', $userId)
                   ->with(['productVariant.product', 'productVariant.attributes.attribute'])
                   ->get();
    }
}
