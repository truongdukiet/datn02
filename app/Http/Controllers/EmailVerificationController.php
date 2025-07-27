<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmailVerificationController extends Controller
{
    /**
     * Xác thực email và redirect đến trang thành công
     */
    public function verify(Request $request, $id, $token)
    {
        $user = User::findOrFail($id);

        // Kiểm tra token có hợp lệ không
        $verificationRecord = DB::table('password_reset_tokens')
            ->where('email', $user->Email)
            ->where('token', $token)
            ->first();

        if (!$verificationRecord) {
            return redirect('/verify-email-error')->with('error', 'Liên kết không hợp lệ hoặc đã hết hạn.');
        }

        // Kiểm tra email đã được verify chưa
        if ($user->hasVerifiedEmail()) {
            return redirect('/verify-email-success')->with('message', 'Tài khoản đã được kích hoạt trước đó.');
        }

        // Mark email as verified
        $user->markEmailAsVerified();
        event(new Verified($user));

        // Xóa token sau khi verify thành công
        DB::table('password_reset_tokens')
            ->where('email', $user->Email)
            ->delete();

        // Redirect đến trang thành công
        return redirect('/verify-email-success')->with('message', 'Tài khoản đã được kích hoạt thành công!');
    }

    /**
     * Hiển thị trang thành công
     */
    public function success()
    {
        $message = session('message', 'Tài khoản đã được kích hoạt thành công!');
        return view('auth.verify-email-success', compact('message'));
    }

    /**
     * Hiển thị trang lỗi
     */
    public function error()
    {
        $error = session('error', 'Có lỗi xảy ra trong quá trình xác thực.');
        return view('auth.verify-email-error', compact('error'));
    }
} 