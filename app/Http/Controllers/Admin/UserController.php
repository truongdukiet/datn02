<?php
// app/Http/Controllers/Admin/UserController.php
// Đây là tệp điều khiển (Controller) chính cho việc quản lý người dùng trong khu vực Admin.

namespace App\Http\Controllers\Admin; // Định nghĩa namespace cho Controller.

use App\Http\Controllers\Controller; // Import Controller cơ sở của Laravel.
use App\Models\User; // Import model User để tương tác với bảng 'users'.
use Illuminate\Http\Request; // Import class Request để lấy dữ liệu từ các yêu cầu HTTP.
use Illuminate\Support\Facades\Validator; // Import Validator để xác thực dữ liệu đầu vào.
use Illuminate\Support\Facades\Hash; // Import Hash để mã hóa mật khẩu.
use Illuminate\Validation\Rule; // Import Rule để sử dụng các quy tắc xác thực nâng cao.

class UserController extends Controller // Định nghĩa class Controller của chúng ta.
{
    /**
     * Lấy tất cả người dùng.
     * Xử lý yêu cầu GET đến /api/admin/users
     *
     * @return \Illuminate\Http\JsonResponse Trả về danh sách người dùng dưới dạng JSON.
     */
    public function index() // Phương thức này xử lý việc lấy tất cả người dùng.
    {
        // Lấy tất cả người dùng từ cơ sở dữ liệu, sắp xếp theo ID giảm dần.
        // Tránh trả về mật khẩu và các thông tin nhạy cảm khác.
        $users = User::select('id', 'name', 'email', 'role', 'email_verified_at', 'created_at', 'updated_at')
                     ->orderBy('id', 'desc')
                     ->get();
        // Trả về danh sách người dùng dưới dạng phản hồi JSON.
        return response()->json($users);
    }

