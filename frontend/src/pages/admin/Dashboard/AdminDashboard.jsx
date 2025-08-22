import React, { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
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
    FaTags
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
        monthlyRevenue: []
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

                // Cập nhật state với dữ liệu từ API
                setDashboardData(prevState => ({
                    ...prevState,
                    summary: data.summary || {},
                    userGrowth: data.user_growth || [],
                    revenueData: data.revenue_data || [],
                    recentOrders: data.recent_orders || [],
                    orderStatus: data.order_status || {},
                    ratings: data.ratings_summary || { average: 0, total: 0, distribution: {} },
                    monthlySales: data.monthly_sales_2025 || [], // Lấy từ API
                    monthlyRevenue: data.monthly_revenue_2025 || [] // Lấy từ API
                }));

                // Lấy dữ liệu sản phẩm để tính tồn kho
                const productsRes = await axios.get(`${API_BASE_URL}/products`);
                const products = productsRes.data.data || [];

                const lowStockProducts = products.filter(product => {
                    const totalStock = product.variants ?
                        product.variants.reduce((total, variant) => total + (variant.Stock || 0), 0) :
                        (product.Stock || 0);
                    return totalStock > 0 && totalStock <= LOW_STOCK_THRESHOLD;
                }).map(product => ({
                    id: product.ProductID,
                    name: product.Name,
                    sku: product.SKU || `SP-${product.ProductID}`,
                    stock_quantity: product.variants ?
                        product.variants.reduce((total, variant) => total + (variant.Stock || 0), 0) :
                        (product.Stock || 0),
                    image: product.Image ? `${API_BASE_URL.replace('/api', '')}/storage/${product.Image}` : null,
                    status: product.Status
                }));

                const outOfStockProducts = products.filter(product => {
                    const totalStock = product.variants ?
                        product.variants.reduce((total, variant) => total + (variant.Stock || 0), 0) :
                        (product.Stock || 0);
                    return totalStock === 0;
                }).map(product => ({
                    id: product.ProductID,
                    name: product.Name,
                    sku: product.SKU || `SP-${product.ProductID}`,
                    stock_quantity: 0,
                    image: product.Image ? `${API_BASE_URL.replace('/api', '')}/storage/${product.Image}` : null,
                    status: product.Status
                }));

                const totalInventory = products.reduce((sum, product) => {
                    const totalStock = product.variants ?
                        product.variants.reduce((total, variant) => total + (variant.Stock || 0), 0) :
                        (product.Stock || 0);
                    return sum + totalStock;
                }, 0);

                setDashboardData(prevState => ({
                    ...prevState,
                    lowStockProducts: [...lowStockProducts, ...outOfStockProducts],
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

    // Biểu đồ lượt bán & Doanh thu theo tháng (2025)
    const monthlyDataChart = {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [
            {
                label: 'Lượt bán',
                data: dashboardData.monthlySales,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'Doanh thu (VNĐ)',
                data: dashboardData.monthlyRevenue,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }
        ]
    };

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

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 11,
                        family: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 10,
                        family: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
                    }
                },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 10,
                        family: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
                    }
                },
                grid: {
                    display: false
                }
            }
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        }
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

    // Tạo mảng các card summary, loại bỏ card Doanh thu (2025) - phần tử thứ 7
    const summaryCards = [
        {
            title: 'Tổng người dùng',
            value: dashboardData.summary.total_users,
            icon: <FaUsers size={24} />,
            color: 'primary',
            growth: dashboardData.summary.user_growth
        },
        {
            title: 'Tổng sản phẩm',
            value: dashboardData.summary.total_products,
            icon: <FaBox size={24} />,
            color: 'success'
        },
        {
            title: 'Tổng đơn hàng',
            value: dashboardData.summary.total_orders,
            icon: <FaShoppingCart size={24} />,
            color: 'info'
        },
        {
            title: 'Tổng doanh thu',
            value: dashboardData.summary.total_revenue?.toLocaleString('vi-VN') + ' VNĐ',
            icon: <FaDollarSign size={24} />,
            color: 'warning'
        },
        {
            title: 'Đánh giá trung bình',
            value: (
                <>
                    <div className="fw-bold">{dashboardData.ratings.average?.toFixed(1) || 0}/5</div>
                    <small>{dashboardData.ratings.total || 0} đánh giá</small>
                </>
            ),
            icon: <FaStar size={24} />,
            color: 'danger'
        },
        {
            title: 'Tổng tồn kho',
            value: dashboardData.summary.total_inventory || 0,
            icon: <FaWarehouse size={24} />,
            color: 'secondary',
            subtitle: `${dashboardData.summary.low_stock_count || 0} SP sắp hết, ${dashboardData.summary.out_of_stock_count || 0} SP hết hàng`
        },
        // Đã loại bỏ card Doanh thu (2025) ở đây
        {
            title: 'Tổng lượt bán (2025)',
            value: dashboardData.monthlySales?.reduce((sum, sales) => sum + sales, 0) || 0,
            icon: <FaTags size={24} />,
            color: 'info',
            subtitle: `Năm 2025 (Chỉ đơn hoàn thành)`
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
                {summaryCards.map((card, index) => (
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
                                    {card.growth !== undefined && (
                                        <div className="text-xs text-muted mt-1">
                                            <span className={`me-1 ${card.growth >= 0 ? 'text-success' : 'text-danger'}`}>
                                                <i className={`fas fa-${card.growth >= 0 ? 'arrow-up' : 'arrow-down'} me-1`}></i>
                                                {card.growth}%
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
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Charts - First Row */}
            <Row className="mb-4">
                <Col xl={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="py-3 bg-light d-flex justify-content-between align-items-center">
                            <h6 className="m-0 fw-bold text-primary">
                                <FaChartLine className="me-2" />
                                Tăng trưởng người dùng
                            </h6>
                        </Card.Header>
                        <Card.Body style={{ position: 'relative', height: '200px' }}>
                            {dashboardData.userGrowth && dashboardData.userGrowth.length > 0 ? (
                                <Bar
                                    data={{
                                        labels: dashboardData.userGrowth.map(item => item.month),
                                        datasets: [{
                                            label: 'Người dùng mới',
                                            data: dashboardData.userGrowth.map(item => item.count),
                                            backgroundColor: 'rgba(54, 162, 235, 0.8)',
                                            borderColor: 'rgba(54, 162, 235, 1)',
                                            borderWidth: 1
                                        }]
                                    }}
                                    options={chartOptions}
                                />
                            ) : (
                                <div className="text-center py-5">
                                    <FaExclamationTriangle className="text-warning mb-3" size={48} />
                                    <h6 className="text-muted">Chưa có dữ liệu tăng trưởng người dùng</h6>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="py-3 bg-light d-flex justify-content-between align-items-center">
                            <h6 className="m-0 fw-bold text-primary">
                                <FaMoneyBillWave className="me-2" />
                                Doanh thu theo tháng
                            </h6>
                        </Card.Header>
                        <Card.Body style={{ position: 'relative', height: '200px' }}>
                            {dashboardData.revenueData && dashboardData.revenueData.length > 0 ? (
                                <Bar
                                    data={{
                                        labels: dashboardData.revenueData.map(item => item.month),
                                        datasets: [{
                                            label: 'Doanh thu theo tháng (VND)',
                                            data: dashboardData.revenueData.map(item => item.amount),
                                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                            borderColor: 'rgba(75, 192, 192, 1)',
                                            borderWidth: 1
                                        }]
                                    }}
                                    options={{
                                        ...chartOptions,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    callback: value => value.toLocaleString('vi-VN') + ' VNĐ',
                                                    font: { size: 9 }
                                                }
                                            },
                                            x: {
                                                ticks: { font: { size: 9 } }
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <div className="text-center py-5">
                                    <FaExclamationTriangle className="text-warning mb-3" size={48} />
                                    <h6 className="text-muted">Chưa có dữ liệu doanh thu</h6>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Second Row - Monthly Sales & Revenue (2025) */}
            <Row className="mb-4">
                <Col xl={12} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="py-3 bg-light d-flex justify-content-between align-items-center">
                            <h6 className="m-0 fw-bold text-primary">
                                <FaTags className="me-2" />
                                Lượt bán và Doanh thu theo tháng (2025)
                            </h6>
                        </Card.Header>
                        <Card.Body style={{ position: 'relative', height: '200px' }}>
                            {dashboardData.monthlySales.some(sales => sales > 0) || dashboardData.monthlyRevenue.some(revenue => revenue > 0) ? (
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

            {/* Third Row - Order Status, Inventory, Ratings */}
            <Row className="mb-4">
                {/* Order Status */}
                <Col xl={4} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="py-3 bg-light">
                            <h6 className="m-0 fw-bold text-primary">
                                <FaClipboardList className="me-2" />
                                Phân bố trạng thái đơn hàng
                            </h6>
                        </Card.Header>
                        <Card.Body className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                            {Object.values(dashboardData.orderStatus).length > 0 ? (
                                <div style={{ width: '1200px', maxWidth: '1200px' }}>
                                    <Doughnut data={orderStatusChart} options={{
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: { font: { size: 11 } }
                                            }
                                        },
                                        maintainAspectRatio: false
                                    }} />
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <FaExclamationTriangle className="text-warning mb-3" size={48} />
                                    <h6 className="text-muted">Chưa có dữ liệu trạng thái đơn hàng</h6>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Low Stock Alert and Recent Orders */}
                <Col xl={8} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="py-3 bg-light d-flex align-items-center">
                            <FaExclamationTriangle className="me-2 text-warning" />
                            <h6 className="m-0 fw-bold text-primary">Cảnh báo tồn kho</h6>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {dashboardData.lowStockProducts.length > 0 ? (
                                <div className="table-responsive" style={{ maxHeight: '1200px', overflowY: 'auto' }}>
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
                                                                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                                                                    className="me-2"
                                                                />
                                                            )}
                                                            <div className="ms-2">
                                                                <p className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{product.name}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{product.sku}</td>
                                                    <td>
                                                        <span className={`fw-bold ${product.stock_quantity === 0 ? 'text-danger' : 'text-warning'}`}>
                                                            {product.stock_quantity}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Badge bg={product.stock_quantity === 0 ? 'danger' : 'warning'}>
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
                                    value={dashboardData.ratings.average?.toFixed(1) || 0}
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
                                                <div className="d-flex align-items-center" style={{ width: '50px' }}>
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
                                                    style={{ width: '60%', margin: '0 10px' }}
                                                />
                                                <span style={{ width: '40px', textAlign: 'right' }}>{count}</span>
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
                            <div className="table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
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
                                                    <td>{order.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : 'N/A'}</td>
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
