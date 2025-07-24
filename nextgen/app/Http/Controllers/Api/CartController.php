<?php

namespace App\Http\Controllers\Api; // Định nghĩa không gian tên (namespace) cho Controller này, giúp tổ chức mã nguồn theo cấu trúc thư mục

use App\Http\Controllers\Controller; // Nhập (import) lớp Controller cơ bản của Laravel mà CartController sẽ kế thừa
use Illuminate\Http\Request; // Nhập lớp Request để có thể nhận và xử lý dữ liệu từ các yêu cầu HTTP đến
use App\Models\ProductVariant; // Nhập ProductVariant Model để tương tác với bảng 'product_variants' trong cơ sở dữ liệu
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
    public function destroy(string $id)
    {
        // Hiện tại không có logic nào được triển khai ở đây, phương thức này để trống
    }

    /**
     * Thêm sản phẩm vào giỏ hàng.
     * Phương thức này xử lý các yêu cầu POST đến '/api/cart/add'.
     *
     * @param  \Illuminate\Http\Request  $request Đối tượng Request chứa dữ liệu gửi lên từ client
     * @return \Illuminate\Http\JsonResponse Trả về một phản hồi JSON cho client
     */
    public function addToCart(Request $request)
    {
        // 1. Xác thực dữ liệu đầu vào từ request
        $request->validate([ // Gọi phương thức validate để kiểm tra các trường dữ liệu
            'ProductVariantID' => 'required|integer|exists:product_variants,ProductVariantID', // Yêu cầu ProductVariantID phải có, là số nguyên, và phải tồn tại trong cột 'ProductVariantID' của bảng 'product_variants'
            'Quantity' => 'required|integer|min:1', // Yêu cầu Quantity phải có, là số nguyên, và có giá trị tối thiểu là 1
        ]);

        // Lấy giá trị ProductVariantID và Quantity từ request
        $productVariantId = $request->input('ProductVariantID'); // Lấy giá trị của trường 'ProductVariantID' từ dữ liệu gửi lên
        $quantity = $request->input('Quantity'); // Lấy giá trị của trường 'Quantity' từ dữ liệu gửi lên

        // 2. Xác định người dùng hiện tại
        $userId = Auth::id(); // Lấy ID của người dùng hiện tại đã đăng nhập. Trả về 'null' nếu không có người dùng nào đăng nhập.

        // 3. Kiểm tra xem biến thể sản phẩm có tồn tại trong cơ sở dữ liệu không
        $productVariant = ProductVariant::find($productVariantId); // Tìm biến thể sản phẩm trong database bằng ProductVariantID

        // Nếu không tìm thấy biến thể sản phẩm (tức là $productVariant là null), trả về lỗi 404 Not Found
        if (!$productVariant) { // Kiểm tra nếu biến thể sản phẩm không tồn tại
            return response()->json(['message' => 'Biến thể sản phẩm không tồn tại.'], 404); // Trả về phản hồi JSON với thông báo lỗi và mã trạng thái 404
        }

        // 4. Xử lý logic thêm hoặc cập nhật sản phẩm trong giỏ hàng
        try { // Bắt đầu khối try-catch để xử lý các lỗi có thể xảy ra trong quá trình thao tác với cơ sở dữ liệu
            // Tìm kiếm một mục giỏ hàng (Cart) hiện có cho người dùng này và biến thể sản phẩm này
            $cartItem = Cart::where('UserID', $userId) // Tìm kiếm trong bảng 'cart' với 'UserID' tương ứng
                                ->where('ProductVariantID', $productVariantId) // Và 'ProductVariantID' tương ứng
                                ->first(); // Lấy bản ghi đầu tiên tìm thấy (nếu có)

            if ($cartItem) { // Nếu tìm thấy một mục giỏ hàng hiện có (sản phẩm đã có trong giỏ)
                $cartItem->Quantity += $quantity; // Cập nhật số lượng bằng cách cộng thêm Quantity mới vào số lượng hiện có
                $cartItem->Update_at = Carbon::now(); // Cập nhật thủ công cột 'Update_at' thành thời gian hiện tại
                $cartItem->save(); // Lưu các thay đổi vào cơ sở dữ liệu
            } else { // Nếu không tìm thấy mục giỏ hàng (sản phẩm chưa có trong giỏ)
                $cartItem = Cart::create([ // Tạo một bản ghi Cart mới trong database
                    'UserID' => $userId, // Gán 'UserID' cho bản ghi mới
                    'ProductVariantID' => $productVariantId, // Gán 'ProductVariantID' cho bản ghi mới
                    'Quantity' => $quantity, // Gán 'Quantity' ban đầu cho bản ghi mới
                    'Create_at' => Carbon::now(), // Gán 'Create_at' thủ công thành thời gian hiện tại
                    'Update_at' => Carbon::now(), // Gán 'Update_at' thủ công thành thời gian hiện tại
                ]);
            }

            // Trả về phản hồi JSON thành công
            return response()->json([ // Trả về một phản hồi JSON
                'message' => 'Sản phẩm đã được thêm vào giỏ hàng thành công.', // Thông báo thành công cho client
                'cart_item' => $cartItem, // Gửi lại thông tin chi tiết về mục giỏ hàng vừa được thêm/cập nhật
                'current_cart_state' => $this->getCartItems($userId) // Gửi trạng thái giỏ hàng hiện tại sau khi thêm/cập nhật (gọi phương thức trợ giúp)
            ], 200); // Mã trạng thái HTTP 200 OK (thành công)

        } catch (\Exception $e) { // Bắt bất kỳ ngoại lệ nào (lỗi) xảy ra trong khối try
            // Bắt và xử lý bất kỳ ngoại lệ nào xảy ra trong quá trình lưu vào database
            return response()->json([ // Trả về một phản hồi JSON lỗi
                'message' => 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.', // Thông báo lỗi chung
                'error' => $e->getMessage() // Trả về thông báo lỗi chi tiết của ngoại lệ (chỉ nên hiển thị trong môi trường phát triển để debug)
            ], 500); // Mã trạng thái HTTP 500 Internal Server Error (lỗi server nội bộ)
        }
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
        // Lấy ID của người dùng hiện tại
        $userId = Auth::id(); // Lấy ID của người dùng đã đăng nhập

        // Nếu không có người dùng đăng nhập, trả về lỗi 401 Unauthorized
        if (!$userId) { // Kiểm tra nếu UserID là null (không có người dùng đăng nhập)
            return response()->json(['message' => 'Vui lòng đăng nhập để xem giỏ hàng của bạn.'], 401); // Trả về lỗi 401 với thông báo yêu cầu đăng nhập
        }

        // Lấy tất cả các mục trong giỏ hàng của người dùng
        $cartItems = $this->getCartItems($userId); // Gọi phương thức trợ giúp 'getCartItems' để lấy danh sách các mục trong giỏ hàng

        // Trả về phản hồi JSON chứa danh sách các mục trong giỏ hàng
        return response()->json([ // Trả về một phản hồi JSON
            'message' => 'Giỏ hàng của bạn:', // Thông báo cho client
            'cart_items' => $cartItems // Danh sách các mục trong giỏ hàng
        ], 200); // Mã trạng thái HTTP 200 OK
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
        $request->validate([ // Xác thực dữ liệu đầu vào
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID', // ProductVariantID phải có, là số nguyên, và tồn tại
            'Quantity' => 'required|integer|min:0', // Quantity phải có, là số nguyên, và tối thiểu là 0 (để cho phép xóa mục nếu Quantity là 0)
        ]);

        $productVariantId = $request->input('ProductVariantID'); // Lấy ProductVariantID từ request
        $quantity = $request->input('Quantity'); // Lấy Quantity từ request
        $userId = Auth::id(); // Lấy UserID của người dùng hiện tại

        if (!$userId) { // Kiểm tra đăng nhập
            return response()->json(['message' => 'Vui lòng đăng nhập để cập nhật giỏ hàng.'], 401); // Trả về lỗi 401
        }

        $cartItem = Cart::where('UserID', $userId) // Tìm mục giỏ hàng của người dùng
                            ->where('ProductVariantID', $productVariantId) // Với ProductVariantID cụ thể
                            ->first(); // Lấy bản ghi đầu tiên

        if (!$cartItem) { // Nếu không tìm thấy mục giỏ hàng (sản phẩm không có trong giỏ)
            return response()->json(['message' => 'Sản phẩm không có trong giỏ hàng.'], 404); // Trả về lỗi 404
        }

        if ($quantity === 0) { // Nếu số lượng được yêu cầu là 0
            $cartItem->delete(); // Xóa mục giỏ hàng khỏi database
            $message = 'Sản phẩm đã được xóa khỏi giỏ hàng.'; // Đặt thông báo thành công
        } else { // Nếu số lượng lớn hơn 0
            $cartItem->Quantity = $quantity; // Cập nhật số lượng mới cho mục giỏ hàng
            $cartItem->Update_at = Carbon::now(); // Cập nhật thủ công cột 'Update_at'
            $cartItem->save(); // Lưu các thay đổi vào database
            $message = 'Số lượng sản phẩm đã được cập nhật.'; // Đặt thông báo thành công
        }

        return response()->json([ // Trả về phản hồi JSON
            'message' => $message, // Thông báo kết quả của thao tác
            'cart_item' => $cartItem, // Thông tin chi tiết về mục giỏ hàng (nếu không bị xóa)
            'current_cart_state' => $this->getCartItems($userId) // Trạng thái giỏ hàng hiện tại sau khi cập nhật
        ], 200); // Mã trạng thái HTTP 200 OK
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
        $request->validate([ // Xác thực dữ liệu đầu vào
            'ProductVariantID' => 'required|integer|exists:productvariants,ProductVariantID', // ProductVariantID phải có, là số nguyên, và tồn tại
        ]);

        $productVariantId = $request->input('ProductVariantID'); // Lấy ProductVariantID từ request
        $userId = Auth::id(); // Lấy UserID của người dùng hiện tại

        if (!$userId) { // Kiểm tra đăng nhập
            return response()->json(['message' => 'Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng.'], 401); // Trả về lỗi 401
        }

        $cartItem = Cart::where('UserID', $userId) // Tìm mục giỏ hàng của người dùng
                            ->where('ProductVariantID', $productVariantId) // Với ProductVariantID cụ thể
                            ->first(); // Lấy bản ghi đầu tiên

        if (!$cartItem) { // Nếu không tìm thấy mục giỏ hàng
            return response()->json(['message' => 'Sản phẩm không có trong giỏ hàng.'], 404); // Trả về lỗi 404
        }

        $cartItem->delete(); // Xóa mục giỏ hàng khỏi database

        return response()->json([ // Trả về phản hồi JSON
            'message' => 'Sản phẩm đã được xóa khỏi giỏ hàng thành công.', // Thông báo thành công
            'current_cart_state' => $this->getCartItems($userId) // Trạng thái giỏ hàng hiện tại sau khi xóa
        ], 200); // Mã trạng thái HTTP 200 OK
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
        $userId = Auth::id(); // Lấy UserID của người dùng hiện tại

        if (!$userId) { // Kiểm tra đăng nhập
            return response()->json(['message' => 'Vui lòng đăng nhập để xóa giỏ hàng.'], 401); // Trả về lỗi 401
        }

        Cart::where('UserID', $userId)->delete(); // Xóa tất cả các mục giỏ hàng trong database có UserID tương ứng

        return response()->json([ // Trả về phản hồi JSON
            'message' => 'Giỏ hàng đã được xóa thành công.', // Thông báo thành công
            'current_cart_state' => [] // Giỏ hàng rỗng sau khi xóa
        ], 200); // Mã trạng thái HTTP 200 OK
    }
}
