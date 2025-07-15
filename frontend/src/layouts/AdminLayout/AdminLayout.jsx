import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => (
  <div className="admin-layout">
    <aside className="admin-sidebar">
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/users">Quản lý người dùng</Link></li>
        <li><Link to="/admin/products">Quản lý sản phẩm</Link></li>
        {/* Thêm các link khác nếu cần */}
      </ul>
    </aside>
    <main className="admin-content">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
