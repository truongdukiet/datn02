import React, { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
} from 'chart.js';
import axios from 'axios';
import { Spinner, Alert, Card, Row, Col, Table, Badge } from 'react-bootstrap';
import { Rate, Statistic, Progress } from 'antd';
import {
    FaUsers,
    FaBox,
    FaShoppingCart,
    FaDollarSign,
    FaStar,
    FaWarehouse,
    FaChartLine,
    FaMoneyBillWave,
    FaClipboardList,
    FaStarHalfAlt,
    FaExclamationTriangle,
    FaCalendarAlt,
    FaTags,
    FaChartBar,
    FaChartArea,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
);

// Ngưỡng cảnh báo tồn kho thấp
const LOW_STOCK_THRESHOLD = 10;
const API_BASE_URL = 'http://localhost:8000/api';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        summary: {},
        userGrowth: [],
        revenueData: [],
        recentOrders: [],
        orderStatus: {},
        ratings: { average: 0, total: 0, distribution: {} },
        lowStockProducts: [],
        monthlySales: [],
        monthlyRevenue: [],
        topInventoryProducts: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Sử dụng một API duy nhất để lấy tất cả dữ liệu
                const res = await axios.get(`${API_BASE_URL}/dashboard`);
                const data = res.data?.data || {};

                // Kiểm tra và xử lý dữ liệu monthly_sales_2025 và monthly_revenue_2025
                let monthlySalesData = data.monthly_sales_2025 || [];
                let monthlyRevenueData = data.monthly_revenue_2025 || [];

                // Nếu dữ liệu không phải là mảng 12 phần tử, tạo mảng mặc định
                if (!Array.isArray(monthlySalesData) || monthlySalesData.length !== 12) {
                    monthlySalesData = new Array(12).fill(0);
                }

                if (!Array.isArray(monthlyRevenueData) || monthlyRevenueData.length !== 12) {
                    monthlyRevenueData = new Array(12).fill(0);
                }

                // Cập nhật state với dữ liệu từ API
                setDashboardData(prevState => ({
                    ...prevState,
                    summary: data.summary || {},
                    userGrowth: data.user_growth || [],
                    revenueData: data.revenue_data || [],
                    recentOrders: data.recent_orders || [],
                    orderStatus: data.order_status || {},
                    ratings: data.ratings_summary || { average: 0, total: 0, distribution: {} },
                    monthlySales: monthlySalesData,
                    monthlyRevenue: monthlyRevenueData
                }));

                // Lấy dữ liệu sản phẩm để tính tồn kho (bao gồm cả variants)
                const productsRes = await axios.get(`${API_BASE_URL}/products`);
                const products = productsRes.data.data || [];

                // Lọc sản phẩm có tồn kho thấp và hết hàng từ biến thể
                const lowStockProducts = [];
                const outOfStockProducts = [];

                products.forEach(product => {
                    // Kiểm tra nếu sản phẩm có variants
                    if (product.variants && product.variants.length > 0) {
                        // Duyệt qua từng biến thể
                        product.variants.forEach(variant => {
                            const stockQuantity = variant.Stock || 0;
                            
                            if (stockQuantity > 0 && stockQuantity <= LOW_STOCK_THRESHOLD) {
                                lowStockProducts.push({
                                    id: variant.ProductVariantID,
                                    productId: product.ProductID,
                                    name: product.Name,
                                    variantName: variant.VariantName || `Biến thể ${variant.ProductVariantID}`,
                                    sku: variant.SKU || `SP-${product.ProductID}-V${variant.ProductVariantID}`,
                                    stock_quantity: stockQuantity,
                                    image: variant.Image ? 
                                        `${API_BASE_URL.replace('/api', '')}/storage/${variant.Image}` : 
                                        (product.Image ? `${API_BASE_URL.replace('/api', '')}/storage/${product.Image}` : null),
                                    status: variant.Status
                                });
                            } else if (stockQuantity === 0) {
                                outOfStockProducts.push({
                                    id: variant.ProductVariantID,
                                    productId: product.ProductID,
                                    name: product.Name,
                                    variantName: variant.VariantName || `Biến thể ${variant.ProductVariantID}`,
                                    sku: variant.SKU || `SP-${product.ProductID}-V${variant.ProductVariantID}`,
                                    stock_quantity: 0,
                                    image: variant.Image ? 
                                        `${API_BASE_URL.replace('/api', '')}/storage/${variant.Image}` : 
                                        (product.Image ? `${API_BASE_URL.replace('/api', '')}/storage/${product.Image}` : null),
                                    status: variant.Status
                                });
                            }
                        });
                    } else {
                        // Xử lý sản phẩm không có variants (sử dụng stock từ product)
                        const totalStock = product.Stock || 0;
                        if (totalStock > 0 && totalStock <= LOW_STOCK_THRESHOLD) {
                            lowStockProducts.push({
                                id: product.ProductID,
                                productId: product.ProductID,
                                name: product.Name,
                                variantName: "Sản phẩm chính",
                                sku: product.SKU || `SP-${product.ProductID}`,
                                stock_quantity: totalStock,
                                image: product.Image ? `${API_BASE_URL.replace('/api', '')}/storage/${product.Image}` : null,
                                status: product.Status
                            });
                        } else if (totalStock === 0) {
                            outOfStockProducts.push({
                                id: product.ProductID,
                                productId: product.ProductID,
                                name: product.Name,
                                variantName: "Sản phẩm chính",
                                sku: product.SKU || `SP-${product.ProductID}`,
                                stock_quantity: 0,
                                image: product.Image ? `${API_BASE_URL.replace('/api', '')}/storage/${product.Image}` : null,
                                status: product.Status
                            });
                        }
                    }
                });

                // Tính tổng tồn kho từ tất cả biến thể
                const totalInventory = products.reduce((sum, product) => {
                    if (product.variants && product.variants.length > 0) {
                        // Tổng stock từ các biến thể
                        return sum + product.variants.reduce((variantSum, variant) => 
                            variantSum + (variant.Stock || 0), 0);
                    } else {
                        // Stock từ sản phẩm không có biến thể
                        return sum + (product.Stock || 0);
                    }
                }, 0);

                // Lấy top 5 biến thể có tồn kho cao nhất
                const allVariants = [];
                
                products.forEach(product => {
                    if (product.variants && product.variants.length > 0) {
                        product.variants.forEach(variant => {
                            allVariants.push({
                                id: variant.ProductVariantID,
                                productId: product.ProductID,
                                name: product.Name,
                                variantName: variant.VariantName || `Biến thể ${variant.ProductVariantID}`,
                                stock_quantity: variant.Stock || 0,
                                image: variant.Image ? 
                                    `${API_BASE_URL.replace('/api', '')}/storage/${variant.Image}` : 
                                    (product.Image ? `${API_BASE_URL.replace('/api', '')}/storage/${product.Image}` : null)
                            });
                        });
                    } else {
                        allVariants.push({
                            id: product.ProductID,
                            productId: product.ProductID,
                            name: product.Name,
                            variantName: "Sản phẩm chính",
                            stock_quantity: product.Stock || 0,
                            image: product.Image ? `${API_BASE_URL.replace('/api', '')}/storage/${product.Image}` : null
                        });
                    }
                });

                const topInventoryProducts = allVariants
                    .sort((a, b) => b.stock_quantity - a.stock_quantity)
                    .slice(0, 5);

                setDashboardData(prevState => ({
                    ...prevState,
                    lowStockProducts: [...lowStockProducts, ...outOfStockProducts],
                    topInventoryProducts: topInventoryProducts,
                    summary: {
                        ...prevState.summary,
                        total_products: products.length,
                        total_inventory: totalInventory,
                        low_stock_count: lowStockProducts.length,
                        out_of_stock_count: outOfStockProducts.length
                    }
                }));

            } catch (err) {
                console.error('Lỗi lấy dữ liệu dashboard:', err);
                setError('Không thể tải dữ liệu dashboard. Vui lòng kiểm tra API backend.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // === DEMO DATA AUTO-FILL (chỉ chạy khi API trả rỗng) ===
    useEffect(() => {
        const noSales = !dashboardData.monthlySales || dashboardData.monthlySales.every(v => v === 0);
        const noRevenue = !dashboardData.monthlyRevenue || dashboardData.monthlyRevenue.every(v => v === 0);
        const noUserGrowth = !dashboardData.userGrowth || dashboardData.userGrowth.length === 0;
        const noOrderStatus = !dashboardData.orderStatus || Object.values(dashboardData.orderStatus).reduce((a, b) => a + (b || 0), 0) === 0;
        const noTopInv = !dashboardData.topInventoryProducts || dashboardData.topInventoryProducts.length === 0;

        if (noSales || noRevenue || noUserGrowth || noOrderStatus || noTopInv) {
            setDashboardData(prev => ({
                ...prev,
                monthlySales: noSales ? [5, 8, 12, 20, 25, 18, 30, 40, 35, 28, 22, 15] : prev.monthlySales,
                monthlyRevenue: noRevenue ? [2000000, 3500000, 5000000, 8000000, 10000000, 7500000, 12000000, 15000000, 13000000, 11000000, 9000000, 6000000] : prev.monthlyRevenue,
                userGrowth: noUserGrowth ? [
                    { month: "2025-01", count: 2 },
                    { month: "2025-02", count: 5 },
                    { month: "2025-03", count: 7 },
                    { month: "2025-04", count: 10 },
                    { month: "2025-05", count: 14 },
                    { month: "2025-06", count: 20 }
                ] : prev.userGrowth,
                orderStatus: noOrderStatus ? {
                    pending: 4,
                    processing: 6,
                    completed: 25,
                    cancelled: 2,
                    shipped: 5
                } : prev.orderStatus,
                topInventoryProducts: noTopInv ? [
                    { id: 1, name: "Sản phẩm A", stock_quantity: 120 },
                    { id: 2, name: "Sản phẩm B", stock_quantity: 95 },
                    { id: 3, name: "Sản phẩm C", stock_quantity: 80 },
                    { id: 4, name: "Sản phẩm D", stock_quantity: 60 },
                    { id: 5, name: "Sản phẩm E", stock_quantity: 45 }
                ] : prev.topInventoryProducts
            }));
        }
    }, [
        dashboardData.monthlySales,
        dashboardData.monthlyRevenue,
        dashboardData.userGrowth,
        dashboardData.orderStatus,
        dashboardData.topInventoryProducts
    ]);

    // ===== Helpers tính % tăng/giảm MoM =====
    const calcGrowthPct = (current, previous) => {
        if (previous === undefined || previous === null) return undefined;
        if (previous === 0) {
            if (current > 0) return 100;
            return 0;
        }
        return ((current - previous) / previous) * 100;
    };

    const pickLastTwo = (arr = []) => {
        if (!Array.isArray(arr) || arr.length === 0) return [undefined, undefined];
        if (arr.length === 1) return [0, arr[0]];
        return [arr[arr.length - 2], arr[arr.length - 1]];
    };

    // Users MoM (fallback nếu API không trả summary.user_growth)
    const [prevUsersCount, currUsersCount] = pickLastTwo(
        (dashboardData.userGrowth || []).map(it => it.count)
    );
    const usersMoM = calcGrowthPct(currUsersCount, prevUsersCount);

    // Sales MoM (dựa trên monthlySales)
    const [prevSalesCount, currSalesCount] = pickLastTwo(dashboardData.monthlySales || []);
    const salesMoM = calcGrowthPct(currSalesCount, prevSalesCount);

    // Revenue MoM (dựa trên monthlyRevenue)
    const [prevRevenue, currRevenue] = pickLastTwo(dashboardData.monthlyRevenue || []);
    const revenueMoM = calcGrowthPct(currRevenue, prevRevenue);

    // Biểu đồ lượt bán & Doanh thu theo tháng (2025) - BIỂU ĐỒ KẾT HỢP
    const monthlyDataChart = {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [
            {
                type: 'bar',
                label: 'Lượt bán',
                data: dashboardData.monthlySales,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                yAxisID: 'y',
            },
            {
                type: 'line',
                label: 'Doanh thu (VNĐ)',
                data: dashboardData.monthlyRevenue,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                yAxisID: 'y1',
            }
        ]
    };

    // Cập nhật: Chuyển đổi biểu đồ trạng thái đơn hàng từ Doughnut sang Bar
    const orderStatusChart = {
        labels: Object.keys(dashboardData.orderStatus).map(status => {
            const statusLabels = {
                pending: 'Chờ xử lý',
                processing: 'Đang xử lý',
                completed: 'Đã hoàn thành',
                cancelled: 'Đã hủy',
                shipped: 'Đang giao hàng'
            };
            return statusLabels[status] || status;
        }),
        datasets: [{
            label: 'Số lượng đơn hàng',
            data: Object.values(dashboardData.orderStatus),
            backgroundColor: [
                'rgba(255, 193, 7, 0.8)', // pending
                'rgba(23, 162, 184, 0.8)', // processing
                'rgba(40, 167, 69, 0.8)', // completed
                'rgba(220, 53, 69, 0.8)', // cancelled
                'rgba(0, 123, 255, 0.8)' // shipped
            ],
            borderColor: [
                'rgba(255, 193, 7, 1)',
                'rgba(23, 162, 184, 1)',
                'rgba(40, 167, 69, 1)',
                'rgba(220, 53, 69, 1)',
                'rgba(0, 123, 255, 1)'
            ],
            borderWidth: 1
        }]
    };

    // Biểu đồ Top 5 sản phẩm tồn kho - ĐÃ THAY ĐỔI THÀNH BIỂU ĐỒ TRÒN
    const topInventoryChart = {
        labels: dashboardData.topInventoryProducts.map(product => product.name),
        datasets: [{
            label: 'Số lượng tồn kho',
            data: dashboardData.topInventoryProducts.map(product => product.stock_quantity),
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };

    // Biểu đồ đường cho tăng trưởng người dùng
    const userGrowthChart = {
        labels: dashboardData.userGrowth.map(item => {
            const [year, month] = item.month.split('-');
            return `Tháng ${month}/${year}`;
        }),
        datasets: [{
            label: 'Số người dùng mới',
            data: dashboardData.userGrowth.map(item => item.count),
            fill: true,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            tension: 0.3,
            pointBackgroundColor: 'rgba(153, 102, 255, 1)',
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

 const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: {
          size: 15,
          family: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
        }
      }
    },
    tooltip: {
      callbacks: {
        // Hiển thị gọn gàng: chỉ số liệu
        label: function(context) {
          let value = context.raw;
          if (context.dataset.label.includes('Doanh thu')) {
            return value.toLocaleString('vi-VN') + ' VNĐ';
          }
          return value;
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: false   // ẩn nhãn trục X
      },
      grid: {
        drawTicks: false
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: false   // ẩn chữ "Lượt bán"
      }
    },
    y1: {
      beginAtZero: true,
      position: 'right',
      grid: {
        drawOnChartArea: false
      },
      title: {
        display: false   // ẩn chữ "Doanh thu (VNĐ)"
      }
    }
  },
  layout: {
    padding: {
      top: 13,
      bottom: 13,
      left: 13,
      right: 13
    }
  }
};

// ====== THÊM: option cho mini chart trong từng card (ẩn trục/legend) ======
const miniChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  elements: { point: { radius: 0 } },
  scales: { x: { display: false }, y: { display: false } }
};

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    // ===== Tạo mảng các card summary (giữ nguyên layout cũ, chỉ bổ sung growth + icon) =====
    const summaryCards = [
        {
            title: 'Tổng người dùng',
            value: dashboardData.summary.total_users || 0,
            icon: <FaUsers size={24} />,
            color: 'primary',
            // Dùng API nếu có, nếu không dùng tính toán MoM
            growth: (dashboardData.summary.user_growth ?? usersMoM),
            // ===== THÊM MINI CHART =====
            mini: {
                type: 'line',
                labels: (dashboardData.userGrowth || []).map(i => (i.month || '').slice(5)),
                data: (dashboardData.userGrowth || []).map(i => i.count || 0)
            }
        },
        {
            title: 'Tổng sản phẩm',
            value: dashboardData.summary.total_products || 0,
            icon: <FaBox size={26} />,
            color: 'success',
            // ===== THÊM MINI CHART (dựa trên tồn kho top 5) =====
            mini: {
                type: 'bar',
                labels: (dashboardData.topInventoryProducts || []).map(p => p.name),
                data: (dashboardData.topInventoryProducts || []).map(p => p.stock_quantity || 0)
            }
            // Không có dữ liệu MoM đáng tin -> không hiển thị mũi tên
        },
        {
            title: 'Tổng đơn hàng',
            value: dashboardData.summary.total_orders || 0,
            icon: <FaShoppingCart size={26} />,
            color: 'info',
            // Fallback lấy MoM từ monthlySales
            growth: (dashboardData.summary.order_growth ?? salesMoM),
            // ===== THÊM MINI CHART =====
            mini: {
                type: 'line',
                labels: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
                data: dashboardData.monthlySales || []
            }
        },
        {
            title: 'Tổng doanh thu',
            value: ((dashboardData.summary.total_revenue ?? 0).toLocaleString('vi-VN')) + ' VNĐ',
            icon: <FaDollarSign size={26} />,
            color: 'warning',
            growth: (dashboardData.summary.revenue_growth ?? revenueMoM),
            // ===== THÊM MINI CHART =====
            mini: {
                type: 'line',
                labels: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
                data: dashboardData.monthlyRevenue || []
            }
        },
        {
            title: 'Đánh giá trung bình',
            value: (
                <>
                    <div className="fw-bold">{(dashboardData.ratings.average ?? 0).toFixed(1)}/5</div>
                    <small>{dashboardData.ratings.total || 0} đánh giá</small>
                </>
            ),
            icon: <FaStar size={26} />,
            color: 'danger',
            // ===== THÊM MINI CHART (phân phối sao) =====
            mini: {
                type: 'bar',
                labels: [5,4,3,2,1].map(s => `${s}★`),
                data: [5,4,3,2,1].map(s => dashboardData.ratings?.distribution?.[s] || 0)
            }
        },
        {
            title: 'Tổng tồn kho',
            value: dashboardData.summary.total_inventory || 0,
            icon: <FaWarehouse size={26} />,
            color: 'secondary',
            subtitle: `${dashboardData.summary.low_stock_count || 0} SP sắp hết, ${dashboardData.summary.out_of_stock_count || 0} SP hết hàng`,
            // ===== THÊM MINI CHART =====
            mini: {
                type: 'bar',
                labels: (dashboardData.topInventoryProducts || []).map(p => p.name),
                data: (dashboardData.topInventoryProducts || []).map(p => p.stock_quantity || 0)
            }
        },
        {
            title: 'Tổng lượt bán (2025)',
            value: (dashboardData.monthlySales?.reduce((sum, sales) => sum + sales, 0) || 0),
            icon: <FaTags size={26} />,
            color: 'info',
            subtitle: `Năm 2025 (Chỉ đơn hoàn thành)`,
            growth: salesMoM,
            // ===== THÊM MINI CHART =====
            mini: {
                type: 'bar',
                labels: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
                data: dashboardData.monthlySales || []
            }
        },
        {
            title: 'Tăng trưởng người dùng',
            value: dashboardData.userGrowth.length > 0 ? dashboardData.userGrowth[dashboardData.userGrowth.length - 1].count : 0,
            icon: <FaChartArea size={26} />,
            color: 'success',
            subtitle: dashboardData.userGrowth.length > 0 ?
                `Tháng ${dashboardData.userGrowth[dashboardData.userGrowth.length - 1].month.split('-')[1]}` :
                'Chưa có dữ liệu',
            growth: usersMoM,
            // ===== THÊM MINI CHART =====
            mini: {
                type: 'line',
                labels: (dashboardData.userGrowth || []).map(i => (i.month || '').slice(5)),
                data: (dashboardData.userGrowth || []).map(i => i.count || 0)
            }
        }
    ];

    return (
        <div className="container-fluid py-4">
            <h1 className="mb-4 text-primary fw-bold">
                <FaChartLine className="me-2" />
                Bảng Điều Khiển Quản Trị
            </h1>

            {/* Summary Cards */}
            <Row className="mb-4">
                {summaryCards.map((card, index) => {
                    const hasGrowth = typeof card.growth === 'number' && !Number.isNaN(card.growth);
                    const growthVal = hasGrowth ? Number(card.growth.toFixed(1)) : null;
                    const isUp = hasGrowth ? growthVal >= 0 : null;

                    return (
                        <Col key={index} xl={3} md={6} sm={6} className="mb-4">
                            <Card className={`h-100 border-start border-${card.color} border-5 shadow-sm`}>
                                <Card.Body className="d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className={`text-${card.color} fw-bold text-uppercase`} style={{ fontSize: '0.8rem' }}>
                                            {card.title}
                                        </div>
                                        <div className={`text-${card.color}`}>
                                            {card.icon}
                                        </div>
                                    </div>
                                    <div className="mt-auto">
                                        <h4 className="fw-bold text-gray-800 mb-0">
                                            {card.value}
                                        </h4>

                                        {hasGrowth && (
                                            <div className="text-xs text-muted mt-1 d-flex align-items-center">
                                                <span className={`me-2 ${isUp ? 'text-success' : 'text-danger'} d-inline-flex align-items-center`}>
                                                    {isUp ? <FaArrowUp className="me-1" /> : <FaArrowDown className="me-1" />}
                                                    {Math.abs(growthVal)}%
                                                </span>
                                                <span>So với tháng trước</span>
                                            </div>
                                        )}

                                        {card.subtitle && (
                                            <div className="text-xs text-muted mt-1">
                                                {card.subtitle}
                                            </div>
                                        )}
                                    </div>

                                    {/* ===== THÊM: MINI CHART CHO MỖI Ô ===== */}
                                    {card.mini && Array.isArray(card.mini.data) && card.mini.data.length > 0 && (
                                        <div style={{ height: 70, marginTop: 10 }}>
                                            {card.mini.type === 'bar' ? (
                                                <Bar
                                                    data={{
                                                        labels: card.mini.labels,
                                                        datasets: [{
                                                            data: card.mini.data,
                                                            backgroundColor: 'rgba(54, 162, 235, 0.35)',
                                                            borderColor: 'rgba(54, 162, 235, 1)',
                                                            borderWidth: 1
                                                        }]
                                                    }}
                                                    options={miniChartOptions}
                                                />
                                            ) : (
                                                <Line
                                                    data={{
                                                        labels: card.mini.labels,
                                                        datasets: [{
                                                            data: card.mini.data,
                                                            borderColor: 'rgba(54, 162, 235, 1)',
                                                            backgroundColor: 'rgba(54, 162, 235, 0.15)',
                                                            borderWidth: 2,
                                                            fill: true,
                                                            tension: 0.35,
                                                            pointRadius: 0
                                                        }]
                                                    }}
                                                    options={miniChartOptions}
                                                />
                                            )}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Monthly Sales & Revenue (2025) - Biểu đồ kết hợp */}
            <Row className="mb-4">
                <Col xl={12} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="py-3 bg-light d-flex justify-content-between align-items-center">
                            <h6 className="m-0 fw-bold text-primary">
                                <FaTags className="me-2" />
                                Lượt bán và Doanh thu theo tháng (2025)
                            </h6>
                        </Card.Header>
                        <Card.Body style={{ position: 'relative', height: '500px' }}>
                            {dashboardData.monthlySales && dashboardData.monthlyRevenue &&
                             (dashboardData.monthlySales.some(sales => sales > 0) ||
                              dashboardData.monthlyRevenue.some(revenue => revenue > 0)) ? (
                                <Bar
                                    data={monthlyDataChart}
                                    options={chartOptions}
                                />
                            ) : (
                                <div className="text-center py-5">
                                    <FaExclamationTriangle className="text-warning mb-3" size={48} />
                                    <h6 className="text-muted">Chưa có dữ liệu lượt bán và doanh thu năm 2025</h6>
                                    <p className="text-muted small">Dữ liệu sẽ được hiển thị khi có đơn hàng hoàn thành trong năm 2025</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Order Status Chart - Full Width */}
            <Row className="mb-4">
                <Col xl={12} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="py-3 bg-light">
                            <h6 className="m-0 fw-bold text-primary">
                                <FaClipboardList className="me-2" />
                                Phân bố trạng thái đơn hàng
                            </h6>
                        </Card.Header>
                        <Card.Body style={{ position: 'relative', height: '500px' }}>
                            {Object.values(dashboardData.orderStatus).length > 0 ? (
                                <Bar
                                    data={orderStatusChart}
                                    options={chartOptions}
                                />
                            ) : (
                                <div className="text-center py-5">
                                    <FaExclamationTriangle className="text-warning mb-3" size={48} />
                                    <h6 className="text-muted">Chưa có dữ liệu trạng thái đơn hàng</h6>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* New Charts Row: Top Inventory Products and User Growth */}
            <Row className="mb-4">
                {/* Top 5 sản phẩm tồn kho - ĐÃ THAY ĐỔI THÀNH BIỂU ĐỒ TRÒN */}
                <Col xl={12} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="py-3 bg-light">
                            <h6 className="m-0 fw-bold text-primary">
                                <FaChartBar className="me-2" />
                                Top 5 sản phẩm tồn kho cao nhất
                            </h6>
                        </Card.Header>
                        <Card.Body style={{ position: 'relative', height: '500px' }}>
                            {dashboardData.topInventoryProducts && dashboardData.topInventoryProducts.length > 0 ? (
                                <Doughnut
                                    data={topInventoryChart}
                                    options={{
                                        ...chartOptions,
                                        plugins: {
                                            ...chartOptions.plugins,
                                            legend: {
                                                position: 'right',
                                                labels: {
                                                    font: {
                                                        size: 13,
                                                        family: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <div className="text-center py-5">
                                    <FaExclamationTriangle className="text-warning mb-3" size={48} />
                                    <h6 className="text-muted">Chưa có dữ liệu sản phẩm tồn kho</h6>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Low Stock Alert - Full Width */}
            <Row className="mb-4">
                <Col xl={12} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="py-3 bg-light d-flex align-items-center">
                            <FaExclamationTriangle className="me-2 text-warning" />
                            <h6 className="m-0 fw-bold text-primary">Cảnh báo tồn kho</h6>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {dashboardData.lowStockProducts.length > 0 ? (
                                <div className="table-responsive" style={{ maxHeight: '800px', overflowY: 'auto' }}>
                                    <Table hover className="mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="border-0">Sản phẩm</th>
                                                <th className="border-0">SKU</th>
                                                <th className="border-0">Tồn kho</th>
                                                <th className="border-0">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboardData.lowStockProducts.map(product => (
                                                <tr key={product.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            {product.image && (
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                                                                    className="me-3"
                                                                />
                                                            )}
                                                            <div className="ms-2">
                                                                <p className="fw-bold mb-0" style={{ fontSize: '1rem' }}>{product.name}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ fontSize: '1rem' }}>{product.sku}</td>
                                                    <td>
                                                        <span className={`fw-bold ${product.stock_quantity === 0 ? 'text-danger' : 'text-warning'}`} style={{ fontSize: '1.1rem' }}>
                                                            {product.stock_quantity}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Badge bg={product.stock_quantity === 0 ? 'danger' : 'warning'} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                                            {product.stock_quantity === 0 ? 'Hết hàng' : 'Sắp hết'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <div className="text-muted">Không có sản phẩm nào tồn kho thấp hoặc hết hàng.</div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Ratings Summary and Recent Orders */}
            <Row>
                {/* Ratings Summary */}
                <Col xl={4} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="py-3 bg-light">
                            <h6 className="m-0 fw-bold text-primary">
                                <FaStarHalfAlt className="me-2" />
                                Thống kê đánh giá
                            </h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-center mb-3">
                                <Statistic
                                    title="Điểm trung bình"
                                    value={(dashboardData.ratings.average ?? 0).toFixed(1)}
                                    suffix="/ 5"
                                    valueStyle={{ color: '#ffc107' }}
                                />
                                <Rate disabled allowHalf value={dashboardData.ratings.average || 0} />
                                <div className="mt-2">
                                    <small className="text-muted">{dashboardData.ratings.total || 0} đánh giá</small>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h6 className="fw-bold mb-3">Phân phối đánh giá</h6>
                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = dashboardData.ratings.distribution?.[star] || 0;
                                    const percentage = dashboardData.ratings.total > 0
                                        ? (count / dashboardData.ratings.total) * 100
                                        : 0;
                                    return (
                                        <div key={star} className="mb-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center" style={{ width: '200px' }}>
                                                    <Rate disabled defaultValue={1} count={1} className="me-1" />
                                                    <span>{star}</span>
                                                </div>
                                                <Progress
                                                    percent={percentage.toFixed(1)}
                                                    size="small"
                                                    strokeColor={{
                                                        '0%': '#ffc107',
                                                        '100%': '#ffc107',
                                                    }}
                                                    style={{ width: '100%', margin: '0 15px' }}
                                                />
                                                <span style={{ width: '200px', textAlign: 'right' }}>{count}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Recent Orders */}
                <Col xl={8} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="py-3 bg-light">
                            <h6 className="m-0 fw-bold text-primary">
                                <FaShoppingCart className="me-2" />
                                Đơn hàng gần đây
                            </h6>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive" style={{ maxHeight: '1000px', overflowY: 'auto' }}>
                                <Table hover className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="border-0">Mã đơn</th>
                                            <th className="border-0">Trạng thái</th>
                                            <th className="border-0">Tổng tiền</th>
                                            <th className="border-0">Ngày tạo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ?
                                            dashboardData.recentOrders.map(order => (
                                                <tr key={order.id}>
                                                    <td className="fw-bold">#{order.id}</td>
                                                    <td>
                                                        <Badge
                                                            bg={
                                                                order.status === 'completed' ? 'success' :
                                                                order.status === 'pending' ? 'warning' :
                                                                order.status === 'cancelled' ? 'danger' :
                                                                order.status === 'processing' ? 'info' : 'primary'
                                                            }
                                                        >
                                                            {order.status === 'pending' ? 'Chờ xử lý' :
                                                             order.status === 'processing' ? 'Đang xử lý' :
                                                             order.status === 'completed' ? 'Đã hoàn thành' :
                                                             order.status === 'cancelled' ? 'Đã hủy' :
                                                             order.status === 'shipped' ? 'Đang giao hàng' : order.status}
                                                        </Badge>
                                                    </td>
                                                    <td>{order.total_amount?.toLocaleString('vi-VN')}₫</td>
                                                    <td>{order.Pending_at ? new Date(order.Pending_at).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-3">Không có đơn hàng nào gần đây.</td>
                                                </tr>
                                            )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
