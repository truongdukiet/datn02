<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; // Quan trọng: Import Model User để tương tác với bảng users
use Illuminate\Support\Facades\Hash; // Để mã hóa mật khẩu người dùng
use Illuminate\Validation\Rule; // Để sử dụng quy tắc xác thực unique khi cập nhật email

class UserController extends Controller
{
    /**
     * Hiển thị danh sách tất cả người dùng.
     * Phương thức này sẽ lấy dữ liệu từ bảng 'users' và truyền sang view.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        // Lấy tất cả người dùng từ cơ sở dữ liệu và phân trang (ví dụ: 10 người dùng mỗi trang)
        $users = User::paginate(10);

        // Trả về view 'admin.users.index' và truyền biến $users vào đó
        return view('admin.users.index', compact('users'));
    }

    /**
     * Hiển thị form để tạo một người dùng mới.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        // Trả về view 'admin.users.create' chứa form thêm người dùng
        return view('admin.users.create');
    }

    /**
     * Lưu thông tin người dùng mới vào cơ sở dữ liệu.
     * Phương thức này nhận dữ liệu từ form tạo người dùng.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Xác thực dữ liệu đầu vào từ request
        $request->validate([
            'name' => 'required|string|max:255', // Tên là bắt buộc, kiểu chuỗi, tối đa 255 ký tự
            'email' => 'required|string|email|max:255|unique:users', // Email là bắt buộc, phải là định dạng email, duy nhất trong bảng 'users'
            'password' => 'required|string|min:8|confirmed', // Mật khẩu là bắt buộc, tối thiểu 8 ký tự, phải khớp với 'password_confirmation'
            'role' => 'required|string|in:admin,user', // Vai trò là bắt buộc, chỉ chấp nhận 'admin' hoặc 'user'
            'Status' => 'boolean', // Trạng thái là kiểu boolean (true/false hoặc 1/0)
        ]);

        // Tạo một bản ghi người dùng mới trong cơ sở dữ liệu
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Mã hóa mật khẩu trước khi lưu vào DB để bảo mật
            'role' => $request->role,
            'Status' => $request->Status ?? 0, // Nếu Status không được gửi, mặc định là 0 (inactive)
            'Create_at' => now(), // Ghi lại thời gian tạo
            'Update_at' => now(), // Ghi lại thời gian cập nhật (ban đầu giống thời gian tạo)
        ]);

        // Chuyển hướng về trang danh sách người dùng với thông báo thành công
        return redirect()->route('admin.users.index')->with('success', 'Người dùng đã được tạo thành công.');
    }

    /**
     * Hiển thị chi tiết một người dùng cụ thể.
     * (Thường không cần một trang riêng cho admin nếu có trang chỉnh sửa,
     * nhưng vẫn hữu ích để xem thông tin chi tiết mà không cần chỉnh sửa.)
     *
     * @param  \App\Models\User  $user (Laravel tự động tìm người dùng dựa trên ID từ URL)
     * @return \Illuminate\View\View
     */
    public function show(User $user)
    {
        // Trả về view 'admin.users.show' và truyền biến $user vào đó
        return view('admin.users.show', compact('user'));
    }

    /**
     * Hiển thị form để chỉnh sửa thông tin của một người dùng hiện có.
     *
     * @param  \App\Models\User  $user (Laravel tự động tìm người dùng dựa trên ID từ URL)
     * @return \Illuminate\View\View
     */
    public function edit(User $user)
    {
        // Trả về view 'admin.users.edit' chứa form chỉnh sửa và truyền biến $user vào đó
        return view('admin.users.edit', compact('user'));
    }

    /**
     * Cập nhật thông tin của người dùng trong cơ sở dữ liệu.
     * Phương thức này nhận dữ liệu từ form chỉnh sửa.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user (Laravel tự động tìm người dùng dựa trên ID từ URL)
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, User $user)
    {
        // Xác thực dữ liệu đầu vào từ request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                // Quy tắc này đảm bảo email là duy nhất, nhưng bỏ qua email của chính người dùng đang được chỉnh sửa
                Rule::unique('users', 'email')->ignore($user->UserID, 'UserID'),
            ],
            'password' => 'nullable|string|min:8|confirmed', // Mật khẩu là tùy chọn khi cập nhật, nếu có thì phải khớp
            'role' => 'required|string|in:admin,user',
            'Status' => 'boolean',
        ]);

        // Cập nhật các trường thông tin người dùng
        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->Status = $request->Status ?? 0;
        $user->Update_at = now(); // Cập nhật thời gian cuối cùng được chỉnh sửa

        // Chỉ cập nhật mật khẩu nếu người dùng có nhập mật khẩu mới
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password); // Mã hóa mật khẩu mới
        }

        // Lưu các thay đổi vào cơ sở dữ liệu
        $user->save();

        // Chuyển hướng về trang danh sách người dùng với thông báo thành công
        return redirect()->route('admin.users.index')->with('success', 'Người dùng đã được cập nhật thành công.');
    }

    /**
     * Xóa một người dùng khỏi cơ sở dữ liệu.
     *
     * @param  \App\Models\User  $user (Laravel tự động tìm người dùng dựa trên ID từ URL)
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(User $user)
    {
        // Bạn có thể thêm logic kiểm tra ở đây trước khi xóa,
        // ví dụ: kiểm tra xem người dùng có đơn hàng nào không để tránh lỗi khóa ngoại.
        // if ($user->orders()->count() > 0) {
        //     return redirect()->back()->with('error', 'Không thể xóa người dùng này vì có đơn hàng liên quan.');
        // }

        // Xóa người dùng khỏi cơ sở dữ liệu
        $user->delete();

        // Chuyển hướng về trang danh sách người dùng với thông báo thành công
        return redirect()->route('admin.users.index')->with('success', 'Người dùng đã được xóa thành công.');
    }
}
