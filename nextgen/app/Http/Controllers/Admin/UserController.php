<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User; // Import model User của bạn
use Illuminate\Http\Request;
use Google\Client;
use Google\Service\Sheets;

class UserController extends Controller
{
    /**
     * Xuất dữ liệu người dùng ra Google Sheet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportUsersToSheet(Request $request)
    {
        try {
            // Bước 1: Lấy dữ liệu người dùng từ database
            $users = User::all();

            if ($users->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có dữ liệu người dùng để xuất.'
                ], 404);
            }

            // Bước 2: Chuẩn bị dữ liệu cho Google Sheet
            $header = ['ID', 'Tên', 'Email', 'Trạng Thái', 'Ngày Đăng Ký', 'Ngày Cập Nhật'];
            $data = [$header];

            foreach ($users as $user) {
                $data[] = [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->status, // Giả sử bạn có cột status cho user
                    $user->created_at ? $user->created_at->format('Y-m-d H:i:s') : '',
                    $user->updated_at ? $user->updated_at->format('Y-m-d H:i:s') : ''
                ];
            }

            // Bước 3: Khởi tạo Google Client và kết nối với Google Sheets API
            $client = new Client();
            $client->setApplicationName('Your Admin Dashboard App');
            $client->setScopes([Sheets::SPREADSHEETS]);
            $client->setAuthConfig(storage_path('app/' . env('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS')));
            $service = new Sheets($client);

            $spreadsheetId = env('GOOGLE_SHEET_USERS_ID');
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
                'message' => 'Dữ liệu người dùng đã được đẩy thành công vào Google Sheet!',
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
                'message' => 'Có lỗi xảy ra khi đẩy dữ liệu người dùng: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }
}
