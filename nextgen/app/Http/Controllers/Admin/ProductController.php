<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product; // Import model Product của bạn
use Illuminate\Http\Request;
use Google\Client;
use Google\Service\Sheets;

class ProductController extends Controller
{
    /**
     * Xuất dữ liệu sản phẩm ra Google Sheet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportProductsToSheet(Request $request)
    {
        try {
            // Bước 1: Lấy dữ liệu sản phẩm từ database
            // Eager load mối quan hệ với Category để lấy tên danh mục
            $products = Product::with('category')->get();

            if ($products->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có dữ liệu sản phẩm để xuất.'
                ], 404);
            }

            // Bước 2: Chuẩn bị dữ liệu cho Google Sheet
            $header = [
                'ID', 'Tên Sản Phẩm', 'Slug', 'Mô Tả', 'Giá', 'Số Lượng',
                'Danh Mục', 'Trạng Thái', 'Ngày Tạo', 'Ngày Cập Nhật'
            ];
            $data = [$header];

            foreach ($products as $product) {
                $data[] = [
                    $product->id,
                    $product->name,
                    $product->slug,
                    $product->description,
                    $product->price,
                    $product->stock_quantity, // Hoặc 'quantity' tùy theo tên cột của bạn
                    $product->category ? $product->category->name : 'N/A', // Tên danh mục từ mối quan hệ
                    $product->status, // Ví dụ: 'active', 'inactive'
                    $product->created_at ? $product->created_at->format('Y-m-d H:i:s') : '',
                    $product->updated_at ? $product->updated_at->format('Y-m-d H:i:s') : ''
                ];
            }

            // Bước 3: Khởi tạo Google Client và kết nối với Google Sheets API
            $client = new Client();
            $client->setApplicationName('Your Admin Dashboard App');
            $client->setScopes([Sheets::SPREADSHEETS]);
            $client->setAuthConfig(storage_path('app/' . env('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS')));
            $service = new Sheets($client);

            $spreadsheetId = env('GOOGLE_SHEET_PRODUCTS_ID');
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
                'message' => 'Dữ liệu sản phẩm đã được đẩy thành công vào Google Sheet!',
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
                'message' => 'Có lỗi xảy ra khi đẩy dữ liệu sản phẩm: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }
}
