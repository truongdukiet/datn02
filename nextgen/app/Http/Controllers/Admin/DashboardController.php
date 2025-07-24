<?php

namespace App\Http\Controllers\Api; // Đã thay đổi namespace thành Api

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; // Import Model User
use App\Models\Category; // Import Model Category
use App\Models\Product; // Import Model Product
use App\Models\Order; // Import Model Order
use App\Models\Voucher; // Import Model Voucher

// Import các lớp Google API
use Google\Client;
use Google\Service\Sheets;
use Google\Service\Sheets\ValueRange;
// use Google\Service\Sheets\ClearValuesRequest; // Không cần import nếu không dùng clear()

class DashboardController extends Controller
{
    /**
     * Hiển thị trang dashboard của admin dưới dạng API JSON.
     * Trả về các số liệu thống kê tổng quan.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Lấy các thống kê tổng quan từ database
            $totalUsers = User::count();
            $totalCategories = Category::count();
            $totalProducts = Product::count();
            $totalOrders = Order::count();
            $pendingOrders = Order::where('Status', 'pending')->count(); // Giả sử có trạng thái 'pending'
            $totalVouchers = Voucher::count();

            // Trả về dữ liệu thống kê dưới dạng JSON
            return response()->json([
                'totalUsers' => $totalUsers,
                'totalCategories' => $totalCategories,
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'totalVouchers' => $totalVouchers
            ]);
        } catch (\Exception $e) {
            // Bắt các lỗi và trả về JSON với mã trạng thái 500 Internal Server Error
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi lấy dữ liệu dashboard.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export dashboard statistics to Google Sheet.
     * Đẩy các số liệu thống kê dashboard lên Google Sheet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportStatsToSheet(Request $request)
    {
        try {
            // 1. Khởi tạo Google Client với thông tin xác thực Service Account
            $client = new Client();
            $client->setAuthConfig(base_path(env('GOOGLE_SHEET_SERVICE_ACCOUNT_PATH')));
            $client->addScope(Sheets::SPREADSHEETS);
            $client->addScope(Sheets::DRIVE);

            $service = new Sheets($client);

            $spreadsheetId = env('GOOGLE_DASHBOARD_SHEET_ID'); // ID của Google Sheet dành cho dashboard stats
            $sheetName = 'Dashboard Stats'; // Tên của sheet trong Google Sheet
            $range = $sheetName . '!A:B'; // Phạm vi ghi dữ liệu (ví dụ: cột A cho tên, cột B cho giá trị)

            // 2. Lấy các số liệu thống kê (tái sử dụng logic từ phương thức index)
            $totalUsers = User::count();
            $totalCategories = Category::count();
            $totalProducts = Product::count();
            $totalOrders = Order::count();
            $pendingOrders = Order::where('Status', 'pending')->count();
            $totalVouchers = Voucher::count();

            // 3. Chuẩn bị dữ liệu để đẩy lên Google Sheet
            // Dữ liệu sẽ có dạng cặp Key-Value: [Tên thống kê, Giá trị]
            $values = [];
            // LƯU Ý QUAN TRỌNG: Dòng thêm hàng tiêu đề đã được BỎ ĐI.
            // Điều này giả định Google Sheet của bạn đã có sẵn hàng tiêu đề.
            // Nếu Sheet của bạn trống và bạn muốn thêm tiêu đề CHỈ MỘT LẦN,
            // bạn có thể thêm logic kiểm tra hoặc thêm thủ công vào Sheet.
            /*
            $values[] = ['Statistic', 'Value'];
            */
            // Thêm các hàng dữ liệu
            $values[] = ['Total Users', $totalUsers];
            $values[] = ['Total Categories', $totalCategories];
            $values[] = ['Total Products', $totalProducts];
            $values[] = ['Total Orders', $totalOrders];
            $values[] = ['Pending Orders', $pendingOrders];
            $values[] = ['Total Vouchers', $totalVouchers];
            $values[] = ['Last Export Time', now()->format('Y-m-d H:i:s')]; // Thêm thời gian xuất

            // Nếu không có dữ liệu nào để đẩy, có thể trả về thông báo
            if (empty($values)) {
                return response()->json([
                    'status' => 'info',
                    'message' => 'Không có dữ liệu thống kê nào để đẩy lên Google Sheet.'
                ], 200);
            }

            $body = new ValueRange([
                'values' => $values
            ]);

            $params = [
                'valueInputOption' => 'RAW' // Ghi dữ liệu nguyên bản
            ];

            // ĐOẠN CODE XÓA DỮ LIỆU CŨ ĐÃ ĐƯỢC BỎ ĐI HOẶN COMMENT ĐỂ ĐẢM BẢO DỮ LIỆU ĐƯỢC APPEND
            // $clearBody = new ClearValuesRequest();
            // $service->spreadsheets_values->clear($spreadsheetId, $sheetName, $clearBody);

            // 5. Ghi dữ liệu vào Google Sheet
            // append() sẽ thêm dữ liệu vào hàng trống đầu tiên sau dữ liệu hiện có.
            $result = $service->spreadsheets_values->append($spreadsheetId, $range, $body, $params);

            // 6. Trả về phản hồi JSON cho ReactJS
            return response()->json([
                'status' => 'success',
                'message' => 'Số liệu dashboard đã được đẩy thành công vào Google Sheet!',
                'updates' => $result->getUpdates()
            ]);

        } catch (\Exception $e) {
            // Xử lý lỗi và trả về phản hồi lỗi cho ReactJS
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi đẩy số liệu dashboard: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}
