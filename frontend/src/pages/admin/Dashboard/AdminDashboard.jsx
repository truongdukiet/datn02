// ... phần import giữ nguyên
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

// Đăng ký ChartJS
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

// Cấu hình trạng thái đơn hàng
const ORDER_STATUS = {
  pending: { label: 'Chờ xử lý', color: '#ffc107' },
  processing: { label: 'Đang xử lý', color: '#17a2b8' },
  completed: { label: 'Đã hoàn thành', color: '#28a745' },
  cancelled: { label: 'Đã hủy', color: '#dc3545' },
  shipped: { label: 'Đang giao hàng', color: '#007bff' }
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: {},
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

        const res = await axios.get(`${API_BASE_URL}/dashboard`);
        const data = res.data?.data || {};

        setDashboardData({
          summary: data.summary || {},
          userGrowth: data.user_growth || [],
          revenueData: data.revenue || [],
          recentOrders: data.recent_orders || [],
          orderStatus: data.order_status || {}
        });
      } catch (err) {
        console.error('Lỗi lấy dữ liệu dashboard:', err);
        setError('Không thể tải dữ liệu dashboard');
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

  // Dữ liệu biểu đồ tổng doanh thu
  const totalRevenueChart = {
    labels: ['Tổng doanh thu'],
    datasets: [{
      label: 'Tổng doanh thu (VND)',
      data: [dashboardData.summary.total_revenue],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const orderStatusChart = {
    labels: Object.keys(dashboardData.orderStatus).map(status => ORDER_STATUS[status]?.label || status),
    datasets: [{
      data: Object.values(dashboardData.orderStatus),
      backgroundColor: Object.keys(dashboardData.orderStatus).map(status => ORDER_STATUS[status]?.color + '80' || '#6c757d80'),
      borderColor: Object.keys(dashboardData.orderStatus).map(status => ORDER_STATUS[status]?.color || '#6c757d'),
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
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

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4 text-primary">Bảng Điều Khiển Quản Trị</h1>

      {/* Summary Cards đã được cập nhật */}
      <div className="row mb-4">
        {[
          { title: 'Tổng người dùng', value: dashboardData.summary.total_users, icon: 'users', color: 'primary' },
          { title: 'Tổng sản phẩm', value: dashboardData.summary.total_products, icon: 'boxes', color: 'success' },
          { title: 'Tổng đơn hàng', value: dashboardData.summary.total_orders, icon: 'shopping-cart', color: 'info' },
          // Card "Doanh thu tháng này" đã bị xóa hoàn toàn khỏi danh sách
          {
            title: 'Tổng doanh thu',
            value: dashboardData.summary.total_revenue?.toLocaleString('vi-VN') + ' VNĐ',
            icon: 'dollar-sign',
            color: 'warning'
          }
        ].map((card, index) => (
          <div key={index} className="col-xl-3 col-md-6 mb-4">
            <div className={`card border-left-${card.color} shadow h-100 py-2 rounded`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <div className={`text-xs font-weight-bold text-${card.color} text-uppercase mb-1`}>
                    {card.title}
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {card.value || 0}
                  </div>
                </div>
                <i className={`fas fa-${card.icon} fa-2x text-gray-300`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-xl-6">
          <div className="card shadow rounded mb-4">
            <div className="card-header py-3 bg-light d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">Tăng trưởng người dùng</h6>
            </div>
            <div className="card-body">
              <Bar data={userGrowthChart} options={chartOptions} height={200} />
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card shadow rounded mb-4">
            <div className="card-header py-3 bg-light d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">Tổng doanh thu</h6>
            </div>
            <div className="card-body">
              <Bar data={totalRevenueChart} options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { callback: value => value.toLocaleString('vi-VN') + ' VNĐ' }
                  }
                }
              }} height={200} />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Status + Recent Orders */}
      <div className="row">
        {/* Pie Chart */}
        <div className="col-xl-5">
          <div className="card shadow rounded mb-4">
            <div className="card-header py-3 bg-light d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">Phân bố trạng thái đơn hàng</h6>
            </div>
            <div className="card-body">
              <Pie data={orderStatusChart} options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.raw;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value} đơn (${percentage}%)`;
                      }
                    }
                  }
                }
              }} height={250} />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="col-xl-7">
          <div className="card shadow rounded mb-4">
            <div className="card-header py-3 bg-light d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">Đơn hàng gần đây</h6>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-bordered table-hover" width="100%">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Trạng thái</th>
                    <th>Tổng tiền</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentOrders.length > 0 ? dashboardData.recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <span className="badge" style={{
                          backgroundColor: ORDER_STATUS[order.status]?.color || '#6c757d',
                          color: 'white'
                        }}>
                          {ORDER_STATUS[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td>{order.total_amount?.toLocaleString('vi-VN')} VNĐ</td>
                      <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center">Không có đơn hàng nào gần đây.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;