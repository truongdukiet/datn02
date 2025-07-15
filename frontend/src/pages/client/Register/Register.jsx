import React, { useState } from 'react';
import { register } from '../../../api/api';

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');

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
    setSuccess('');
    setFieldErrors({});
    try {
      await register(formData);
      setSuccess(response.data.message || 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.');
      setFormData({
        Fullname: '',
        Username: '',
        Email: '',
        Password: '',
        Password_confirmation: ''
      });
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || 'Đăng ký thất bại'
      );
      if (err?.response?.data?.errors) setFieldErrors(err.response.data.errors);
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
            <label>Họ tên:</label>
            <input type="text" name="Fullname" value={formData.Fullname} onChange={handleChange} required placeholder="Nhập họ tên" />
            {fieldErrors.Fullname && <div className="error-message">{fieldErrors.Fullname[0]}</div>}
            </div>
          <div className="form-group">
            <label>Tên đăng nhập:</label>
            <input type="text" name="Username" value={formData.Username} onChange={handleChange} required placeholder="Nhập tên đăng nhập" />
            {fieldErrors.Username && <div className="error-message">{fieldErrors.Username[0]}</div>}
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="Email" value={formData.Email} onChange={handleChange} required placeholder="Nhập email" />
            {fieldErrors.Email && <div className="error-message">{fieldErrors.Email[0]}</div>}
                  </div>
          <div className="form-group">
            <label>Mật khẩu:</label>
            <input type="password" name="Password" value={formData.Password} onChange={handleChange} required placeholder="Nhập mật khẩu" />
            {fieldErrors.Password && <div className="error-message">{fieldErrors.Password[0]}</div>}
              </div>
          <div className="form-group">
            <label>Nhập lại mật khẩu:</label>
            <input type="password" name="Password_confirmation" value={formData.Password_confirmation} onChange={handleChange} required placeholder="Nhập lại mật khẩu" />
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
