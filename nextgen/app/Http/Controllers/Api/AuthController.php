<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // Đăng ký
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Fullname' => 'required|string|max:255',
            'Username' => 'required|string|max:255|unique:users,Username',
            'Email' => 'required|email|unique:users,Email',
            'Password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

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
        $frontendUrl = 'http://localhost:5173'; // Đổi thành domain/frontend thực tế nếu deploy
        $verificationUrl = $frontendUrl . '/verify-email/' . $user->UserID . '/' . $verificationToken;

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
    }

    // Đăng nhập
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login' => 'required|string',
            'Password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $login = $request->login;
        $user = filter_var($login, FILTER_VALIDATE_EMAIL)
            ? User::where('Email', $login)->first()
            : User::where('Username', $login)->first();

        if (!$user || !Hash::check($request->Password, $user->Password)) {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản hoặc mật khẩu không đúng.'
            ], 401);
        }

        if (is_null($user->email_verified_at)) {
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
                'UserID' => $user->UserID,
                'Fullname' => $user->Fullname,
                'Username' => $user->Username,
                'Email' => $user->Email,
                'Role' => $user->Role // Đúng chữ hoa
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
    }
}
