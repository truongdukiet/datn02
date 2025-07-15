import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './App.css';
import ProductList from './pages/client/Products/ProductList.jsx';
import Login from './pages/client/Login/Login.jsx';
import Register from './pages/client/Register/Register.jsx';
import AdminDashboard from './pages/admin/Dashboard/AdminDashboard.jsx';
import { logout } from './api/api';
import VerifyEmailSuccess from './pages/client/Register/VerifyEmailSuccess.jsx';
import VerifyEmail from './pages/client/Register/VerifyEmail.jsx';
import ForgotPassword from './pages/client/Login/ForgotPassword.jsx';
import ResetPassword from './pages/client/Login/ResetPassword.jsx';
import AdminLayout from './layouts/AdminLayout/AdminLayout.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
// import AdminOrders from './components/admin/AdminOrders.jsx';
// import AdminCategories from './components/admin/AdminCategories.jsx';
// import AdminVouchers from './components/admin/AdminVouchers.jsx';
// import AdminNews from './components/admin/AdminNews.jsx';
import Home from './pages/client/Home/Home.jsx';
import About from './pages/client/About/About.jsx';
import Projects from './pages/client/Projects/Projects.jsx';
import News from './pages/client/News/News.jsx';
import Contact from './pages/client/Contact/Contact.jsx';
import Cart from './pages/client/Cart/Cart.jsx';

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
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
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