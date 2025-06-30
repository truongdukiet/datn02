<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Hiển thị trang dashboard của admin.
     * Đây là trang chủ của khu vực quản trị.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        // Trả về view 'admin.dashboard'.
        // View này sẽ hiển thị nội dung chính của trang dashboard.
        return view('admin.dashboard');
    }
}
