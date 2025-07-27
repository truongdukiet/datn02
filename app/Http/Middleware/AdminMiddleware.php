<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth; // Rất quan trọng để import Auth facade

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (!Auth::check()) {
            // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
            return redirect('/login'); // Hoặc route login của bạn
        }

        // Kiểm tra xem người dùng có phải là admin không
        // Giả sử cột 'is_admin' trong bảng users là 1 nếu là admin
        // Bạn cần đảm bảo model User của bạn có cột 'is_admin'
        if (!Auth::user()->is_admin) {
            // Nếu không phải admin, chuyển hướng hoặc trả về lỗi
            abort(403, 'Unauthorized action.'); // Hoặc redirect('/home')
        }

        return $next($request);
    }
}
