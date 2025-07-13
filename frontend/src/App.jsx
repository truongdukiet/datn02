import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './App.css';
import ProductList from './components/ProductList.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import { logout } from './api';
import VerifyEmailSuccess from './components/VerifyEmailSuccess.jsx';
import VerifyEmail from './components/VerifyEmail.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminUsers from './components/admin/AdminUsers.jsx';
import AdminProducts from './components/admin/AdminProducts.jsx';
// import AdminOrders from './components/admin/AdminOrders.jsx';
// import AdminCategories from './components/admin/AdminCategories.jsx';
// import AdminVouchers from './components/admin/AdminVouchers.jsx';
// import AdminNews from './components/admin/AdminNews.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    // Chuyển hướng theo Role (chữ hoa)
    if (Number(data.user.Role) === 1) {
      navigate('/admin');
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>🛍️ NextGen</h1>
          <nav className="nav-menu">
            {isAuthenticated ? (
              <div className="user-menu">
                {Number(user?.Role) === 1 && (
                  <Link to="/admin" className="nav-link">Admin</Link>
                )}
                <Link to="/products" className="nav-link">Sản phẩm</Link>
                <span>Xin chào, {user?.Fullname || 'User'}!</span>
                <button onClick={handleLogout} className="logout-btn">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="auth-menu">
                <Link to="/login" className="nav-link">Đăng nhập</Link>
                <Link to="/register" className="nav-link">Đăng ký</Link>
                <Link to="/forgot-password" className="nav-link">Quên mật khẩu?</Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="App-main">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated
                ? (Number(user?.Role) === 1 ? <Navigate to="/admin" replace /> : <Navigate to="/products" replace />)
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated
                ? (Number(user?.Role) === 1 ? <Navigate to="/admin" replace /> : <Navigate to="/products" replace />)
                : <Login onLoginSuccess={handleLoginSuccess} />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated
                ? (Number(user?.Role) === 1 ? <Navigate to="/admin" replace /> : <Navigate to="/products" replace />)
                : <Register />
            }
          />
          <Route
            path="/products"
            element={
              isAuthenticated
                ? <ProductList />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/admin"
            element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            {/* <Route path="orders" element={<AdminOrders />} /> */}
            {/* <Route path="categories" element={<AdminCategories />} />
            <Route path="vouchers" element={<AdminVouchers />} />
            <Route path="news" element={<AdminNews />} /> */}
          </Route>
          <Route path="/verify-email/:userId/:token" element={<VerifyEmail />} />
          <Route path="/verify-email-success" element={<VerifyEmailSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 NextGen</p>
      </footer>
    </div>
  );
}

export default App; 