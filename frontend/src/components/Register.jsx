import React, { useState } from 'react';
import { register } from '../api';
import './Login.css'; // Tận dụng lại CSS của Login

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    Fullname: '',
    Username: '',
    Email: '',
    Password: '',
    Password_confirmation: ''
  });
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
      const data = await register(formData);
      setSuccess(data.message || 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.');
      setFormData({
        Fullname: '',
        Username: '',
        Email: '',
        Password: '',
        Password_confirmation: ''
      });
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Đăng ký</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Fullname">Họ tên:</label>
            <input
              type="text"
              id="Fullname"
              name="Fullname"
              value={formData.Fullname}
              onChange={handleChange}
              required
              placeholder="Nhập họ tên"
            />
          </div>
          <div className="form-group">
            <label htmlFor="Username">Tên đăng nhập:</label>
            <input
              type="text"
              id="Username"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              required
              placeholder="Nhập tên đăng nhập"
            />
          </div>
          <div className="form-group">
            <label htmlFor="Email">Email:</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              placeholder="Nhập email"
            />
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
          </div>
          <div className="form-group">
            <label htmlFor="Password_confirmation">Nhập lại mật khẩu:</label>
            <input
              type="password"
              id="Password_confirmation"
              name="Password_confirmation"
              value={formData.Password_confirmation}
              onChange={handleChange}
              required
              placeholder="Nhập lại mật khẩu"
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
