import React from 'react';
import { Link } from 'react-router-dom';
import "../Login/Login.css";

const VerifyEmailSuccess = () => (
  <div className="login-container">
    <div className="login-card">
      <h2>Xác thực email thành công!</h2>
      <p>Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ.</p>
      <Link to="/login" className="login-btn" style={{ display: 'block', textAlign: 'center', marginTop: 20 }}>
        Đăng nhập
      </Link>
    </div>
  </div>
);

export default VerifyEmailSuccess;
