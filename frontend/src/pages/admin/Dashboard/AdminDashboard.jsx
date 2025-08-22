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

const LOW_STOCK_THRESHOLD = 10; // Ngưỡng cảnh báo tồn kho thấp

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: {},
    userGrowth: [],
    revenueData: [],
    recentOrders: [],
    orderStatus: {},
    ratings: { average: 0, total: 0, distribution: {} },
    inventory: [], // Dữ liệu tồn kho
    lowStockProducts: [], // Sản phẩm sắp hết hàng
    monthlySales: [], // Dữ liệu lượt bán theo tháng
    monthlyRevenue: [] // Dữ liệu doanh thu theo tháng
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy dữ liệu dashboard
        const res = await axios.get(`${API_BASE_URL}/dashboard`);
        const data = res.data?.data || {};

        // Lấy dữ liệu sản phẩm để tính tồn kho
        const productsRes = await axios.get(`${API_BASE_URL}/products`);
        const products = productsRes.data.data || [];

        // Lấy dữ liệu đơn hàng để tính lượt bán và doanh thu theo tháng
        const ordersRes = await axios.get(`${API_BASE_URL}/orders`);
        const orders = ordersRes.data.data || [];

        // TÍNH TOÁN LƯỢT BÁN VÀ DOANH THU THEO THÁNG - CHỈ NĂM 2025 VÀ CHỈ ĐƠN HOÀN THÀNH
        const TARGET_YEAR = 2025; // Chỉ lấy dữ liệu năm 2025
        const monthlySalesData = Array(12).fill(0);
        const monthlyRevenueData = Array(12).fill(0);

        orders.forEach(order => {
          if (order.created_at) {
            const orderDate = new Date(order.created_at);

            // CHỈ TÍNH KHI ĐƠN HÀNG ĐÃ HOÀN THÀNH (status = 'completed')
            const isCompletedOrder = order.status === 'completed' || order.Status === 'completed';

            if (orderDate.getFullYear() === TARGET_YEAR && isCompletedOrder) {
              const month = orderDate.getMonth();
              monthlySalesData[month] += 1; // Tăng lượt bán
              if (order.total_amount) {
                monthlyRevenueData[month] += parseFloat(order.total_amount);
              }
            }
          }
        });

        // Tính toán dữ liệu tồn kho
        const inventoryData = products.map(product => ({
          id: product.ProductID,
          name: product.Name,
          sku: product.SKU || `SP-${product.ProductID}`,
          stock_quantity: product.variants ?
            product.variants.reduce((total, variant) => total + (variant.Stock || 0), 0) : 0,
          image: product.Image ? `http://localhost:8000/storage/${product.Image}` : null,
          status: product.Status
        }));

        // Lọc sản phẩm tồn kho thấp
        const lowStockProducts = inventoryData.filter(
          item => item.stock_quantity <= LOW_STOCK_THRESHOLD && item.stock_quantity > 0
        );

        // Sản phẩm hết hàng
        const outOfStockProducts = inventoryData.filter(item => item.stock_quantity === 0);

        setDashboardData({
          summary: {
            ...data.summary,
            total_inventory: inventoryData.reduce((sum, item) => sum + item.stock_quantity, 0),
            low_stock_count: lowStockProducts.length,
            out_of_stock_count: outOfStockProducts.length,
            total_sales: monthlySalesData.reduce((sum, sales) => sum + sales, 0),
            monthly_revenue: monthlyRevenueData.reduce((sum, revenue) => sum + revenue, 0)
          },
          userGrowth: data.user_growth || [],
          revenueData: data.revenue || [],
          recentOrders: data.recent_orders || [],
          orderStatus: data.order_status || {},
          ratings: data.ratings_summary || { average: 0, total: 0, distribution: {} },
          inventory: inventoryData,
          lowStockProducts: [...lowStockProducts, ...outOfStockProducts],
          monthlySales: monthlySalesData,
          monthlyRevenue: monthlyRevenueData
        });
      } catch (err) {
        console.error('Lỗi lấy dữ liệu dashboard:', err);
        setError('Không thể tải dữ liệu dashboard');
        setDashboardData({
          summary: {},
          userGrowth: [],
          revenueData: [],
          recentOrders: [],
          orderStatus: {},
          ratings: { average: 0, total: 0, distribution: {} },
          inventory: [],
          lowStockProducts: [],
          monthlySales: [],
          monthlyRevenue: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chuẩn bị dữ liệu biểu đồ
  const userGrowthChart = {
    labels: dashboardData.userGrowth.map(item => item.month),
    datasets: [{
      label: 'Người dùng mới',
      data: dashboardData.userGrowth.map(item => item.count),
      backgroundColor: 'rgba(54, 162, 235, 0.8)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const revenueChartData = {
    labels: dashboardData.revenueData.map(item => item.month),
    datasets: [{
      label: 'Doanh thu theo tháng (VND)',
      data: dashboardData.revenueData.map(item => item.amount),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  // Biểu đồ lượt bán theo tháng NĂM 2025 - CẬP NHẬT
  const monthlySalesChart = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
             'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [{
      label: 'Lượt bán theo tháng (2025)',
      data: dashboardData.monthlySales.some(sales => sales > 0)
        ? dashboardData.monthlySales
        : Array(12).fill(0), // Hiển thị toàn 0 nếu không có dữ liệu
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };

  // Biểu đồ doanh thu theo tháng NĂM 2025 - CẬP NHẬT
  const monthlyRevenueChart = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
             'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [{
      label: 'Doanh thu theo tháng (2025) - VND',
      data: dashboardData.monthlyRevenue.some(revenue => revenue > 0)
        ? dashboardData.monthlyRevenue
        : Array(12).fill(0), // Hiển thị toàn 0 nếu không có dữ liệu
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
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

  // Chuẩn bị dữ liệu biểu đồ tồn kho
  const inventoryChartData = {
    labels: dashboardData.inventory
      .sort((a, b) => b.stock_quantity - a.stock_quantity)
      .slice(0, 5)
      .map(item => item.name),
    datasets: [{
      label: 'Số lượng tồn kho',
      data: dashboardData.inventory
        .sort((a, b) => b.stock_quantity - a.stock_quantity)
        .slice(0, 5)
        .map(item => item.stock_quantity),
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 11
          }
        }
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

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4 text-primary fw-bold">
        <FaChartLine className="me-2" />
        Bảng Điều Khiển Quản Trị
      </h1>

      {/* Summary Cards */}
      <Row className="mb-4">
        {[
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
          {
            title: 'Tổng lượt bán (2025)',
            value: dashboardData.summary.total_sales > 0 ? dashboardData.summary.total_sales : 'Chưa có dữ liệu',
            icon: <FaTags size={24} />,
            color: 'info',
            subtitle: `Năm 2025 (Chỉ đơn hoàn thành)`
          },
          {
            title: 'Tổng doanh thu (2025)',
            value: dashboardData.summary.monthly_revenue > 0
              ? dashboardData.summary.monthly_revenue.toLocaleString('vi-VN') + ' VNĐ'
              : 'Chưa có dữ liệu',
            icon: <FaCalendarAlt size={24} />,
            color: 'success',
            subtitle: `Năm 2025 (Chỉ đơn hoàn thành)`
          }
        ].map((card, index) => (
          <Col key={index} xl={2} md={4} sm={6} className="mb-4">
            <Card className={`h-100 border-${card.color} shadow-sm`}>
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
            <Card.Body>
              <Bar data={userGrowthChart} options={chartOptions} height={250} />
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
            <Card.Body>
              <Bar data={revenueChartData} options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: value => value.toLocaleString('vi-VN') + ' VNĐ',
                      font: {
                        size: 11
                      }
                    }
                  },
                  x: {
                    ticks: {
                      font: {
                        size: 11
                      }
                    }
                  }
                }
              }} height={250} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Second Row - Monthly Sales and Revenue for 2025 */}
      <Row className="mb-4">
        <Col xl={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="py-3 bg-light d-flex justify-content-between align-items-center">
              <h6 className="m-0 fw-bold text-primary">
                <FaTags className="me-2" />
                Lượt bán theo tháng (2025)
              </h6>
            </Card.Header>
            <Card.Body>
              {dashboardData.monthlySales.some(sales => sales > 0) ? (
                <Bar data={monthlySalesChart} options={chartOptions} height={250} />
              ) : (
                <div className="text-center py-5">
                  <FaExclamationTriangle className="text-warning mb-3" size={48} />
                  <h6 className="text-muted">Chưa có dữ liệu lượt bán năm 2025</h6>
                  <p className="text-muted small">Dữ liệu sẽ được hiển thị khi có đơn hàng hoàn thành trong năm 2025</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="py-3 bg-light d-flex justify-content-between align-items-center">
              <h6 className="m-0 fw-bold text-primary">
                <FaCalendarAlt className="me-2" />
                Doanh thu theo tháng (2025)
              </h6>
            </Card.Header>
            <Card.Body>
              {dashboardData.monthlyRevenue.some(revenue => revenue > 0) ? (
                <Bar data={monthlyRevenueChart} options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: value => value.toLocaleString('vi-VN') + ' VNĐ',
                        font: {
                          size: 11
                        }
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }} height={250} />
              ) : (
                <div className="text-center py-5">
                  <FaExclamationTriangle className="text-warning mb-3" size={48} />
                  <h6 className="text-muted">Chưa có dữ liệu doanh thu năm 2025</h6>
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
            <Card.Body className="d-flex align-items-center justify-content-center">
              <div style={{ width: '100%', maxWidth: '300px' }}>
                <Doughnut data={orderStatusChart} options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Inventory Chart */}
        <Col xl={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="py-3 bg-light">
              <h6 className="m-0 fw-bold text-primary">
                <FaWarehouse className="me-2" />
                Tồn kho theo sản phẩm (Top 5)
              </h6>
            </Card.Header>
            <Card.Body>
              <Bar
                data={inventoryChartData}
                options={chartOptions}
                height={250}
              />
            </Card.Body>
          </Card>
        </Col>

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
      </Row>

      {/* Fourth Row - Low Stock Alert and Recent Orders */}
      <Row>
        {/* Low Stock Alert */}
        <Col xl={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="py-3 bg-light d-flex align-items-center">
              <FaExclamationTriangle className="me-2 text-warning" />
              <h6 className="m-0 fw-bold text-primary">Cảnh báo tồn kho</h6>
            </Card.Header>
            <Card.Body className="p-0">
              {dashboardData.lowStockProducts.length > 0 ? (
                <div className="table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
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
                  <div className="text-muted">Không có sản phẩm nào tồn kho thấp</div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Orders */}
        <Col xl={6} className="mb-4">
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
                    {dashboardData.recentOrders.length > 0 ?
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
                          <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
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
