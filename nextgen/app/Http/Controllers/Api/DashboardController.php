<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
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
    \Log::info('Attempting to fetch dashboard data'); // Thêm dòng này
    
    try {
        $data = [
            'summary' => $this->getSummaryStats(),
            'user_growth' => $this->getUserGrowthData(),
            'revenue_data' => $this->getRevenueData(),
            'recent_orders' => $this->getRecentOrdersData(),
            'order_status' => $this->getOrderStatusDistribution()
        ];

        \Log::info('Dashboard data fetched successfully', ['data' => $data]); // Thêm dòng này
        
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
            'active_users' => User::where('status', 1)->count()
        ];
    }

    private function getUserGrowthData(): array
    {
        return User::select([
                DB::raw('DATE_FORMAT(Created_at, "%Y-%m") as month'), // Sửa thành Created_at
                DB::raw('COUNT(*) as count')
            ])
            ->where('Created_at', '>=', now()->subMonths(6)) // Sửa ở đây
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::createFromFormat('Y-m', $item->month)->format('M Y'),
                    'count' => $item->count
                ];
            })
            ->toArray();
    }

    private function getRevenueData(): array
    {
        return Order::select([
                DB::raw('DATE_FORMAT(Create_at, "%Y-%m") as month'), // Sửa created_at -> Create_at
                DB::raw('SUM(Total_amount) as amount') // Đảm bảo viết hoa Total_amount
            ])
            ->where('Status', 'completed') // Đảm bảo viết hoa Status
            ->where('Create_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::createFromFormat('Y-m', $item->month)->format('M Y'),
                    'amount' => (float) $item->amount
                ];
            })
            ->toArray();
    }

    private function getRecentOrdersData(): array
    {
        return Order::with(['user:UserID,username'])
            ->select(['OrderID', 'UserID', 'Status', 'Total_amount', 'Create_at']) // Sửa tên cột
            ->orderBy('Create_at', 'desc') // Sửa ở đây
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->OrderID,
                    'customer_name' => $order->Receiver_name, // Sử dụng Receiver_name thay vì user->name
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