    /**
     * Lưu trữ một người dùng mới.
     * Xử lý yêu cầu POST đến /api/admin/users
     *
     * @param  \Illuminate\Http\Request  $request Dữ liệu yêu cầu từ client.
     * @return \Illuminate\Http\JsonResponse Trả về JSON với thông báo thành công và dữ liệu người dùng mới.
     */
    public function store(Request $request) // Phương thức này xử lý việc thêm người dùng mới.
    {
        // Định nghĩa các quy tắc xác thực cho dữ liệu đầu vào.
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email', // Email phải là duy nhất.
            'password' => 'required|string|min:8|confirmed', // Mật khẩu tối thiểu 8 ký tự và phải được xác nhận.
            'role' => ['required', 'string', Rule::in(['admin', 'customer'])], // Vai trò chỉ chấp nhận 'admin' hoặc 'customer'.
        ], [
            // Thông báo lỗi tùy chỉnh.
            'name.required' => 'Tên người dùng là bắt buộc.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email này đã được đăng ký.',
            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
            'role.required' => 'Vai trò là bắt buộc.',
            'role.in' => 'Vai trò không hợp lệ. Chỉ chấp nhận "admin" hoặc "customer".',
        ]);

        if ($validator->fails()) { // Kiểm tra nếu xác thực thất bại.
            return response()->json(['errors' => $validator->errors()], 422); // Trả về lỗi xác thực.
        }

        // Tạo một bản ghi người dùng mới trong cơ sở dữ liệu.
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Mã hóa mật khẩu trước khi lưu.
            'role' => $request->role,
            'email_verified_at' => now(), // Đặt email đã xác minh ngay lập tức cho người dùng được tạo bởi admin.
        ]);

        // Trả về phản hồi JSON thông báo thành công.
        return response()->json(['message' => 'Người dùng đã được tạo thành công.', 'user' => $user], 201);
    }

    /**
     * Hiển thị thông tin một người dùng cụ thể.
     * Xử lý yêu cầu GET đến /api/admin/users/{id}
     *
     * @param  int  $id ID của người dùng cần hiển thị.
     * @return \Illuminate\Http\JsonResponse Trả về dữ liệu người dùng cụ thể.
     */
    public function show($id) // Phương thức này xử lý việc lấy một người dùng theo ID.
    {
        // Lấy thông tin người dùng, tránh trả về mật khẩu.
        $user = User::select('id', 'name', 'email', 'role', 'email_verified_at', 'created_at', 'updated_at')->find($id);

        if (!$user) { // Nếu không tìm thấy người dùng.
            return response()->json(['message' => 'Không tìm thấy người dùng.'], 404); // Trả về lỗi 404.
        }

        return response()->json($user); // Trả về dữ liệu người dùng dưới dạng JSON.
    }

    /**
     * Cập nhật thông tin một người dùng hiện có.
     * Xử lý yêu cầu PUT/PATCH đến /api/admin/users/{id}
     *
     * @param  \Illuminate\Http\Request  $request Dữ liệu yêu cầu từ client.
     * @param  int  $id ID của người dùng cần cập nhật.
     * @return \Illuminate\Http\JsonResponse Trả về thông báo thành công và dữ liệu người dùng đã cập nhật.
     */
    public function update(Request $request, $id) // Phương thức này xử lý việc cập nhật người dùng.
    {
        $user = User::find($id); // Tìm người dùng cần cập nhật bằng ID.

        if (!$user) { // Nếu không tìm thấy người dùng.
            return response()->json(['message' => 'Không tìm thấy người dùng.'], 404);
        }

        // Định nghĩa các quy tắc xác thực cho dữ liệu đầu vào.
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id, // Email phải là duy nhất, bỏ qua chính người dùng này.
            'password' => 'nullable|string|min:8|confirmed', // Mật khẩu có thể rỗng khi cập nhật, nhưng nếu có thì phải hợp lệ.
            'role' => ['required', 'string', Rule::in(['admin', 'customer'])],
        ], [
            // Thông báo lỗi tùy chỉnh.
            'name.required' => 'Tên người dùng là bắt buộc.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email này đã được đăng ký cho người dùng khác.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
            'role.required' => 'Vai trò là bắt buộc.',
            'role.in' => 'Vai trò không hợp lệ. Chỉ chấp nhận "admin" hoặc "customer".',
        ]);

        if ($validator->fails()) { // Kiểm tra nếu xác thực thất bại.
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Cập nhật các thuộc tính của người dùng.
        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;

        // Cập nhật mật khẩu nếu có trong yêu cầu
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save(); // Lưu các thay đổi vào cơ sở dữ liệu.

        // Trả về phản hồi JSON thông báo cập nhật thành công.
        return response()->json(['message' => 'Người dùng đã được cập nhật thành công.', 'user' => $user->only('id', 'name', 'email', 'role', 'email_verified_at', 'created_at', 'updated_at')]);
    }

    /**
     * Xóa một người dùng.
     * Xử lý yêu cầu DELETE đến /api/admin/users/{id}
     *
     * @param  int  $id ID của người dùng cần xóa.
     * @return \Illuminate\Http\JsonResponse Trả về thông báo thành công.
     */
    public function destroy($id) // Phương thức này xử lý việc xóa người dùng.
    {
        $user = User::find($id); // Tìm người dùng cần xóa bằng ID.

        if (!$user) { // Nếu không tìm thấy người dùng.
            return response()->json(['message' => 'Không tìm thấy người dùng.'], 404);
        }

        // Kiểm tra để không cho phép xóa chính người dùng đang đăng nhập (tùy chọn)
        // if (Auth::id() == $id) {
        //     return response()->json(['message' => 'Bạn không thể xóa tài khoản của chính mình.'], 403);
        // }

        $user->delete(); // Xóa bản ghi người dùng khỏi cơ sở dữ liệu.

        return response()->json(['message' => 'Người dùng đã được xóa thành công.'], 200); // Trả về thông báo thành công.
    }

    /**
     * Cập nhật trạng thái xác minh email của người dùng.
     * Xử lý yêu cầu PATCH đến /api/admin/users/{id}/verify-email
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id ID của người dùng.
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleEmailVerification(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'is_verified' => 'required|boolean',
        ], [
            'is_verified.required' => 'Trạng thái xác minh là bắt buộc.',
            'is_verified.boolean' => 'Trạng thái xác minh phải là true hoặc false.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->is_verified) {
            // Đặt email_verified_at về thời điểm hiện tại nếu muốn xác minh
            $user->email_verified_at = now();
            $message = 'Email của người dùng đã được xác minh.';
        } else {
            // Đặt email_verified_at về null nếu muốn hủy xác minh
            $user->email_verified_at = null;
            $message = 'Email của người dùng đã được hủy xác minh.';
        }

        $user->save();

        return response()->json(['message' => $message, 'user' => $user->only('id', 'name', 'email', 'email_verified_at')]);
    }
}
