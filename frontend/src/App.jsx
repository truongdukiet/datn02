import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import ProductList from './components/ProductList.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import { logout } from './api';
import VerifyEmailSuccess from './components/VerifyEmailSuccess.jsx';
import VerifyEmail from './components/VerifyEmail.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      // Có thể lấy thông tin user từ token hoặc API
    }
  }, []);

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
    setUser(data.user);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <h1>🛍️ NextGen</h1>
            <nav className="nav-menu">
              {isAuthenticated ? (
                <div className="user-menu">
                  <Link to="/products" className="nav-link">Sản phẩm</Link>
                  <span>Xin chào, {user?.name || 'User'}!</span>
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
                isAuthenticated ? 
                <Navigate to="/products" replace /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/products" replace /> : 
                <Login onLoginSuccess={handleLoginSuccess} />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                <Navigate to="/products" replace /> : 
                <Register />
              } 
            />
            <Route 
              path="/products" 
              element={
                isAuthenticated ? 
                <ProductList /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route path="/verify-email/:userId/:token" element={<VerifyEmail />} />
            <Route path="/verify-email-success" element={<VerifyEmailSuccess />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>&copy; 2024 NExtGen. Được phát triển với React + Laravel.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 