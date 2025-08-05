<?php

namespace App\Http\Controllers\Api; // Định nghĩa không gian tên (namespace) cho Controller này, giúp tổ chức mã nguồn theo cấu trúc thư mục

use App\Http\Controllers\Controller; // Nhập (import) lớp Controller cơ bản của Laravel mà CartController sẽ kế thừa
use Illuminate\Http\Request; // Nhập lớp Request để có thể nhận và xử lý dữ liệu từ các yêu cầu HTTP đến
use App\Models\ProductVariant; // Nhập ProductVariant Model để tương tác với bảng 'productvariants' trong cơ sở dữ liệu
use App\Models\Cart; // Nhập Cart Model để tương tác với bảng 'cart' trong cơ sở dữ liệu (đã đồng bộ với cấu trúc bạn cung cấp)
use Illuminate\Support\Facades\Auth; // Nhập Facade Auth để truy cập các phương thức liên quan đến xác thực người dùng (ví dụ: lấy ID người dùng)
use Carbon\Carbon; // Nhập lớp Carbon để làm việc với thời gian, dùng cho các cột timestamps được quản lý thủ công

class CartController extends Controller // Khai báo lớp CartController, kế thừa các chức năng cơ bản từ lớp Controller
{
    /**
     * Display a listing of the resource.
     * Phương thức này thường được sử dụng để hiển thị danh sách tất cả các tài nguyên.
     * Trong ngữ cảnh của giỏ hàng API, nó ít khi được dùng để hiển thị tất cả giỏ hàng của mọi người dùng.
     */
    public function index()
    {
        // Hiện tại không có logic nào được triển khai ở đây, phương thức này để trống theo cấu trúc resource chuẩn
    }

    /**
     * Store a newly created resource in storage.
     * Phương thức này thường được sử dụng để lưu trữ một tài nguyên mới vào cơ sở dữ liệu.
     * Với giỏ hàng, chức năng 'addToCart' thường đảm nhiệm vai trò này một cách cụ thể hơn.
     */
    public function store(Request $request)
    {
        // Hiện tại không có logic nào được triển khai ở đây, phương thức này để trống
    }

    /**
     * Display the specified resource.
     * Phương thức này thường được sử dụng để hiển thị một tài nguyên cụ thể dựa trên ID.
     * Trong ngữ cảnh giỏ hàng, ít khi dùng để hiển thị một giỏ hàng cụ thể của một người dùng khác.
     */
    public function show(string $id)
    {
        // Hiện tại không có logic nào được triển khai ở đây, phương thức này để trống
    }

    /**
     * Update the specified resource in storage.
     * Phương thức này thường được sử dụng để cập nhật một tài nguyên cụ thể trong cơ sở dữ liệu.
     * Với giỏ hàng, chức năng 'updateCartItem' thường được sử dụng để cập nhật số lượng sản phẩm.
     */
    public function update(Request $request, string $id)
    {
        // Hiện tại không có logic nào được triển khai ở đây, phương thức này để trống
    }

    /**
     * Remove the specified resource from storage.
     * Phương thức này thường được sử dụng để xóa một tài nguyên cụ thể khỏi cơ sở dữ liệu.
     * Với giỏ hàng, chức năng 'removeFromCart' thường được sử dụng để xóa một sản phẩm cụ thể.
     */


    /**
     * Thêm sản phẩm vào giỏ hàng.
     * Phương thức này xử lý các yêu cầu POST đến '/api/cart/add'.
     *
     * @param  \Illuminate\Http\Request  $request Đối tượng Request chứa dữ liệu gửi lên từ client
     * @return \Illuminate\Http\JsonResponse Trả về một phản hồi JSON cho client
     */
    public function addToCart(Request $request)
    {
        $request->validate([
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
            'Quantity' => 'required|integer|min:1',
        ]);

        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Vui lòng đăng nhập.'], 401);
        }

        // Tìm giỏ hàng của user, nếu chưa có thì tạo mới
        $cart = Cart::firstOrCreate(['UserID' => $userId], [
            'Status' => 'active',
            'Create_at' => now(),
            'Update_at' => now(),
        ]);

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        $cartItem = $cart->items()->where('ProductVariantID', $request->ProductVariantID)->first();

        if ($cartItem) {
            $cartItem->Quantity += $request->Quantity;
            $cartItem->Update_at = now();
            $cartItem->save();
        } else {
            $cartItem = $cart->items()->create([
                'ProductVariantID' => $request->ProductVariantID,
                'Quantity' => $request->Quantity,
                'Create_at' => now(),
                'Update_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Sản phẩm đã được thêm vào giỏ hàng.',
            'cart_item' => $cartItem,
            'cart_items' => $cart->items()->with('productVariant')->get()
        ], 200);
    }

