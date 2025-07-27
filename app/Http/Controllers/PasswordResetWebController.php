<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use App\Models\User;

class PasswordResetWebController extends Controller
{
    /**
     * Hiển thị form quên mật khẩu
     */
    public function showForgotPasswordForm()
    {
        return view('auth.forgot-password');
    }

    /**
     * Xử lý gửi email reset password
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('Email', $request->email)->first();
        
        if (!$user) {
            return back()->withErrors([
                'email' => 'Email không tồn tại trong hệ thống.'
            ]);
        }

        // Tạo token reset
        $token = Str::random(64);
        
        // Lưu token vào bảng password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->Email],
            [
                'email' => $user->Email,
                'token' => $token,
                'created_at' => now(),
            ]
        );

        // Tạo link reset
        $resetUrl = url("/reset-password/{$user->UserID}/{$token}");
        
        // Gửi mail thủ công
        Mail::raw(
            "Chào {$user->Fullname},\n\nVui lòng nhấn vào link sau để đặt lại mật khẩu:\n$resetUrl\n\nLink này có hiệu lực trong 60 phút.\n\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.",
            function ($message) use ($user) {
                $message->to($user->Email)
                        ->subject('Đặt lại mật khẩu - NextGen');
            }
        );

        return back()->with('success', 'Đã gửi email hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.');
    }

    /**
     * Hiển thị form đặt lại mật khẩu
     */
    public function showResetPasswordForm($id, $token)
    {
        $user = User::findOrFail($id);
        
        // Kiểm tra token có hợp lệ không
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $user->Email)
            ->where('token', $token)
            ->first();

        if (!$resetRecord) {
            return redirect('/forgot-password')->with('error', 'Liên kết không hợp lệ hoặc đã hết hạn.');
        }

        // Kiểm tra token có quá 60 phút không
        $createdAt = \Carbon\Carbon::parse($resetRecord->created_at);
        if ($createdAt->diffInMinutes(now()) > 60) {
            DB::table('password_reset_tokens')
                ->where('email', $user->Email)
                ->delete();
            return redirect('/forgot-password')->with('error', 'Liên kết đã hết hạn. Vui lòng yêu cầu gửi lại email.');
        }

        return view('auth.reset-password', compact('user', 'token'));
    }

    /**
     * Xử lý đặt lại mật khẩu
     */
    public function resetPassword(Request $request, $id, $token)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::findOrFail($id);
        
        // Kiểm tra token có hợp lệ không
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $user->Email)
            ->where('token', $token)
            ->first();

        if (!$resetRecord) {
            return redirect('/forgot-password')->with('error', 'Liên kết không hợp lệ hoặc đã hết hạn.');
        }

        // Kiểm tra token có quá 60 phút không
        $createdAt = \Carbon\Carbon::parse($resetRecord->created_at);
        if ($createdAt->diffInMinutes(now()) > 60) {
            DB::table('password_reset_tokens')
                ->where('email', $user->Email)
                ->delete();
            return redirect('/forgot-password')->with('error', 'Liên kết đã hết hạn. Vui lòng yêu cầu gửi lại email.');
        }

        // Cập nhật mật khẩu mới
        $user->Password = Hash::make($request->password);
        $user->save();

        // Xóa token sau khi dùng
        DB::table('password_reset_tokens')
            ->where('email', $user->Email)
            ->delete();

        return redirect('/login')->with('success', 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.');
    }
} 