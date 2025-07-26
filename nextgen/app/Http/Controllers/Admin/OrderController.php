<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order; // Import model Order của bạn
use Illuminate\Http\Request;
use Google\Client;
use Google\Service\Sheets;

class OrderController extends Controller
{
    /**
     * Xuất dữ liệu đơn hàng ra Google Sheet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportOrdersToSheet(Request $request)
    {
        try {
            // Bước 1: Lấy dữ liệu đơn hàng từ database
            // Eager load các mối quan hệ (user, orderItems) để lấy thông tin chi tiết
            $orders = Order::with('user', 'orderItems.product')->get();

            if ($orders->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có dữ liệu đơn hàng để xuất.'
                ], 404);
            }

            // Bước 2: Chuẩn bị dữ liệu cho Google Sheet
            // Tiêu đề cột
            $header = [
                'ID Đơn Hàng', 'Mã Đơn Hàng', 'Tên Khách Hàng', 'Email Khách Hàng',
                'Tổng Tiền', 'Trạng Thái', 'Địa Chỉ Giao Hàng', 'Số Điện Thoại',
                'Ngày Đặt Hàng', 'Ngày Cập Nhật', 'Sản Phẩm Trong Đơn' // Cột mới cho danh sách sản phẩm
            ];
            $data = [$header];

            foreach ($orders as $order) {
                $productDetails = [];
                // Duyệt qua các mặt hàng trong đơn hàng để lấy tên sản phẩm và số lượng
                foreach ($order->orderItems as $item) {
                    $productDetails[] = $item->product->name . ' (SL: ' . $item->quantity . ')';
                }

                $data[] = [
                    $order->id,
                    $order->order_code, // Giả sử có cột order_code
                    $order->user ? $order->user->name : 'N/A', // Tên khách hàng từ mối quan hệ user
                    $order->user ? $order->user->email : 'N/A', // Email khách hàng
                    $order->total_amount,
                    $order->status,
                    $order->shipping_address,
                    $order->phone_number,
                    $order->created_at ? $order->created_at->format('Y-m-d H:i:s') : '',
                    $order->updated_at ? $order->updated_at->format('Y-m-d H:i:s') : '',
                    implode('; ', $productDetails) // Nối các sản phẩm thành một chuỗi
                ];
            }

            // Bước 3: Khởi tạo Google Client và kết nối với Google Sheets API
            $client = new Client();
            $client->setApplicationName('Your Admin Dashboard App');
            $client->setScopes([Sheets::SPREADSHEETS]);
            $client->setAuthConfig(storage_path('app/' . env('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS')));
            $service = new Sheets($client);

            $spreadsheetId = env('GOOGLE_SHEET_ORDERS_ID');
            $range = 'Sheet1!A1';

            $body = new Sheets\ValueRange([
                'values' => $data
            ]);
            $params = [
                'valueInputOption' => 'RAW'
            ];

            $response = $service->spreadsheets_values->update($spreadsheetId, $range, $body, $params);

            // Bước 4: Trả về phản hồi thành công
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu đơn hàng đã được đẩy thành công vào Google Sheet!',
                'updates' => [
                    'spreadsheetId' => $response->getSpreadsheetId(),
                    'updatedRange' => $response->getUpdatedRange(),
                    'updatedRows' => $response->getUpdatedRows(),
                    'updatedColumns' => $response->getUpdatedColumns(),
                    'updatedCells' => $response->getUpdatedCells(),
                ]
            ]);

        } catch (\Exception $e) {
            // Bước 4: Trả về phản hồi lỗi
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi đẩy dữ liệu đơn hàng: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }
}
