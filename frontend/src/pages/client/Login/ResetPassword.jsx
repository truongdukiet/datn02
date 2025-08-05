import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const ResetPassword = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Lấy token & email từ query string
  const query = new URLSearchParams(location.search);
  const tokenFromQuery = query.get('token') || '';
  const emailFromQuery = query.get('email') || '';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    token: ''
  });

  // ✅ Đồng bộ email và token từ query
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/reset-password`, {
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
        setSuccess(data.message || 'Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(
          data.message ||
            data.errors?.password?.[0] ||
            data.errors?.email?.[0] ||
            'Có lỗi xảy ra, vui lòng thử lại.'
        );
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ, vui lòng thử lại.');
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
          {/* Email */}
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
              readOnly={!!emailFromQuery} // Nếu có email từ link thì khóa lại
            />
          </div>

          {/* New Password */}
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

          {/* Confirm Password */}
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
