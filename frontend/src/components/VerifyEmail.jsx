import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetch(`http://localhost:8000/api/verify-email/${userId}/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setTimeout(() => navigate('/verify-email-success'), 1500);
        } else {
          setStatus('failed');
        }
      })
      .catch(() => setStatus('failed'));
  }, [userId, token, navigate]);

  if (status === 'loading') return <div style={{textAlign: 'center', marginTop: 50}}>Đang xác thực email...</div>;
  if (status === 'failed') return <div style={{textAlign: 'center', marginTop: 50, color: 'red'}}>Xác thực thất bại hoặc link không hợp lệ.</div>;
  return <div style={{textAlign: 'center', marginTop: 50, color: 'green'}}>Xác thực thành công! Đang chuyển hướng...</div>;
};

export default VerifyEmail;
