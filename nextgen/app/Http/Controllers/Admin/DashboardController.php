<?php

namespace App\Http\Controllers\Api; // Đã thay đổi namespace thành Api

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
     * Hiển thị trang dashboard của admin dưới dạng API JSON.
     * Trả về các số liệu thống kê tổng quan.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Lấy các thống kê tổng quan từ database
            $totalUsers = User::count();
            $totalCategories = Category::count();
            $totalProducts = Product::count();
            $totalOrders = Order::count();
            $pendingOrders = Order::where('Status', 'pending')->count(); // Giả sử có trạng thái 'pending'
            $totalVouchers = Voucher::count();

            // Trả về dữ liệu thống kê dưới dạng JSON
            return response()->json([
                'totalUsers' => $totalUsers,
                'totalCategories' => $totalCategories,
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'totalVouchers' => $totalVouchers
            ]);
        } catch (\Exception $e) {
            // Bắt các lỗi và trả về JSON với mã trạng thái 500 Internal Server Error
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi lấy dữ liệu dashboard.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
