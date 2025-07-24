<?php

namespace App\Http\Controllers\Api; // Đã thay đổi namespace thành Api

use App\Http\Controllers\Controller;
use App\Models\Order; // Import Order Model
use App\Models\User; // Import User Model (có thể cần cho show/edit nếu eager load)
use App\Models\Voucher; // Import Voucher Model (có thể cần cho show/edit nếu eager load)
use App\Models\PaymentGateway; // Import PaymentGateway Model (có thể cần cho show/edit nếu eager load)
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException; // Import ValidationException để bắt lỗi xác thực

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     * Hiển thị danh sách các đơn hàng dưới dạng JSON.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            // Lấy tất cả đơn hàng và phân trang, eager load các model liên quan
            $perPage = $request->query('per_page', 10);
            $orders = Order::with(['user', 'voucher', 'paymentGateway'])->paginate($perPage);

            // Trả về dữ liệu đơn hàng dưới dạng JSON
            return response()->json($orders, 200);
        } catch (\Exception $e) {
            // Xử lý các lỗi không mong muốn
            return response()->json(['message' => 'Error fetching orders.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     * Phương thức này không cần thiết cho API. Frontend (ReactJS) sẽ tự tạo form.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function create()
    {
        // Trả về 404 hoặc thông báo rằng endpoint này không dùng cho API form
        return response()->json(['message' => 'Endpoint này không được sử dụng để hiển thị form tạo đơn hàng cho API.'], 404);
    }

    /**
     * Store a newly created resource in storage.
     * Lưu đơn hàng mới vào cơ sở dữ liệu và trả về JSON.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'InvoiceCode' => 'required|string|max:50|unique:orders,InvoiceCode',
                'UserID' => 'required|exists:users,UserID',
                'VoucherID' => 'nullable|exists:vouchers,VoucherID', // Cẩn thận tên bảng: 'vouchers' thay vì 'voucher'
                'PaymentID' => 'nullable|exists:payment_gateways,PaymentID', // Cẩn thận tên bảng: 'payment_gateways' thay vì 'payment_gateway'
                'Status' => 'required|string|max:255', // Bạn nên định nghĩa các trạng thái cụ thể (ex: 'pending', 'processing', 'completed', 'cancelled')
                'Total_amount' => 'required|numeric|min:0',
                'Receiver_name' => 'required|string|max:255',
                'Receiver_phone' => 'required|string|max:255',
                'Shipping_address' => 'required|string',
            ]);

            $order = Order::create([
                'InvoiceCode' => $validatedData['InvoiceCode'],
                'UserID' => $validatedData['UserID'],
                'VoucherID' => $validatedData['VoucherID'],
                'PaymentID' => $validatedData['PaymentID'],
                'Status' => $validatedData['Status'],
                'Total_amount' => $validatedData['Total_amount'],
                'Receiver_name' => $validatedData['Receiver_name'],
                'Receiver_phone' => $validatedData['Receiver_phone'],
                'Shipping_address' => $validatedData['Shipping_address'],
                // Laravel tự động quản lý `created_at` và `updated_at`
                // Nếu tên cột của bạn là 'Create_at' và 'Update_at', bạn cần cấu hình trong Order Model
                // 'Create_at' => now(),
                // 'Update_at' => now(),
            ]);

            return response()->json([
                'message' => 'Đơn hàng đã được tạo thành công.',
                'order' => $order
            ], 201); // 201 Created

        } catch (ValidationException $e) {
            // Xử lý lỗi xác thực
            return response()->json(['message' => 'Dữ liệu đầu vào không hợp lệ.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Xử lý các lỗi không mong muốn khác
            return response()->json(['message' => 'Đã xảy ra lỗi khi tạo đơn hàng.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     * Hiển thị chi tiết đơn hàng dưới dạng JSON.
     *
     * @param  \App\Models\Order  $order (Sử dụng Route Model Binding)
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Order $order)
    {
        try {
            // Eager load order details and product variants for detailed view
            $order->load(['user', 'voucher', 'paymentGateway', 'orderDetails.productVariant.product']);
            return response()->json($order, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching order details.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     * Tương tự như `create`, phương thức này không cần thiết cho API.
     * Frontend (ReactJS) sẽ lấy dữ liệu bằng `show` và tự hiển thị form chỉnh sửa.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit(Order $order)
    {
        // Trả về 404 hoặc thông báo rằng endpoint này không dùng cho API form
        return response()->json(['message' => 'Endpoint này không được sử dụng để hiển thị form chỉnh sửa đơn hàng cho API. Hãy sử dụng GET /api/orders/{id} để lấy dữ liệu.'], 404);
    }

    /**
     * Update the specified resource in storage.
     * Cập nhật đơn hàng đã cho trong cơ sở dữ liệu và trả về JSON.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order (Sử dụng Route Model Binding)
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Order $order)
    {
        try {
            $validatedData = $request->validate([
                'InvoiceCode' => ['required', 'string', 'max:50', Rule::unique('orders', 'InvoiceCode')->ignore($order->OrderID, 'OrderID')],
                'UserID' => 'required|exists:users,UserID',
                'VoucherID' => 'nullable|exists:vouchers,VoucherID', // Cẩn thận tên bảng
                'PaymentID' => 'nullable|exists:payment_gateways,PaymentID', // Cẩn thận tên bảng
                'Status' => 'required|string|max:255',
                'Total_amount' => 'required|numeric|min:0',
                'Receiver_name' => 'required|string|max:255',
                'Receiver_phone' => 'required|string|max:255',
                'Shipping_address' => 'required|string',
            ]);

            $order->update([
                'InvoiceCode' => $validatedData['InvoiceCode'],
                'UserID' => $validatedData['UserID'],
                'VoucherID' => $validatedData['VoucherID'],
                'PaymentID' => $validatedData['PaymentID'],
                'Status' => $validatedData['Status'],
                'Total_amount' => $validatedData['Total_amount'],
                'Receiver_name' => $validatedData['Receiver_name'],
                'Receiver_phone' => $validatedData['Receiver_phone'],
                'Shipping_address' => $validatedData['Shipping_address'],
                // Laravel tự động quản lý `updated_at`
                // 'Update_at' => now(),
            ]);

            return response()->json([
                'message' => 'Đơn hàng đã được cập nhật thành công.',
                'order' => $order
            ], 200);

        } catch (ValidationException $e) {
            // Xử lý lỗi xác thực
            return response()->json(['message' => 'Dữ liệu đầu vào không hợp lệ.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Xử lý các lỗi không mong muốn khác
            return response()->json(['message' => 'Đã xảy ra lỗi khi cập nhật đơn hàng.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * Xóa đơn hàng đã cho khỏi cơ sở dữ liệu và trả về JSON.
     *
     * @param  \App\Models\Order  $order (Sử dụng Route Model Binding)
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Order $order)
    {
        try {
            // Trước khi xóa một đơn hàng, bạn có thể muốn xóa các chi tiết đơn hàng liên quan.
            // Hoặc thiết lập cascade deletes trong database migration của bạn.
            // Ví dụ: $order->orderDetails()->delete(); // Đảm bảo mối quan hệ orderDetails đã được định nghĩa trong Order Model

            $order->delete();

            return response()->json(['message' => 'Đơn hàng đã được xóa thành công.'], 200); // Hoặc 204 No Content
        } catch (\Exception $e) {
            // Xử lý lỗi trong quá trình xóa (ví dụ: lỗi khóa ngoại)
            return response()->json(['message' => 'Đã xảy ra lỗi khi xóa đơn hàng.', 'error' => $e->getMessage()], 500);
        }
    }
}
