import React from "react";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaShoppingBag,
  FaTags,
  FaGift,
  FaNewspaper,
  FaSignOutAlt
} from 'react-icons/fa';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Quản trị</h2>
        <nav>
          <ul>
            <li>
              <Link to="/admin">
                <FaTachometerAlt /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/users">
                <FaUsers /> Quản lý người dùng
              </Link>
            </li>
            <li>
              <Link to="/admin/products">
                <FaBox /> Quản lý sản phẩm
              </Link>
            </li>
            <li>
              <Link to="/admin/orders">
                <FaShoppingBag /> Quản lý đơn hàng
              </Link>
            </li>
            <li>
              <Link to="/admin/categories">
                <FaTags /> Quản lý danh mục
              </Link>
            </li>
            <li>
              <Link to="/admin/vouchers">
                <FaGift /> Quản lý voucher
              </Link>
            </li>
            <li>
              <Link to="/admin/news">
                <FaNewspaper /> Quản lý tin tức
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt /> Đăng xuất
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
