import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
import { Spinner, Alert } from 'react-bootstrap';

// Register ChartJS components
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

// Status configuration
const ORDER_STATUS = {
  pending: { label: 'Chờ xử lý', color: '#ffc107' },
  processing: { label: 'Đang xử lý', color: '#17a2b8' },
  completed: { label: 'Đã hoàn thành', color: '#28a745' },
  cancelled: { label: 'Đã hủy', color: '#dc3545' },
  shipped: { label: 'Đang giao hàng', color: '#007bff' }
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: null,
    userGrowth: [],
    revenueData: [],
    recentOrders: [],
    orderStatus: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/dashboard`);
      
      // Đảm bảo dữ liệu luôn có cấu trúc đầy đủ ngay cả khi null
      const data = response.data?.data || {
        summary: {},
        user_growth: [],
        revenue: [],
        recent_orders: [],
        order_status: {}
      };
      
      setDashboardData({
        summary: data.summary || {},
        userGrowth: data.user_growth || [],
        revenueData: data.revenue || [],
        recentOrders: data.recent_orders || [],
        orderStatus: data.order_status || {}
      });
      
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard');
      // Set dữ liệu mặc định khi có lỗi
      setDashboardData({
        summary: {},
        userGrowth: [],
        revenueData: [],
        recentOrders: [],
        orderStatus: {}
      });
    } finally {
      setLoading(false);
    }
  };

    fetchDashboardData();
  }, []);

  // Chart data preparations
  const userGrowthChart = {
    labels: dashboardData.userGrowth.map(item => item.month),
    datasets: [{
      label: 'Người dùng mới',
      data: dashboardData.userGrowth.map(item => item.count),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      tension: 0.1
    }]
  };

  const revenueChart = {
    labels: dashboardData.revenueData.map(item => item.month),
    datasets: [{
      label: 'Doanh thu (VND)',
      data: dashboardData.revenueData.map(item => item.amount),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const orderStatusChart = {
    labels: Object.keys(dashboardData.orderStatus),
    datasets: [{
      data: Object.values(dashboardData.orderStatus),
      backgroundColor: Object.keys(ORDER_STATUS).map(status => ORDER_STATUS[status].color + '80'),
      borderColor: Object.keys(ORDER_STATUS).map(status => ORDER_STATUS[status].color),
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString();
              if (context.dataset.label?.includes('Doanh thu')) {
                label += ' VNĐ';
              }
            }
            return label;
          }
        }
      }
    },
    scales: { y: { beginAtZero: true } }
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

  if (!dashboardData.summary) {
    return <Alert variant="warning">Không có dữ liệu để hiển thị</Alert>;
  }

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4">Bảng Điều Khiển Quản Trị</h1>
      
      {/* Summary Cards */}
      <div className="row mb-4">
        {[
          { 
            title: 'Tổng người dùng', 
            value: dashboardData.summary.total_users, 
            icon: 'users',
            color: 'primary'
          },
          { 
            title: 'Tổng sản phẩm', 
            value: dashboardData.summary.total_products, 
            icon: 'boxes',
            color: 'success'
          },
          { 
            title: 'Tổng đơn hàng', 
            value: dashboardData.summary.total_orders, 
            icon: 'shopping-cart',
            color: 'info'
          },
          { 
            title: 'Tổng doanh thu', 
            value: dashboardData.summary.total_revenue.toLocaleString('vi-VN') + ' VNĐ', 
            icon: 'dollar-sign',
            color: 'warning'
          }
        ].map((card, index) => (
          <div key={index} className="col-xl-3 col-md-6 mb-4">
            <div className={`card border-left-${card.color} shadow h-100 py-2`}>
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className={`text-xs font-weight-bold text-${card.color} text-uppercase mb-1`}>
                      {card.title}
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {card.value}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className={`fas fa-${card.icon} fa-2x text-gray-300`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row mb-4">
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Tăng trưởng người dùng</h6>
            </div>
            <div className="card-body">
              <Line data={userGrowthChart} options={chartOptions} height={300} />
            </div>
          </div>
        </div>

        <div className="col-xl-6 col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Doanh thu theo tháng</h6>
            </div>
            <div className="card-body">
              <Bar 
                data={revenueChart} 
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => value.toLocaleString('vi-VN') + ' VNĐ'
                      }
                    }
                  }
                }} 
                height={300} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="row">
        {/* Phân bố trạng thái đơn hàng - Phiên bản cải tiến */}
        <div className="col-xl-5 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-chart-pie me-2"></i>
                Phân bố trạng thái đơn hàng
              </h6>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="chart-pie">
                    <Pie 
                      data={orderStatusChart} 
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} đơn (${percentage}%)`;
                              }
                            }
                          }
                        }
                      }} 
                      height={250}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="status-legend mt-3">
                    {Object.entries(ORDER_STATUS).map(([status, config]) => (
                      dashboardData.orderStatus[status] ? (
                        <div key={status} className="d-flex align-items-center mb-2">
                          <span 
                            className="badge me-2" 
                            style={{
                              backgroundColor: config.color,
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%'
                            }}
                          ></span>
                          <div className="d-flex justify-content-between w-100">
                            <span className="text-sm">{config.label}</span>
                            <span className="fw-bold">
                              {dashboardData.orderStatus[status]} đơn
                            </span>
                          </div>
                        </div>
                      ) : null
                    ))}
                    <div className="mt-3 pt-2 border-top">
                      <div className="d-flex justify-content-between">
                        <span className="text-sm fw-bold">Tổng cộng:</span>
                        <span className="fw-bold text-primary">
                          {Object.values(dashboardData.orderStatus).reduce((a, b) => a + b, 0)} đơn
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-7 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Đơn hàng gần đây</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Trạng thái</th>
                      <th>Tổng tiền</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.customer_name}</td>
                        <td>
                          <span 
                            className="badge" 
                            style={{ 
                              backgroundColor: ORDER_STATUS[order.status]?.color || '#6c757d',
                              color: 'white'
                            }}
                          >
                            {ORDER_STATUS[order.status]?.label || order.status}
                          </span>
                        </td>
                        <td>{order.total_amount.toLocaleString('vi-VN')} VNĐ</td>
                        <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;