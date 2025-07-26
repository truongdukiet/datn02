<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Google\Client;
use Google\Service\Sheets;
// Giả sử bạn có một số Model để lấy dữ liệu thống kê, ví dụ:
// use App\Models\Order;
// use App\Models\User;
// use App\Models\Product;

class DashboardController extends Controller
{
    /**
     * Xuất dữ liệu thống kê Dashboard ra Google Sheet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportDashboardStatsToSheet(Request $request)
    {
        try {
            // Bước 1: Lấy dữ liệu thống kê từ database
            // Đây là ví dụ, bạn cần thay thế bằng logic lấy thống kê thực tế của mình.
            // Có thể bạn sẽ tính toán các số liệu từ nhiều bảng hoặc có một bảng riêng cho thống kê.
            $totalUsers = 1234; // User::count();
            $totalOrders = 567; // Order::count();
            $totalProducts = 890; // Product::count();
            $totalRevenue = 123456789.50; // Order::sum('total_amount');
            $latestUpdate = now()->format('Y-m-d H:i:s'); // Thời gian cập nhật gần nhất

            // Kiểm tra nếu không có dữ liệu để xuất (tùy theo logic thống kê của bạn)
            if ($totalUsers === 0 && $totalOrders === 0) { // Ví dụ kiểm tra
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có dữ liệu thống kê dashboard để xuất.'
                ], 404);
            }

            // Bước 2: Chuẩn bị dữ liệu cho Google Sheet
            $header = ['Metric', 'Value', 'Last Updated'];
            $data = [$header];

            $data[] = ['Total Users', $totalUsers, $latestUpdate];
            $data[] = ['Total Orders', $totalOrders, $latestUpdate];
            $data[] = ['Total Products', $totalProducts, $latestUpdate];
            $data[] = ['Total Revenue', $totalRevenue, $latestUpdate];
            // Thêm các số liệu thống kê khác nếu có

            // Bước 3: Khởi tạo Google Client và kết nối với Google Sheets API
            $client = new Client();
            $client->setApplicationName('Your Admin Dashboard App');
            $client->setScopes([Sheets::SPREADSHEETS]);
            $client->setAuthConfig(storage_path('app/' . env('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS')));
            $service = new Sheets($client);

            $spreadsheetId = env('GOOGLE_SHEET_DASHBOARD_ID');
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
                'message' => 'Dữ liệu thống kê dashboard đã được đẩy thành công vào Google Sheet!',
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
                'message' => 'Có lỗi xảy ra khi đẩy dữ liệu thống kê dashboard: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }
}
