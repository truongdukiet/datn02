import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL - Trỏ đến file PHP của bạn
  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Gọi API đến file PHP
      const response = await axios.get(`${API_BASE_URL}/dashboard_stats.php`);

      // Cập nhật state với dữ liệu nhận được
      setStats(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải dữ liệu thống kê dashboard. Vui lòng kiểm tra API backend.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontSize: '18px' }}>
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545', fontSize: '18px' }}>
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        Dashboard Admin
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>

        <div style={{ padding: '20px', background: '#e9f5ff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, color: '#007bff' }}>Tổng Người Dùng</h3>
          <p style={{ margin: '10px 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalUsers}</p>
        </div>

        <div style={{ padding: '20px', background: '#d4edda', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, color: '#28a745' }}>Tổng Đơn Hàng</h3>
          <p style={{ margin: '10px 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalOrders}</p>
        </div>

        <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, color: '#ffc107' }}>Tổng Doanh Thu</h3>
          <p style={{ margin: '10px 0 0', fontSize: '2rem', fontWeight: 'bold' }}>
            {stats.totalRevenue.toLocaleString("vi-VN")} VNĐ
          </p>
        </div>

        <div style={{ padding: '20px', background: '#f8d7da', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, color: '#dc3545' }}>Sản Phẩm Mới</h3>
          <p style={{ margin: '10px 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{stats.newProducts}</p>
        </div>

      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Các hoạt động gần đây</h2>
        <p style={{ color: '#6c757d' }}>
          (Ví dụ: Lịch sử đăng nhập, đơn hàng mới nhất...)
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
