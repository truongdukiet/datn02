<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
<<<<<<< HEAD
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Import Log facade để debug
=======
>>>>>>> 9fafedae1209f6840e5017e438b1a31e8fd3e950

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): Response
    {
        $request->authenticate();

        $request->session()->regenerate();

<<<<<<< HEAD
        $user = User::create([
            'Fullname' => $request->Fullname,
            'Username' => $request->Username,
            'Email' => $request->Email,
            'Password' => Hash::make($request->Password),
            'email_verified_at' => null,
        ]);

        // Tạo token xác thực ngẫu nhiên và lưu vào database
        $verificationToken = Str::random(64);

        // Lưu token vào bảng password_reset_tokens (tái sử dụng bảng này cho email verification)
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->Email],
            [
                'email' => $user->Email,
                'token' => $verificationToken,
                'created_at' => now(),
            ]
        );

        // Tạo link xác thực với ID và token ngẫu nhiên
        // Đảm bảo biến môi trường FRONTEND_URL được cấu hình đúng trong .env
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        // SỬA ĐỔI TẠI ĐÂY: Tạo URL với path parameters thay vì query parameters
        $verificationUrl = $frontendUrl . '/verify-email/' . $user->id . '/' . $verificationToken;

        // Gửi mail xác thực thủ công
        Mail::raw(
            "Chào {$user->Fullname},\n\nVui lòng nhấn vào link sau để xác thực tài khoản:\n$verificationUrl\n\nSau khi xác thực thành công, bạn sẽ được chuyển đến trang đăng nhập.",
            function ($message) use ($user) {
                $message->to($user->Email)
                        ->subject('Xác thực tài khoản - NextGen');
            }
        );

        return response()->json([
            'success' => true,
            'message' => 'Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.'
        ]);
=======
        return response()->noContent();
>>>>>>> 9fafedae1209f6840e5017e438b1a31e8fd3e950
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
<<<<<<< HEAD
        // Debug: Ghi log dữ liệu request nhận được
        // BỎ COMMENT DÒNG DƯỚI ĐỂ XEM DỮ LIỆU MÀ LARAVEL NHẬN ĐƯỢC TỪ REACT
        // dd($request->all()); // Tạm thời dừng và hiển thị dữ liệu request để debug

        // Validate incoming request data
        // Validator này linh hoạt hơn, chấp nhận cả chữ thường và chữ hoa cho các trường
        $validator = Validator::make($request->all(), [
            'login' => 'sometimes|string',    // Có thể là 'login' (chữ thường)
            'Login' => 'sometimes|string',    // Hoặc 'Login' (chữ hoa)
            'password' => 'sometimes|string', // Có thể là 'password' (chữ thường)
            'Password' => 'sometimes|string', // Hoặc 'Password' (chữ hoa)
        ]);
=======
        Auth::guard('web')->logout();
>>>>>>> 9fafedae1209f6840e5017e438b1a31e8fd3e950

        $request->session()->invalidate();

<<<<<<< HEAD
        // Kiểm tra xem ít nhất một trường định danh (login/Login) có được gửi không
        if (!$request->has('login') && !$request->has('Login')) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng cung cấp tên đăng nhập hoặc email.',
                'errors' => ['login' => ['Tên đăng nhập hoặc email là bắt buộc.']]
            ], 422);
        }

        // Kiểm tra xem ít nhất một trường mật khẩu (password/Password) có được gửi không
        if (!$request->has('password') && !$request->has('Password')) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng cung cấp mật khẩu.',
                'errors' => ['password' => ['Mật khẩu là bắt buộc.']]
            ], 422);
        }

        // Xác định giá trị thực của trường đăng nhập và mật khẩu, ưu tiên chữ thường
        $login = $request->input('login') ?? $request->input('Login');
        $password = $request->input('password') ?? $request->input('Password');

        // Tiếp tục logic đăng nhập
        $user = filter_var($login, FILTER_VALIDATE_EMAIL)
            ? User::where('Email', $login)->first()
            : User::where('Username', $login)->first();

        // Debug: Ghi log thông tin user tìm được
        // Log::info('User found:', ['user_email' => $user ? $user->Email : 'Not found']);
        // dd($user); // Tạm thời dừng và hiển thị thông tin user để debug

        // Đảm bảo cột mật khẩu trong DB là 'password' (chữ thường)
        if (!$user || !Hash::check($password, $user->password)) { // Sử dụng biến $password đã xác định
            // Log lỗi đăng nhập
            // Log::warning('Login failed: Invalid credentials', ['login_attempt' => $login]);
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản hoặc mật khẩu không đúng.'
            ], 401);
        }

        // Đảm bảo cột email_verified_at khớp chính xác với database của bạn
        if (is_null($user->email_verified_at)) {
            // Log lỗi tài khoản chưa kích hoạt
            // Log::warning('Login failed: Account not verified', ['user_email' => $user->Email]);
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                'UserID' => $user->id, // Laravel mặc định dùng 'id' làm khóa chính
                                       // Nếu khóa chính của bạn là 'UserID', bạn cần khai báo trong User model:
                                       // protected $primaryKey = 'UserID';
                'Fullname' => $user->Fullname,
                'Username' => $user->Username,
                'Email' => $user->Email,
                'Role' => $user->Role // Đảm bảo tên cột 'Role' khớp với database (có thể là 'role' chữ thường)
            ]
        ]);
    }

    public function verifyEmail($userId, $token)
    {
        // Tìm user theo ID
        $user = \App\Models\User::find($userId);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Người dùng không tồn tại.'
            ], 404);
        }

        // Lấy token từ bảng password_reset_tokens
        $row = \Illuminate\Support\Facades\DB::table('password_reset_tokens')->where('email', $user->Email)->first();
        if (!$row || $row->token !== $token) {
            return response()->json([
                'success' => false,
                'message' => 'Token không hợp lệ hoặc đã hết hạn.'
            ], 400);
        }

        // Đánh dấu email đã xác thực
        $user->email_verified_at = now();
        $user->save();

        // Xoá token sau khi xác thực thành công
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->where('email', $user->Email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xác thực email thành công!'
        ]);
=======
        $request->session()->regenerateToken();

        return response()->noContent();
>>>>>>> 9fafedae1209f6840e5017e438b1a31e8fd3e950
    }
}
