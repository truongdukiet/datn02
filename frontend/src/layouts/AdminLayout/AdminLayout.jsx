import React from "react";
import { Link, Outlet } from 'react-router-dom';
import './AdminLayout.css'; // Tạo file CSS riêng cho admin nếu muốn

const AdminLayout = () => (
  <div className="admin-layout">
    <aside className="admin-sidebar">
      <h2>Quản trị</h2>
      <nav>
        <ul>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/users">Quản lý người dùng</Link></li>
          <li><Link to="/admin/products">Quản lý sản phẩm</Link></li>
          <li><Link to="/admin/orders">Quản lý đơn hàng</Link></li>
          <li><Link to="/admin/categories">Quản lý danh mục</Link></li>
          <li><Link to="/admin/vouchers">Quản lý voucher</Link></li>
          <li><Link to="/admin/news">Quản lý tin tức</Link></li>
        </ul>
      </nav>
    </aside>
    <main className="admin-content">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
