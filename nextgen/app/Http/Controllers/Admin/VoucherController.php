<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Voucher; // Import model Voucher của bạn
use Illuminate\Http\Request;
use Google\Client;
use Google\Service\Sheets;

class VoucherController extends Controller
{
    /**
     * Xuất dữ liệu voucher ra Google Sheet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportVouchersToSheet(Request $request)
    {
        try {
            // Bước 1: Lấy dữ liệu voucher từ database
            $vouchers = Voucher::all();

            if ($vouchers->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có dữ liệu voucher để xuất.'
                ], 404);
            }

            // Bước 2: Chuẩn bị dữ liệu cho Google Sheet
            $header = [
                'ID', 'Mã Voucher', 'Loại', 'Giá Trị', 'Giá Trị Tối Thiểu',
                'Số Lượng', 'Ngày Bắt Đầu', 'Ngày Hết Hạn', 'Trạng Thái',
                'Ngày Tạo', 'Ngày Cập Nhật'
            ];
            $data = [$header];

            foreach ($vouchers as $voucher) {
                $data[] = [
                    $voucher->id,
                    $voucher->code,
                    $voucher->type, // Ví dụ: 'percentage', 'fixed_amount'
                    $voucher->value,
                    $voucher->min_order_amount, // Giả sử có cột này
                    $voucher->quantity, // Giả sử có cột này
                    $voucher->start_date ? $voucher->start_date->format('Y-m-d H:i:s') : '',
                    $voucher->end_date ? $voucher->end_date->format('Y-m-d H:i:s') : '',
                    $voucher->status, // Ví dụ: 'active', 'inactive', 'expired'
                    $voucher->created_at ? $voucher->created_at->format('Y-m-d H:i:s') : '',
                    $voucher->updated_at ? $voucher->updated_at->format('Y-m-d H:i:s') : ''
                ];
            }

            // Bước 3: Khởi tạo Google Client và kết nối với Google Sheets API
            $client = new Client();
            $client->setApplicationName('Your Admin Dashboard App');
            $client->setScopes([Sheets::SPREADSHEETS]);
            $client->setAuthConfig(storage_path('app/' . env('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS')));
            $service = new Sheets($client);

            $spreadsheetId = env('GOOGLE_SHEET_VOUCHERS_ID');
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
                'message' => 'Dữ liệu voucher đã được đẩy thành công vào Google Sheet!',
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
                'message' => 'Có lỗi xảy ra khi đẩy dữ liệu voucher: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }
}
