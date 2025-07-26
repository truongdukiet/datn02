<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News; // Giả sử bạn có model News (hoặc Post, Article)
use Illuminate\Http\Request;
use Google\Client;
use Google\Service\Sheets;

class NewsController extends Controller
{
    /**
     * Xuất dữ liệu tin tức ra Google Sheet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportNewsToSheet(Request $request)
    {
        try {
            // Bước 1: Lấy dữ liệu tin tức từ database
            $newsItems = News::all(); // Lấy tất cả tin tức

            if ($newsItems->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có dữ liệu tin tức để xuất.'
                ], 404);
            }

            // Bước 2: Chuẩn bị dữ liệu cho Google Sheet
            $header = ['ID', 'Tiêu Đề', 'Slug', 'Tóm Tắt', 'Nội Dung', 'Trạng Thái', 'Ngày Đăng', 'Ngày Cập Nhật'];
            $data = [$header];

            foreach ($newsItems as $news) {
                $data[] = [
                    $news->id,
                    $news->title,
                    $news->slug,
                    $news->summary,
                    $news->content,
                    $news->status, // Ví dụ: 'published', 'draft'
                    $news->published_at ? $news->published_at->format('Y-m-d H:i:s') : '', // Ngày đăng
                    $news->updated_at ? $news->updated_at->format('Y-m-d H:i:s') : ''
                ];
            }

            // Bước 3: Khởi tạo Google Client và kết nối với Google Sheets API
            $client = new Client();
            $client->setApplicationName('Your Admin Dashboard App');
            $client->setScopes([Sheets::SPREADSHEETS]);
            $client->setAuthConfig(storage_path('app/' . env('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS')));
            $service = new Sheets($client);

            $spreadsheetId = env('GOOGLE_SHEET_NEWS_ID');
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
                'message' => 'Dữ liệu tin tức đã được đẩy thành công vào Google Sheet!',
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
                'message' => 'Có lỗi xảy ra khi đẩy dữ liệu tin tức: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }
}
