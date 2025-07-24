<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category; // Import Model Category
use Illuminate\Http\Request;
use Google\Client; // Import Google Client
use Google\Service\Sheets; // Import Sheets Service
use Google\Service\Sheets\ValueRange; // Import ValueRange
// use Google\Service\Sheets\ClearValuesRequest; // Không cần import nếu không dùng clear()

class CategoryController extends Controller
{
    // ... (Giữ nguyên các phương thức index, store, show, update, destroy của bạn) ...

    /**
     * Export categories data to Google Sheet.
     * Đẩy dữ liệu danh mục hiện có lên Google Sheet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportToSheet(Request $request)
    {
        try {
            // 1. Khởi tạo Google Client với thông tin xác thực Service Account
            $client = new Client();
            // setAuthConfig sẽ tự động đọc file JSON và thiết lập thông tin xác thực
            $client->setAuthConfig(base_path(env('GOOGLE_SHEET_SERVICE_ACCOUNT_PATH')));
            // Thêm các scope cần thiết để tương tác với Google Sheets và Google Drive
            $client->addScope(Sheets::SPREADSHEETS);
            $client->addScope(Sheets::DRIVE); // Cần nếu bạn muốn quản lý file trên Drive

            $service = new Sheets($client); // Tạo service để tương tác với Sheets API

            $spreadsheetId = env('GOOGLE_SHEET_ID'); // Lấy ID của Google Sheet từ .env
            $sheetName = 'Categories Data'; // Tên của sheet trong Google Sheet mà bạn muốn ghi vào
            $range = $sheetName . '!A:Z'; // Phạm vi ghi dữ liệu (từ cột A đến Z trên sheet đó)

            // 2. Lấy tất cả danh mục từ database
            $categories = Category::all();

            // 3. Chuẩn bị dữ liệu để đẩy lên Google Sheet
            $values = [];
            // LƯU Ý QUAN TRỌNG: Dòng thêm hàng tiêu đề đã được BỎ ĐI.
            // Điều này giả định Google Sheet của bạn đã có sẵn hàng tiêu đề.
            // Nếu Sheet của bạn trống và bạn muốn thêm tiêu đề CHỈ MỘT LẦN,
            // bạn có thể thêm logic kiểm tra hoặc thêm thủ công vào Sheet.
            /*
            $values[] = [
                'Category ID',
                'Name',
                'Description',
                'Created At',
                'Updated At'
            ];
            */

            // Duyệt qua từng danh mục và thêm vào mảng $values
            foreach ($categories as $category) {
                $values[] = [
                    $category->CategoryID, // Giả sử cột khóa chính của bạn là CategoryID
                    $category->Name,
                    $category->Description,
                    $category->Create_at ? $category->Create_at->format('Y-m-d H:i:s') : '', // Kiểm tra null và format ngày tháng
                    $category->Update_at ? $category->Update_at->format('Y-m-d H:i:s') : '' // Tương tự
                ];
            }

            // Nếu không có dữ liệu nào để đẩy, có thể trả về thông báo
            if (empty($values)) {
                return response()->json([
                    'status' => 'info',
                    'message' => 'Không có dữ liệu danh mục nào để đẩy lên Google Sheet.'
                ], 200);
            }

            $body = new ValueRange([
                'values' => $values
            ]);

            $params = [
                'valueInputOption' => 'RAW' // Cách dữ liệu được hiểu: 'RAW' (ghi nguyên) hoặc 'USER_ENTERED' (như bạn nhập thủ công)
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
                'message' => 'Dữ liệu danh mục đã được đẩy thành công vào Google Sheet!',
                'updates' => $result->getUpdates() // Thông tin về các cập nhật từ Google API
            ]);

        } catch (\Exception $e) {
            // Xử lý lỗi và trả về phản hồi lỗi cho ReactJS
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi đẩy dữ liệu danh mục: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}