    /**
     * Hiển thị nội dung giỏ hàng của người dùng hiện tại.
     * Phương thức này xử lý các yêu cầu GET đến '/api/cart/view'.
     *
     * @param  \Illuminate\Http\Request  $request Đối tượng Request (ít được sử dụng trực tiếp cho GET này)
     * @return \Illuminate\Http\JsonResponse Trả về một phản hồi JSON
     */
    public function viewCart(Request $request)
    {
        $userId = Auth::id();
        $cart = Cart::where('UserID', $userId)->first();
        $cartItems = $cart
            ? $cart->items()->with('productVariant.product')->get()
            : [];

        return response()->json([
            'cart_items' => $cartItems
        ], 200);
    }

    /**
     * Phương thức trợ giúp để lấy các mục trong giỏ hàng của một người dùng cụ thể.
     * Phương thức này được sử dụng nội bộ bởi các phương thức khác trong controller để tránh lặp code.
     *
     * @param  int|null  $userId ID của người dùng, hoặc null nếu là khách vãng lai.
     * @return \Illuminate\Database\Eloquent\Collection Trả về một Collection các đối tượng Cart Model
     */
    protected function getCartItems($userId)
    {
        // Nếu userId là null (khách vãng lai) và không có logic cụ thể cho giỏ hàng của khách, trả về một Collection rỗng
        if ($userId === null) { // Kiểm tra nếu UserID là null
            return collect(); // Trả về một Collection rỗng của Laravel
        }

        // Lấy các mục trong giỏ hàng của người dùng, đồng thời tải thông tin biến thể sản phẩm liên quan
        return Cart::where('UserID', $userId) // Tìm kiếm các bản ghi trong bảng 'cart' với 'UserID' tương ứng
                       ->with('productVariant') // Tải mối quan hệ 'productVariant' đã được định nghĩa trong Cart Model (để lấy thông tin chi tiết của biến thể sản phẩm)
                       ->get(); // Lấy tất cả các bản ghi tìm thấy dưới dạng Collection
    }

    /**
     * Cập nhật số lượng của một sản phẩm trong giỏ hàng.
     * Phương thức này xử lý các yêu cầu PUT đến '/api/cart/update'.
     *
     * @param  \Illuminate\Http\Request  $request Đối tượng Request chứa dữ liệu gửi lên
     * @return \Illuminate\Http\JsonResponse Trả về một phản hồi JSON
     */
    public function updateCartItem(Request $request)
    {
        $request->validate([
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
            'Quantity' => 'required|integer|min:0',
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
            $cartItem->Update_at = now();
            $cartItem->save();
            $message = 'Số lượng sản phẩm đã được cập nhật.';
        }

        return response()->json([
            'message' => $message,
            'cart_items' => $cart->items()->with('productVariant')->get()
        ], 200);
    }

    /**
     * Xóa một sản phẩm khỏi giỏ hàng.
     * Phương thức này xử lý các yêu cầu DELETE đến '/api/cart/remove'.
     *
     * @param  \Illuminate\Http\Request  $request Đối tượng Request chứa dữ liệu gửi lên
     * @return \Illuminate\Http\JsonResponse Trả về một phản hồi JSON
     */
    public function removeFromCart(Request $request)
    {
        $request->validate([
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID',
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

        return response()->json([
            'message' => 'Sản phẩm đã được xóa khỏi giỏ hàng.',
            'cart_items' => $cart->items()->with('productVariant')->get()
        ], 200);
    }

    /**
     * Xóa toàn bộ giỏ hàng của người dùng.
     * Phương thức này xử lý các yêu cầu POST đến '/api/cart/clear'.
     *
     * @param  \Illuminate\Http\Request  $request Đối tượng Request (ít được sử dụng trực tiếp cho POST này)
     * @return \Illuminate\Http\JsonResponse Trả về một phản hồi JSON
     */
    public function clearCart(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Vui lòng đăng nhập để xóa giỏ hàng.'], 401);
        }

        // Lấy giỏ hàng của người dùng
        $cart = Cart::where('UserID', $userId)->first();
        if ($cart) {
            // Lấy tất cả CartItem có CartID tương ứng
            $cartItems = $cart->items()->where('CartID', $cart->id)->get();

            // Xóa từng CartItem
            foreach ($cartItems as $cartItem) {
                $cartItem->delete();
            }
        }

        return response()->json([
            'message' => 'Giỏ hàng đã được xóa thành công.',
            'cart_items' => []
        ], 200);
    }
}
