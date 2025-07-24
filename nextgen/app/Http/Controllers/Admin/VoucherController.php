<?php

namespace App\Http\Controllers\Admin; // Ensure namespace is Admin

use App\Http\Controllers\Controller; // Inherit from the base Controller
use App\Models\Voucher; // Import Model Voucher
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Import Rule for unique validation
use Illuminate\Validation\ValidationException; // Import ValidationException for API error handling

class VoucherController extends Controller
{
    /**
     * Display a listing of the resource.
     * Hiển thị danh sách các voucher.
     *
     * GET /api/admin/vouchers
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            // Lấy tất cả voucher. Có thể thêm phân trang, tìm kiếm, lọc nếu cần
            // Ví dụ: $vouchers = Voucher::paginate($request->get('per_page', 10));
            $vouchers = Voucher::all(); // Lấy tất cả voucher
            return response()->json($vouchers, 200); // Trả về JSON với status 200 OK
        } catch (\Exception $e) {
            // Handle any unexpected errors
            return response()->json(['message' => 'Error fetching vouchers.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     * Lưu voucher mới vào cơ sở dữ liệu.
     *
     * POST /api/admin/vouchers
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Xác thực dữ liệu đầu vào từ request
            $validatedData = $request->validate([
                'Code' => 'required|string|max:255|unique:vouchers,Code', // Code phải là duy nhất (sử dụng 'vouchers' thay vì 'voucher' nếu tên bảng là 'vouchers')
                'Value' => 'required|numeric|min:0',
                'Quantity' => 'required|integer|min:0',
                'Status' => 'boolean', // Status là boolean (0 hoặc 1)
                'Description' => 'nullable|string',
                'Expiry_date' => 'nullable|date|after_or_equal:today', // Ngày hết hạn phải là hôm nay hoặc tương lai
            ]);

            // Tạo voucher mới trong database
            $voucher = Voucher::create([
                'Code' => $validatedData['Code'],
                'Value' => $validatedData['Value'],
                'Quantity' => $validatedData['Quantity'],
                'Status' => $validatedData['Status'] ?? 0, // Mặc định trạng thái là 0 (inactive) nếu không được gửi
                'Description' => $validatedData['Description'],
                'Expiry_date' => $validatedData['Expiry_date'],
                'Create_at' => now(),
                'Update_at' => now(),
            ]);

            // Trả về voucher vừa tạo với status 201 Created
            return response()->json($voucher, 201);
        } catch (ValidationException $e) {
            // Xử lý lỗi xác thực
            return response()->json(['errors' => $e->errors()], 422); // 422 Unprocessable Entity
        } catch (\Exception $e) {
            // Xử lý các lỗi khác (ví dụ: lỗi database)
            return response()->json(['message' => 'Error creating voucher.', 'error' => $e->getMessage()], 500); // 500 Internal Server Error
        }
    }

    /**
     * Display the specified resource.
     * Hiển thị chi tiết một voucher cụ thể.
     *
     * GET /api/admin/vouchers/{voucher}
     *
     * @param  \App\Models\Voucher  $voucher (Sử dụng Route Model Binding)
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Voucher $voucher)
    {
        // Laravel sẽ tự động tìm voucher dựa trên ID từ URL (Route Model Binding).
        // Nếu không tìm thấy, Laravel sẽ tự động trả về 404 Not Found.
        return response()->json($voucher, 200); // Trả về voucher dưới dạng JSON với 200 OK status
    }

    /**
     * Update the specified resource in storage.
     * Cập nhật voucher đã cho trong cơ sở dữ liệu.
     *
     * PUT/PATCH /api/admin/vouchers/{voucher}
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Voucher  $voucher
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Voucher $voucher)
    {
        try {
            // Xác thực dữ liệu đầu vào
            $validatedData = $request->validate([
                // Code duy nhất, bỏ qua voucher hiện tại
                'Code' => ['required', 'string', 'max:255', Rule::unique('vouchers', 'Code')->ignore($voucher->VoucherID, 'VoucherID')],
                'Value' => 'required|numeric|min:0',
                'Quantity' => 'required|integer|min:0',
                'Status' => 'boolean',
                'Description' => 'nullable|string',
                'Expiry_date' => 'nullable|date|after_or_equal:today',
            ]);

            // Cập nhật các trường thông tin
            $voucher->Code = $validatedData['Code'];
            $voucher->Value = $validatedData['Value'];
            $voucher->Quantity = $validatedData['Quantity'];
            $voucher->Status = $validatedData['Status'] ?? 0;
            $voucher->Description = $validatedData['Description'];
            $voucher->Expiry_date = $validatedData['Expiry_date'];
            $voucher->Update_at = now(); // Cập nhật thời gian cập nhật

            $voucher->save(); // Lưu thay đổi vào database

            // Trả về voucher đã cập nhật với status 200 OK
            return response()->json($voucher, 200);
        } catch (ValidationException $e) {
            // Xử lý lỗi xác thực
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Xử lý các lỗi khác
            return response()->json(['message' => 'Error updating voucher.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * Xóa voucher đã cho khỏi cơ sở dữ liệu.
     *
     * DELETE /api/admin/vouchers/{voucher}
     *
     * @param  \App\Models\Voucher  $voucher
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Voucher $voucher)
    {
        try {
            // Bạn có thể thêm logic kiểm tra xem voucher này có đang được sử dụng trong đơn hàng nào không
            // trước khi xóa để tránh lỗi khóa ngoại.
            // Ví dụ: if ($voucher->orders()->count() > 0) {
            //     return response()->json(['message' => 'Cannot delete voucher with associated orders.'], 409); // 409 Conflict
            // }

            $voucher->delete(); // Xóa voucher

            // Trả về thông báo thành công với status 200 OK (hoặc 204 No Content nếu không cần trả về gì)
            return response()->json(['message' => 'Voucher deleted successfully.'], 200);
            // Hoặc: return response()->noContent(); // 204 No Content
        } catch (\Exception $e) {
            // Xử lý lỗi khi xóa
            return response()->json(['message' => 'Error deleting voucher.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Activate the specified voucher.
     * Kích hoạt voucher đã cho.
     *
     * PATCH /api/admin/vouchers/{id}/activate
     *
     * @param  \App\Models\Voucher  $voucher
     * @return \Illuminate\Http\JsonResponse
     */
    public function activate(Voucher $voucher)
    {
        try {
            $voucher->Status = true; // Set status to true (active)
            $voucher->Update_at = now();
            $voucher->save();
            return response()->json(['message' => 'Voucher activated successfully.', 'voucher' => $voucher], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error activating voucher.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Deactivate the specified voucher.
     * Hủy kích hoạt voucher đã cho.
     *
     * PATCH /api/admin/vouchers/{id}/deactivate
     *
     * @param  \App\Models\Voucher  $voucher
     * @return \Illuminate\Http\JsonResponse
     */
    public function deactivate(Voucher $voucher)
    {
        try {
            $voucher->Status = false; // Set status to false (inactive)
            $voucher->Update_at = now();
            $voucher->save();
            return response()->json(['message' => 'Voucher deactivated successfully.', 'voucher' => $voucher], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deactivating voucher.', 'error' => $e->getMessage()], 500);
        }
    }

    // Các phương thức 'create' và 'edit' không cần thiết cho API Controller
    // vì chúng dùng để hiển thị form HTML, không phải trả về dữ liệu API.
    // public function create() { ... }
    // public function edit(Voucher $voucher) { ... }
}
