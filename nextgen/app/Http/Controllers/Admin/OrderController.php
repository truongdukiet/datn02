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

// Import các lớp Google API
use Google\Client;
use Google\Service\Sheets;
use Google\Service\Sheets\ValueRange;
// use Google\Service\Sheets\ClearValuesRequest; // Không cần import nếu không dùng clear()

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

    /**
     * Export orders data to Google Sheet.
     * Đẩy dữ liệu đơn hàng hiện có lên Google Sheet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportOrdersToSheet(Request $request)
    {
        try {
            // 1. Khởi tạo Google Client với thông tin xác thực Service Account
            $client = new Client();
            $client->setAuthConfig(base_path(env('GOOGLE_SHEET_SERVICE_ACCOUNT_PATH')));
            $client->addScope(Sheets::SPREADSHEETS);
            $client->addScope(Sheets::DRIVE); // Cần nếu bạn muốn quản lý file trên Drive

            $service = new Sheets($client);

            // Lấy ID của Google Sheet dành cho đơn hàng từ .env
            $spreadsheetId = env('GOOGLE_ORDER_SHEET_ID');
            $sheetName = 'Orders Data'; // Tên của sheet trong Google Sheet mà bạn muốn ghi vào
            $range = $sheetName . '!A:Z'; // Phạm vi ghi dữ liệu

            // 2. Lấy tất cả đơn hàng từ database và eager load các mối quan hệ
            $orders = Order::with(['user', 'voucher', 'paymentGateway', 'orderDetails.productVariant.product'])
                            ->orderBy('created_at', 'asc')
                            ->get();

            // 3. Chuẩn bị dữ liệu để đẩy lên Google Sheet
            $values = [];
            // LƯU Ý: Dòng thêm hàng tiêu đề đã được BỎ ĐI để tránh lặp lại.
            // Điều này giả định Google Sheet của bạn đã có sẵn hàng tiêu đề.
            /*
            $values[] = [
                'Order ID', 'Invoice Code', 'User ID', 'User Name', 'User Email',
                'Voucher ID', 'Payment ID', 'Status', 'Total Amount',
                'Receiver Name', 'Receiver Phone', 'Shipping Address',
                'Created At', 'Updated At',
                'Product Details' // Cột này sẽ chứa thông tin chi tiết sản phẩm
            ];
            */

            // Duyệt qua từng đơn hàng và thêm vào mảng $values
            foreach ($orders as $order) {
                $productDetails = [];
                foreach ($order->orderDetails as $detail) {
                    $productDetails[] = sprintf(
                        "%s (Variant: %s) x%d @%.2f",
                        $detail->productVariant->product->ProductName ?? 'N/A',
                        $detail->productVariant->VariantName ?? 'N/A',
                        $detail->Quantity,
                        $detail->Price
                    );
                }

                $values[] = [
                    $order->OrderID,
                    $order->InvoiceCode,
                    $order->UserID,
                    $order->user->name ?? 'N/A', // Lấy tên người dùng nếu có quan hệ
                    $order->user->email ?? 'N/A', // Lấy email người dùng nếu có quan hệ
                    $order->VoucherID,
                    $order->PaymentID,
                    $order->Status,
                    $order->Total_amount,
                    $order->Receiver_name,
                    $order->Receiver_phone,
                    $order->Shipping_address,
                    $order->created_at ? $order->created_at->format('Y-m-d H:i:s') : '',
                    $order->updated_at ? $order->updated_at->format('Y-m-d H:i:s') : '',
                    implode('; ', $productDetails) // Nối các chi tiết sản phẩm thành một chuỗi
                ];
            }

            // Nếu không có dữ liệu nào để đẩy, có thể trả về thông báo
            if (empty($values)) {
                return response()->json([
                    'status' => 'info',
                    'message' => 'Không có dữ liệu đơn hàng nào để đẩy lên Google Sheet.'
                ], 200);
            }

            $body = new ValueRange([
                'values' => $values
            ]);

            $params = [
                'valueInputOption' => 'RAW' // Ghi dữ liệu nguyên bản
            ];

            // ĐOẠN CODE XÓA DỮ LIỆU CŨ ĐÃ ĐƯỢC BỎ ĐI HOẶC COMMENT ĐỂ ĐẢM BẢO DỮ LIỆU ĐƯỢC APPEND
            // $clearBody = new ClearValuesRequest();
            // $service->spreadsheets_values->clear($spreadsheetId, $sheetName, $clearBody);

            // 5. Ghi dữ liệu vào Google Sheet
            // append() sẽ thêm dữ liệu vào hàng trống đầu tiên sau dữ liệu hiện có.
            $result = $service->spreadsheets_values->append($spreadsheetId, $range, $body, $params);

            // 6. Trả về phản hồi JSON cho ReactJS
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu đơn hàng đã được đẩy thành công vào Google Sheet!',
                'updates' => $result->getUpdates()
            ]);

        } catch (\Exception $e) {
            // Xử lý lỗi và trả về phản hồi lỗi cho ReactJS
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi đẩy dữ liệu đơn hàng: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}
