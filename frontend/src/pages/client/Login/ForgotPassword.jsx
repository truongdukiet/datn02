import React, { useState } from 'react';
import { forgotPassword } from '../../../api/api';
import './Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const data = await forgotPassword(email);
      setMessage(data.message || 'Vui lòng kiểm tra email để đặt lại mật khẩu.');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Quên mật khẩu</h2>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Nhập email đã đăng ký"
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
