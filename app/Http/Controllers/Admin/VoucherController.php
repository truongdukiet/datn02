<?php
// app/Http/Controllers/Admin/VoucherController.php
// Đây là tệp điều khiển (Controller) chính cho việc quản lý voucher trong khu vực Admin.

namespace App\Http\Controllers\Admin; // Định nghĩa namespace cho Controller.

use App\Http\Controllers\Controller; // Import Controller cơ sở của Laravel.
use App\Models\Voucher; // Import model Voucher để tương tác với bảng 'vouchers'.
use Illuminate\Http\Request; // Import class Request để lấy dữ liệu từ các yêu cầu HTTP.
use Illuminate\Support\Facades\Validator; // Import Validator để xác thực dữ liệu đầu vào.
use Illuminate\Validation\Rule; // Import Rule để sử dụng các quy tắc xác thực nâng cao.

class VoucherController extends Controller // Định nghĩa class Controller của chúng ta.
{
    /**
     * Lấy tất cả voucher.
     * Xử lý yêu cầu GET đến /api/admin/vouchers
     *
     * @return \Illuminate\Http\JsonResponse Trả về danh sách voucher dưới dạng JSON.
     */
    public function index() // Phương thức này xử lý việc lấy tất cả voucher.
    {
        // Lấy tất cả voucher từ cơ sở dữ liệu, sắp xếp theo ID giảm dần.
        $vouchers = Voucher::orderBy('id', 'desc')->get();
        // Trả về danh sách voucher dưới dạng phản hồi JSON.
        return response()->json($vouchers);
    }

