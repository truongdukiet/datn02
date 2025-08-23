<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Get all dashboard data in a single endpoint
     */
    public function index(): JsonResponse
    {
        \Log::info('Attempting to fetch dashboard data');

        try {
            $data = [
                'summary' => $this->getSummaryStats(),
                'user_growth' => $this->getUserGrowthData(),
                'revenue_data' => $this->getRevenueData(),
                'recent_orders' => $this->getRecentOrdersData(),
                'order_status' => $this->getOrderStatusDistribution(),
                'ratings_summary' => $this->getRatingsSummary(),
                'monthly_sales_2025' => $this->getMonthlySalesData(2025),
                'monthly_revenue_2025' => $this->getMonthlyRevenueData(2025)
            ];

            \Log::info('Dashboard data fetched successfully', ['data' => $data]);

            return response()->json([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            \Log::error('Dashboard ERROR: '.$e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
                'request' => request()->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching dashboard data',
                'error' => config('app.debug') ? [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ] : null
            ], 500);
        }
    }

    /**
     * Get summary statistics
     */
    public function getStats(): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $this->getSummaryStats()
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e);
        }
    }

    /**
     * Get user growth data
     */
    public function getUserGrowth(): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $this->getUserGrowthData()
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e);
        }
    }

    /**
     * Get revenue data
     */
    public function getRevenue(): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $this->getRevenueData()
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e);
        }
    }

    /**
     * Get recent orders
     */
    public function getRecentOrders(): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $this->getRecentOrdersData()
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e);
        }
    }

    /**
     * Get order status distribution
     */
    public function getOrderStatus(): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $this->getOrderStatusDistribution()
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e);
        }
    }

    /************************************
     * PRIVATE HELPER METHODS *
     ************************************/

    private function getSummaryStats(): array
    {
        return [
            'total_users' => User::count(),
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'total_revenue' => (float) Order::where('status', 'completed')->sum('total_amount'),
            'active_users' => User::where('status', 1)->count(),
            'user_growth' => $this->calculateUserGrowth(), // Tăng trưởng người dùng so với tháng trước
            'user_growth_percent' => $this->calculateUserGrowthPercent() // ✅ thêm phần trăm tăng trưởng
        ];
    }

    /**
     * Tính toán tăng trưởng người dùng so với tháng trước (%)
     */
    private function calculateUserGrowth(): float
    {
        $currentMonthUsers = User::whereYear('Created_at', Carbon::now()->year)
            ->whereMonth('Created_at', Carbon::now()->month)
            ->count();

        $previousMonthUsers = User::whereYear('Created_at', Carbon::now()->subMonth()->year)
            ->whereMonth('Created_at', Carbon::now()->subMonth()->month)
            ->count();

        if ($previousMonthUsers === 0) {
            return $currentMonthUsers > 0 ? 100.0 : 0.0;
        }

        return round((($currentMonthUsers - $previousMonthUsers) / $previousMonthUsers) * 100, 2);
    }

    /**
     * Phần trăm tăng trưởng người dùng (riêng biệt)
     */
    private function calculateUserGrowthPercent(): float
    {
        $currentMonthUsers = User::whereYear('Created_at', Carbon::now()->year)
            ->whereMonth('Created_at', Carbon::now()->month)
            ->count();

        $previousMonthUsers = User::whereYear('Created_at', Carbon::now()->subMonth()->year)
            ->whereMonth('Created_at', Carbon::now()->subMonth()->month)
            ->count();

        if ($previousMonthUsers === 0) {
            return $currentMonthUsers > 0 ? 100.0 : 0.0;
        }

        return round((($currentMonthUsers - $previousMonthUsers) / $previousMonthUsers) * 100, 2);
    }

    private function getUserGrowthData(): array
    {
        return User::select([
                DB::raw('DATE_FORMAT(Created_at, "%Y-%m") as month'),
                DB::raw('COUNT(*) as count')
            ])
            ->where('Created_at', '>=', now()->subMonths(12)) // Lấy dữ liệu 12 tháng thay vì 6 tháng
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'count' => $item->count
                ];
            })
            ->toArray();
    }

    private function getRevenueData(): array
    {
        return Order::select([
                DB::raw('DATE_FORMAT(Create_at, "%Y-%m") as month'),
                DB::raw('SUM(Total_amount) as amount')
            ])
            ->where('Status', 'completed')
            ->where('Create_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'amount' => (float) $item->amount
                ];
            })
            ->toArray();
    }

    private function getRecentOrdersData(): array
    {
        return Order::with(['user:UserID,username'])
            ->select(['OrderID', 'UserID', 'Status', 'Total_amount', 'Create_at'])
            ->orderBy('Create_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->OrderID,
                    'customer_name' => $order->Receiver_name,
                    'status' => $order->Status,
                    'total_amount' => (float) $order->Total_amount,
                    'created_at' => $order->Create_at ? Carbon::parse($order->Create_at)->format('Y-m-d H:i:s') : null
                ];
            })
            ->toArray();
    }

    private function getOrderStatusDistribution(): array
    {
        return Order::select([
                'status',
                DB::raw('COUNT(*) as count')
            ])
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();
    }

    private function getRatingsSummary(): array
    {
        $totalRatings = Review::count();
        $averageRating = Review::avg('Star_rating');
        $distribution = Review::select('Star_rating', DB::raw('COUNT(*) as count'))
            ->groupBy('Star_rating')
            ->orderBy('Star_rating', 'desc')
            ->get()
            ->pluck('count', 'Star_rating')
            ->toArray();

        for ($i = 1; $i <= 5; $i++) {
            if (!isset($distribution[$i])) {
                $distribution[$i] = 0;
            }
        }

        return [
            'average' => (float) number_format($averageRating, 1),
            'total' => (int) $totalRatings,
            'distribution' => $distribution
        ];
    }

    private function getMonthlySalesData(int $year): array
    {
        $salesData = Order::select([
                DB::raw('MONTH(Create_at) as month'),
                DB::raw('COUNT(*) as count')
            ])
            ->whereYear('Create_at', $year)
            ->where('Status', 'completed')
            ->groupBy(DB::raw('MONTH(Create_at)'))
            ->orderBy('month')
            ->get();

        $monthlyCounts = array_fill(0, 12, 0);

        foreach ($salesData as $item) {
            $monthIndex = (int) $item->month - 1;
            $monthlyCounts[$monthIndex] = $item->count;
        }

        return $monthlyCounts;
    }

    private function getMonthlyRevenueData(int $year): array
    {
        $revenueData = Order::select([
                DB::raw('MONTH(Create_at) as month'),
                DB::raw('SUM(Total_amount) as amount')
            ])
            ->whereYear('Create_at', $year)
            ->where('Status', 'completed')
            ->groupBy(DB::raw('MONTH(Create_at)'))
            ->orderBy('month')
            ->get();

        $monthlyAmounts = array_fill(0, 12, 0.0);

        foreach ($revenueData as $item) {
            $monthIndex = (int) $item->month - 1;
            $monthlyAmounts[$monthIndex] = (float) $item->amount;
        }

        return $monthlyAmounts;
    }

    private function handleError(\Exception $e): JsonResponse
    {
        \Log::error('DashboardController Error: ' . $e->getMessage(), [
            'exception' => $e,
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'An error occurred while fetching dashboard data',
            'error' => config('app.debug') ? $e->getMessage() : null
        ], 500);
    }
}
