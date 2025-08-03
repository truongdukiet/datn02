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

        $verificationToken = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->Email],
            [
                'email' => $user->Email,
                'token' => $verificationToken,
                'created_at' => now(),
            ]
        );

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:8080');
        $verificationUrl = $frontendUrl . '/verify-email?userId=' . $user->UserID . '&token=' . $verificationToken;

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
                'Phone' => $user->Phone,
                'Address' => $user->Address,
                'Role' => $user->Role
            ]
        ]);
    }

    public function verifyEmail($userId, $token)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Người dùng không tồn tại.'
            ], 404);
        }

        $row = DB::table('password_reset_tokens')->where('email', $user->Email)->first();
        if (!$row || $row->token !== $token) {
            return response()->json([
                'success' => false,
                'message' => 'Token không hợp lệ hoặc đã hết hạn.'
            ], 400);
        }

        $user->email_verified_at = now();
        $user->save();

        DB::table('password_reset_tokens')->where('email', $user->Email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xác thực email thành công!'
        ]);
    }

    // ✅ Cập nhật thông tin tài khoản
    public function updateProfile(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Người dùng không tồn tại'], 404);
        }

        $validator = Validator::make($request->all(), [
            'Fullname' => 'nullable|string|max:255',
            'Phone' => 'nullable|string|max:20',
            'Address' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Dữ liệu không hợp lệ', 'errors' => $validator->errors()], 422);
        }

        $user->Fullname = $request->Fullname ?? $user->Fullname;
        $user->Phone = $request->Phone ?? $user->Phone;
        $user->Address = $request->Address ?? $user->Address;
        $user->Updated_at = now();
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thông tin thành công',
            'data' => $user
        ]);
    }
}
