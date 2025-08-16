// src/utils/cartUtils.js
import apiClient from "./api";
import { message } from "antd";

export const addToCart = async (productVariantId, quantity = 1) => {
  try {
    // Đảm bảo gửi đúng tên trường mà backend mong đợi
    const response = await apiClient.post('/api/cart/add', {
      ProductVariantID: productVariantId, // Tên trường PHẢI khớp với backend
      Quantity: quantity
    });
    
    message.success("Đã thêm sản phẩm vào giỏ hàng!");
    return true;
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    const errorMessage = error.response?.data?.message || 
                         "Có lỗi xảy ra khi thêm vào giỏ hàng!";
    message.error(errorMessage);
    return false;
  }
};