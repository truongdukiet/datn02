<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category; // Import model Category của bạn
use Illuminate\Http\Request;
use Google\Client;
use Google\Service\Sheets;

class CategoryController extends Controller
{
    /**
     * Xuất dữ liệu danh mục ra Google Sheet.
     *
     * Đây là API được gọi từ ReactJS để đẩy dữ liệu danh mục lên một Google Sheet đã cấu hình.
     *
     * @param  \Illuminate\Http\Request  $request Không cần dữ liệu trong body request POST này.
     * @return \Illuminate\Http\JsonResponse Trả về JSON với trạng thái thành công/thất bại và chi tiết.
     */
    public function exportCategoriesToSheet(Request $request)
    {
        try {
            // Bước 1: Lấy tất cả dữ liệu danh mục từ cơ sở dữ liệu
            $categories = Category::all(); // Lấy tất cả các bản ghi từ bảng 'categories'

            if ($categories->isEmpty()) {
                // Nếu không có danh mục nào, trả về lỗi 404
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có dữ liệu danh mục để xuất.'
                ], 404);
            }

            // Bước 2: Chuẩn bị dữ liệu để ghi vào Google Sheet
            // Hàng đầu tiên (header) sẽ là tên các cột trong Google Sheet
            $header = ['ID', 'Tên Danh Mục', 'Slug', 'Mô Tả', 'Ngày Tạo', 'Ngày Cập Nhật'];
            $data = [$header]; // Bắt đầu mảng dữ liệu với hàng tiêu đề

            // Duyệt qua từng danh mục và thêm dữ liệu vào mảng
            foreach ($categories as $category) {
                $data[] = [
                    $category->id,
                    $category->name,
                    $category->slug,
                    $category->description,
                    // Định dạng ngày tháng cho dễ đọc trong Google Sheet
                    $category->created_at ? $category->created_at->format('Y-m-d H:i:s') : '',
                    $category->updated_at ? $category->updated_at->format('Y-m-d H:i:s') : ''
                ];
            }

            // Bước 3: Khởi tạo Google Client và kết nối với Google Sheets API
            $client = new Client();
            $client->setApplicationName('Your Admin Dashboard App'); // Tên ứng dụng của bạn
            $client->setScopes([Sheets::SPREADSHEETS]); // Chỉ định quyền truy cập Google Sheets

            // Đặt đường dẫn đến file credentials của Service Account
            $client->setAuthConfig(storage_path('app/' . env('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS')));

            $service = new Sheets($client);

            // Lấy ID của Google Sheet dành cho Categories từ biến môi trường
            $spreadsheetId = env('GOOGLE_SHEET_CATEGORIES_ID');
            $range = 'Sheet1!A1'; // Phạm vi ghi dữ liệu, bắt đầu từ ô A1 của Sheet1

            // Tạo đối tượng ValueRange chứa dữ liệu của bạn
            $body = new Sheets\ValueRange([
                'values' => $data // Mảng dữ liệu đã chuẩn bị
            ]);

            $params = [
                'valueInputOption' => 'RAW' // Giữ nguyên định dạng dữ liệu (text, số)
            ];

            // Ghi dữ liệu vào Google Sheet
            $response = $service->spreadsheets_values->update($spreadsheetId, $range, $body, $params);

            // Bước 4: Trả về phản hồi thành công cho ReactJS
            return response()->json([
                'status' => 'success',
                'message' => 'Dữ liệu danh mục đã được đẩy thành công vào Google Sheet!',
                'updates' => [
                    'spreadsheetId' => $response->getSpreadsheetId(),
                    'updatedRange' => $response->getUpdatedRange(),
                    'updatedRows' => $response->getUpdatedRows(),
                    'updatedColumns' => $response->getUpdatedColumns(),
                    'updatedCells' => $response->getUpdatedCells(),
                ]
            ]);

        } catch (\Exception $e) {
            // Bước 4: Trả về phản hồi lỗi nếu có bất kỳ vấn đề gì xảy ra
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi đẩy dữ liệu danh mục: ' . $e->getMessage(),
                'line' => $e->getLine(), // Dòng code gây lỗi trong file hiện tại
                'file' => basename($e->getFile()) // Tên file gây lỗi (ví dụ: CategoryController.php)
            ], 500); // Mã HTTP 500: Lỗi máy chủ nội bộ
        }
    }
}
