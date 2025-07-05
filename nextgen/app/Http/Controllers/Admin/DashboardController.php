<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; // Import Model User
use App\Models\Category; // Import Model Category
use App\Models\Product; // Import Model Product
use App\Models\Order; // Import Model Order
use App\Models\Voucher; // Import Model Voucher

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
        // Lấy các thống kê tổng quan từ database
        $totalUsers = User::count();
        $totalCategories = Category::count();
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $pendingOrders = Order::where('Status', 'pending')->count(); // Giả sử có trạng thái 'pending'
        $totalVouchers = Voucher::count();

        // Trả về view 'admin.dashboard' và truyền dữ liệu thống kê
        return view('admin.dashboard', compact(
            'totalUsers',
            'totalCategories',
            'totalProducts',
            'totalOrders',
            'pendingOrders',
            'totalVouchers'
        ));
    }
}
