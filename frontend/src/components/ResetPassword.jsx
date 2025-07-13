import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const ResetPassword = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy token và email từ query string
  const query = new URLSearchParams(location.search);
  const tokenFromQuery = query.get('token') || '';
  const emailFromQuery = query.get('email') || '';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    token: ''
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: emailFromQuery,
      token: tokenFromQuery
    }));
  }, [emailFromQuery, tokenFromQuery]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:8000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          token: formData.token
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.status || 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập lại.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || data.errors?.email?.[0] || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Đặt lại mật khẩu</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Nhập email đã đăng ký"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu mới:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password_confirmation">Nhập lại mật khẩu:</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
