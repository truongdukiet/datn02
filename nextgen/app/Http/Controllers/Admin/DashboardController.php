<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Có thể cần để truy vấn database

class DashboardController extends Controller
{
    /**
     * Lấy dữ liệu thống kê chung cho Dashboard.
     * Đây là API được gọi từ Vue.js để hiển thị các thẻ thống kê.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStats()
    {
        // Trong ứng dụng thực tế, bạn sẽ lấy dữ liệu từ database ở đây.
        // Ví dụ:
        // $totalProducts = Product::count();
        // $newOrders = Order::where('created_at', '>=', now()->subDays(7))->count();
        // $revenue = Order::sum('total_amount');
        // $customers = User::where('role', 'customer')->count();

        // Dữ liệu mẫu (demo) để khớp với frontend Vue.js của bạn
        $data = [
            'totalProducts' => 150, // Ví dụ: 150 sản phẩm
            'newOrders' => 25,      // Ví dụ: 25 đơn hàng mới
            'revenue' => '₫125,000,000', // Ví dụ: 125 triệu VND
            'customers' => 78       // Ví dụ: 78 khách hàng
        ];

        return response()->json($data);
    }

    /**
     * Lấy dữ liệu hoạt động gần đây.
     * Đây là API được gọi từ Vue.js để hiển thị bảng hoạt động.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRecentActivities()
    {
        // Trong ứng dụng thực tế, bạn sẽ lấy dữ liệu từ database ở đây.
        // Ví dụ: Lấy 5 hoạt động gần nhất từ bảng logs hoặc order history.
        // $activities = ActivityLog::orderBy('created_at', 'desc')->take(5)->get();

        // Dữ liệu mẫu (demo) để khớp với frontend Vue.js của bạn
        $data = [
            [
                'customer' => 'Nguyễn Văn A',
                'action' => 'Đặt hàng mới',
                'date' => '2024-07-20',
                'statusText' => 'Hoàn tất',
                'statusClass' => 'done'
            ],
            [
                'customer' => 'Trần Thị B',
                'action' => 'Thêm sản phẩm vào giỏ',
                'date' => '2024-07-19',
                'statusText' => 'Chưa xử lý',
                'statusClass' => 'pending'
            ],
            [
                'customer' => 'Lê Văn C',
                'action' => 'Đăng ký tài khoản',
                'date' => '2024-07-18',
                'statusText' => 'Kích hoạt',
                'statusClass' => 'active'
            ],
            [
                'customer' => 'Phạm Thị D',
                'action' => 'Hủy đơn hàng',
                'date' => '2024-07-17',
                'statusText' => 'Hoàn tất', // Trạng thái của hành động hủy
                'statusClass' => 'done'
            ],
        ];

        return response()->json($data);
    }

    /**
     * Lấy dữ liệu thống kê sản phẩm theo loại cho biểu đồ.
     * Đây là API được gọi từ Vue.js để vẽ biểu đồ bánh.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategoryStats()
    {
        // Trong ứng dụng thực tế, bạn sẽ truy vấn database để lấy số lượng sản phẩm theo từng danh mục.
        // Ví dụ:
        // $categoryCounts = DB::table('products')
        //     ->join('categories', 'products.category_id', '=', 'categories.id')
        //     ->select('categories.name as label', DB::raw('count(products.id) as data'))
        //     ->groupBy('categories.name')
        //     ->get();
        // $labels = $categoryCounts->pluck('label')->toArray();
        // $data = $categoryCounts->pluck('data')->toArray();

        // Dữ liệu mẫu (demo) để khớp với frontend Vue.js của bạn
        $data = [
            'labels' => ['Ghế sofa', 'Bàn ăn', 'Tủ quần áo', 'Bàn làm việc'],
            'data' => [25, 35, 20, 20] // Số liệu ví dụ
        ];

        return response()->json($data);
    }
}
