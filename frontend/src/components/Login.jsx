import React, { useState } from 'react';
import { login } from '../api';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    login: '',      // đổi từ email thành login
    Password: ''    // đổi từ password thành Password (chữ P hoa)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});
    try {
      const data = await login(formData.login, formData.Password);
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
      setFormData({ login: '', Password: '' });
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
      if (err.errors) setFieldErrors(err.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Đăng nhập</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login">Email hoặc Username:</label>
            <input
              type="text"
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
              placeholder="Nhập email hoặc username"
            />
            {fieldErrors.login && <div className="error-message">{fieldErrors.login[0]}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="Password">Mật khẩu:</label>
            <input
              type="password"
              id="Password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu"
            />
            {fieldErrors.Password && <div className="error-message">{fieldErrors.Password[0]}</div>}
          </div>
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/forgot-password" className="nav-link">Quên mật khẩu?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 