<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// Không cần import Product model ở đây nữa vì React sẽ fetch dữ liệu qua API
// use App\Models\Product;

/**
 * HomeController
 *
 * Controller này quản lý logic cho trang chủ của ứng dụng.
 * Khi tích hợp React, nó sẽ trả về một Blade view đóng vai trò là container cho ứng dụng React.
 */
class HomeController extends Controller
{
    /**
     * Hiển thị trang chủ của ứng dụng.
     *
     * Phương thức này sẽ được gọi khi người dùng truy cập vào đường dẫn gốc (/).
     * Nó trả về một Blade view đơn giản chứa một div để ứng dụng React mount vào.
     *
     * @return \Illuminate\Contracts\View\View Trả về một Blade view.
     */
    public function index()
    {
        // Khi sử dụng React ở frontend, controller này chỉ cần trả về một view
        // mà sẽ là "điểm vào" (entry point) cho ứng dụng React của bạn.
        // Dữ liệu sẽ được React fetch thông qua các API endpoints của Laravel.
        return view('react_app_container'); // Trả về một view mới, ví dụ: react_app_container.blade.php
    }

    // Các phương thức khác của controller (nếu có)
}

