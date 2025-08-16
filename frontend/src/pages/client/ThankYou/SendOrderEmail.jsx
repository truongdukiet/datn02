// src/pages/ThankYou/SendOrderEmail.jsx
import React from "react";
import axios from "axios";

const SendOrderEmail = ({ orderId, userEmail }) => {
  const handleSend = async () => {
    try {
      await axios.post("http://localhost:8000/api/send-order-email", {
        order_id: orderId,
        email: userEmail,
      });
      alert("Đã gửi email xác nhận!");
    } catch (error) {
      console.error(error);
      alert("Gửi email thất bại!");
    }
  };

  return (
    <button
      onClick={handleSend}
      className="tw-mt-4 tw-bg-[#1A1C20] tw-text-white tw-px-4 tw-py-2 tw-rounded"
    >
      Gửi lại email xác nhận
    </button>
  );
};

export default SendOrderEmail;
