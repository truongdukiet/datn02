<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */

    public function store(Request $request)
    {
        $request->validate([
            'Fullname' => ['required', 'string', 'max:255'],
            'Username' => ['required', 'string', 'max:255', 'unique:users,Username'],
            'Email' => ['required', 'email', 'unique:users,Email'],
            'Password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'Fullname' => $request->Fullname,
            'Username' => $request->Username,
            'Email' => $request->Email,
            'Password' => Hash::make($request->Password),
            'email_verified_at' => null,
        ]);

        // Tạo token xác thực ngẫu nhiên và lưu vào database
        $verificationToken = Str::random(64);
        
        // Lưu token vào bảng password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->Email],
            [
                'email' => $user->Email,
                'token' => $verificationToken,
                'created_at' => now(),
            ]
        );

        // Tạo link xác thực với ID và token ngẫu nhiên
        $verificationUrl = url('/verify-email/' . $user->UserID . '/' . $verificationToken);

        // Gửi mail xác thực thủ công
        Mail::raw(
            "Chào {$user->Fullname},\n\nVui lòng nhấn vào link sau để xác thực tài khoản:\n$verificationUrl\n\nSau khi xác thực thành công, bạn sẽ được chuyển đến trang đăng nhập.",
            function ($message) use ($user) {
                $message->to($user->Email)
                        ->subject('Xác thực tài khoản - NextGen');
            }
        );

        event(new Registered($user));

        // Redirect về trang đăng nhập với thông báo
        return redirect()->route('login')->with('success', 'Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.');
    }
    /**
     * Show the registration form.
     */
    public function create(): Response
    {
        return response()->view('auth.register');
    }
}
