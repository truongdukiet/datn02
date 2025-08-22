import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Divider } from 'antd';
import { Column } from '@ant-design/charts';
import { Card, Divider } from 'antd';
import { Column } from '@ant-design/charts';
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cập nhật API Base URL để trỏ đúng đến route Laravel của bạn
  // Lưu ý: Đường dẫn đầy đủ sẽ là http://localhost:8000/api/admin/dashboard-stats
  const API_BASE_URL = 'http://localhost:8000/api/admin';

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Gọi API đến route chính xác đã định nghĩa trong Laravel
      const response = await axios.get(`${API_BASE_URL}/dashboard-stats`);

      setStats(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải dữ liệu thống kê dashboard. Vui lòng kiểm tra API backend.");
      setLoading(false);
    }
  };

  // Giả lập dữ liệu cho biểu đồ (thay thế bằng API call thực tế)
  const getMonthlyData = () => {
    return [
      { month: 'Tháng 1', value: 120, type: 'Lượt bán' },
      { month: 'Tháng 1', value: 150000000, type: 'Doanh thu' },
      { month: 'Tháng 2', value: 90, type: 'Lượt bán' },
      { month: 'Tháng 2', value: 120000000, type: 'Doanh thu' },
      { month: 'Tháng 3', value: 150, type: 'Lượt bán' },
      { month: 'Tháng 3', value: 180000000, type: 'Doanh thu' },
      { month: 'Tháng 4', value: 110, type: 'Lượt bán' },
      { month: 'Tháng 4', value: 135000000, type: 'Doanh thu' },
      { month: 'Tháng 5', value: 180, type: 'Lượt bán' },
      { month: 'Tháng 5', value: 200000000, type: 'Doanh thu' },
      { month: 'Tháng 6', value: 220, type: 'Lượt bán' },
      { month: 'Tháng 6', value: 250000000, type: 'Doanh thu' },
    ];
  };

  const chartConfig = {
    data: getMonthlyData(),
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    yAxis: {
      title: {
        text: 'Số liệu',
      },
      label: {
        formatter: (val) => {
          if (val > 1000000) return `${(val / 1000000).toFixed(1)}M`;
          if (val > 1000) return `${(val / 1000).toFixed(1)}k`;
          return val;
        },
      },
    },
    tooltip: {
      formatter: (datum) => {
        if (datum.type === 'Doanh thu') {
          return { name: datum.type, value: `${datum.value.toLocaleString("vi-VN")} VNĐ` };
        }
        return { name: datum.type, value: `${datum.value} đơn` };
      },
    },
    legend: {
      position: 'top-left',
    },
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

      <Divider style={{ marginTop: '40px' }} />

      {/* Biểu đồ Lượt bán và Doanh thu theo tháng */}
      <Card title="Lượt bán và Doanh thu theo tháng (2025)" style={{ width: '100%' }}>
        <Column {...chartConfig} />
      </Card>

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