    /**
     * Lưu trữ một voucher mới.
     * Xử lý yêu cầu POST đến /api/admin/vouchers
     *
     * @param  \Illuminate\Http\Request  $request Dữ liệu yêu cầu từ client.
     * @return \Illuminate\Http\JsonResponse Trả về JSON với thông báo thành công và dữ liệu voucher mới.
     */
    public function store(Request $request) // Phương thức này xử lý việc thêm voucher mới.
    {
        // Định nghĩa các quy tắc xác thực cho dữ liệu đầu vào.
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:255|unique:vouchers,code', // Mã voucher bắt buộc, duy nhất.
            'type' => ['required', 'string', Rule::in(['fixed', 'percentage'])], // Loại voucher: cố định hoặc phần trăm.
            'value' => 'required|numeric|min:0', // Giá trị voucher.
            'min_order_amount' => 'nullable|numeric|min:0', // Giá trị đơn hàng tối thiểu để áp dụng.
            'max_discount_amount' => 'nullable|numeric|min:0', // Giới hạn giảm giá tối đa (cho loại percentage).
            'starts_at' => 'nullable|date', // Ngày bắt đầu có hiệu lực.
            'expires_at' => 'nullable|date|after_or_equal:starts_at', // Ngày hết hạn, phải sau hoặc bằng ngày bắt đầu.
            'usage_limit' => 'nullable|integer|min:1', // Giới hạn số lần sử dụng.
            'used_count' => 'nullable|integer|min:0', // Số lần đã sử dụng.
            'is_active' => 'boolean', // Trạng thái kích hoạt.
        ], [
            // Thông báo lỗi tùy chỉnh.
            'code.required' => 'Mã voucher là bắt buộc.',
            'code.unique' => 'Mã voucher này đã tồn tại.',
            'type.required' => 'Loại voucher là bắt buộc.',
            'type.in' => 'Loại voucher không hợp lệ. Chỉ chấp nhận "fixed" hoặc "percentage".',
            'value.required' => 'Giá trị voucher là bắt buộc.',
            'value.numeric' => 'Giá trị voucher phải là số.',
            'value.min' => 'Giá trị voucher không được âm.',
            'expires_at.after_or_equal' => 'Ngày hết hạn phải sau hoặc bằng ngày bắt đầu.',
        ]);

        if ($validator->fails()) { // Kiểm tra nếu xác thực thất bại.
            return response()->json(['errors' => $validator->errors()], 422); // Trả về lỗi xác thực.
        }

        // Tạo một bản ghi voucher mới trong cơ sở dữ liệu.
        $voucher = Voucher::create([
            'code' => $request->code,
            'type' => $request->type,
            'value' => $request->value,
            'min_order_amount' => $request->min_order_amount,
            'max_discount_amount' => $request->max_discount_amount,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
            'usage_limit' => $request->usage_limit,
            'used_count' => $request->used_count ?? 0, // Mặc định là 0 nếu không được cung cấp.
            'is_active' => $request->is_active ?? true, // Mặc định là true nếu không được cung cấp.
        ]);

        // Trả về phản hồi JSON thông báo thành công.
        return response()->json(['message' => 'Voucher đã được tạo thành công.', 'voucher' => $voucher], 201);
    }

    /**
     * Hiển thị thông tin một voucher cụ thể.
     * Xử lý yêu cầu GET đến /api/admin/vouchers/{id}
     *
     * @param  int  $id ID của voucher cần hiển thị.
     * @return \Illuminate\Http\JsonResponse Trả về dữ liệu voucher cụ thể.
     */
    public function show($id) // Phương thức này xử lý việc lấy một voucher theo ID.
    {
        $voucher = Voucher::find($id); // Tìm voucher trong cơ sở dữ liệu bằng ID.

        if (!$voucher) { // Nếu không tìm thấy voucher.
            return response()->json(['message' => 'Không tìm thấy voucher.'], 404); // Trả về lỗi 404.
        }

        return response()->json($voucher); // Trả về dữ liệu voucher dưới dạng JSON.
    }

    /**
     * Cập nhật thông tin một voucher hiện có.
     * Xử lý yêu cầu PUT/PATCH đến /api/admin/vouchers/{id}
     *
     * @param  \Illuminate\Http\Request  $request Dữ liệu yêu cầu từ client.
     * @param  int  $id ID của voucher cần cập nhật.
     * @return \Illuminate\Http\JsonResponse Trả về thông báo thành công và dữ liệu voucher đã cập nhật.
     */
    public function update(Request $request, $id) // Phương thức này xử lý việc cập nhật voucher.
    {
        $voucher = Voucher::find($id); // Tìm voucher cần cập nhật bằng ID.

        if (!$voucher) { // Nếu không tìm thấy voucher.
            return response()->json(['message' => 'Không tìm thấy voucher.'], 404);
        }

        // Định nghĩa các quy tắc xác thực cho dữ liệu đầu vào.
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:255|unique:vouchers,code,' . $id, // Mã voucher phải là duy nhất, bỏ qua chính voucher này.
            'type' => ['required', 'string', Rule::in(['fixed', 'percentage'])],
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'usage_limit' => 'nullable|integer|min:1',
            'used_count' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ], [
            // Thông báo lỗi tùy chỉnh.
            'code.required' => 'Mã voucher là bắt buộc.',
            'code.unique' => 'Mã voucher này đã tồn tại.',
            'type.required' => 'Loại voucher là bắt buộc.',
            'type.in' => 'Loại voucher không hợp lệ. Chỉ chấp nhận "fixed" hoặc "percentage".',
            'value.required' => 'Giá trị voucher là bắt buộc.',
            'value.numeric' => 'Giá trị voucher phải là số.',
            'value.min' => 'Giá trị voucher không được âm.',
            'expires_at.after_or_equal' => 'Ngày hết hạn phải sau hoặc bằng ngày bắt đầu.',
        ]);

        if ($validator->fails()) { // Kiểm tra nếu xác thực thất bại.
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Cập nhật các thuộc tính của voucher.
        $voucher->code = $request->code;
        $voucher->type = $request->type;
        $voucher->value = $request->value;
        $voucher->min_order_amount = $request->min_order_amount;
        $voucher->max_discount_amount = $request->max_discount_amount;
        $voucher->starts_at = $request->starts_at;
        $voucher->expires_at = $request->expires_at;
        $voucher->usage_limit = $request->usage_limit;
        $voucher->used_count = $request->used_count ?? $voucher->used_count; // Giữ nguyên nếu không được cung cấp.
        $voucher->is_active = $request->is_active ?? $voucher->is_active; // Giữ nguyên nếu không được cung cấp.

        $voucher->save(); // Lưu các thay đổi vào cơ sở dữ liệu.

        // Trả về phản hồi JSON thông báo cập nhật thành công.
        return response()->json(['message' => 'Voucher đã được cập nhật thành công.', 'voucher' => $voucher]);
    }

    /**
     * Xóa một voucher.
     * Xử lý yêu cầu DELETE đến /api/admin/vouchers/{id}
     *
     * @param  int  $id ID của voucher cần xóa.
     * @return \Illuminate\Http\JsonResponse Trả về thông báo thành công.
     */
    public function destroy($id) // Phương thức này xử lý việc xóa voucher.
    {
        $voucher = Voucher::find($id); // Tìm voucher cần xóa bằng ID.

        if (!$voucher) { // Nếu không tìm thấy voucher.
            return response()->json(['message' => 'Không tìm thấy voucher.'], 404);
        }

        $voucher->delete(); // Xóa bản ghi voucher khỏi cơ sở dữ liệu.

        return response()->json(['message' => 'Voucher đã được xóa thành công.'], 200); // Trả về thông báo thành công.
    }

    /**
     * Cập nhật trạng thái kích hoạt của voucher.
     * Xử lý yêu cầu PATCH đến /api/admin/vouchers/{id}/toggle-active
     *
     * @param  \Illuminate\Http\Request  $request Dữ liệu yêu cầu từ client (chứa 'is_active' mới).
     * @param  int  $id ID của voucher.
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleActive(Request $request, $id)
    {
        $voucher = Voucher::find($id);

        if (!$voucher) {
            return response()->json(['message' => 'Không tìm thấy voucher.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
        ], [
            'is_active.required' => 'Trạng thái kích hoạt là bắt buộc.',
            'is_active.boolean' => 'Trạng thái kích hoạt phải là true hoặc false.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $voucher->is_active = $request->is_active;
        $voucher->save();

        return response()->json(['message' => 'Trạng thái kích hoạt của voucher đã được cập nhật.', 'voucher' => $voucher]);
    }
}
