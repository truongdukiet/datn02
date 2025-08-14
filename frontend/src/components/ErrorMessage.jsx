import React from 'react';

const ErrorMessage = ({ message = 'Đã xảy ra lỗi', className = '' }) => {
  return (
    <div className={`tw-text-red-500 tw-text-center tw-p-4 tw-bg-red-50 tw-rounded-lg ${className}`}>
      <i className="fa-solid fa-circle-exclamation tw-mr-2"></i>
      {message}
    </div>
  );
};

export default ErrorMessage;
