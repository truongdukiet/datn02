<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function getStats()
    {
        // Lấy dữ liệu thật từ database của bạn tại đây
        // Ví dụ:
        // $totalUsers = User::count();
        // $totalOrders = Order::count();
        // $totalRevenue = Order::where('status', 'completed')->sum('total_price');

        // Hiện tại, tôi sẽ dùng dữ liệu giả để bạn thấy giao diện hoạt động
        $stats = [
            'totalUsers' => 1250,
            'totalOrders' => 42,
            'totalRevenue' => 55000000,
            'newProducts' => 10,
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }
}
