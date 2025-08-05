import axios from "axios";

// 1. Khởi tạo instance Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2. Interceptor cho request để tự động thêm Authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor cho response để xử lý lỗi 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Phiên đăng nhập hết hạn hoặc không hợp lệ");
      // Có thể thêm logic redirect về trang đăng nhập ở đây
    }
    return Promise.reject(error);
  }
);

// 4. Định nghĩa các phương thức API
export const fetchCategories = () => apiClient.get('/categories');

// API cho Category
export const addCategory = (formData) => {
  // Với FormData, axios sẽ tự động đặt Content-Type là multipart/form-data
  return apiClient.post('/categories', formData);
};

export const updateCategory = (id, data) => {
  return apiClient.post(`/categories/${id}?_method=PUT`, data);
};

export const deleteCategory = (id) => apiClient.delete(`/categories/${id}`);

// API cho Vouchers
export const getVouchers = () => apiClient.get('/vouchers');
export const addVoucher = (data) => apiClient.post('/vouchers', data);
export const updateVoucher = (data) => apiClient.put(`/vouchers/${data.id}`, data);
export const deleteVoucher = (id) => apiClient.delete(`/vouchers/${id}`);

// API cho News
export const getNews = () => apiClient.get('/api/news');
export const addNews = (data) => apiClient.post('/api/news', data);
export const updateNews = (data) => apiClient.put(`/api/news/${data.id}`, data);
export const deleteNews = (id) => apiClient.delete(`/api/news/${id}`);
export const selectNews = (id) => apiClient.get(`/api/news/${id}`);

// ✅ API cho giỏ hàng & thanh toán
export const addOrder = (orderData) => {
  return apiClient.post(`/api/orders/${orderData.UserID}`, orderData); // Đặt hàng
};

export const clearCart = () => {
  return apiClient.delete('/api/carts/clear'); // Xóa toàn bộ giỏ hàng
};

export const getPaymentGateways = () => {
  return apiClient.get('/api/payment-gateways'); // Lấy danh sách phương thức thanh toán
};
export const getOrders = () => apiClient.get('/api/orders');
export const getOrderById = (id) => apiClient.get(`/api/orders/${id}`);
export const updateOrder = (id, data) => apiClient.put(`/api/orders/${id}`, data);
export const deleteOrder = (id) => apiClient.delete(`/api/orders/${id}`);

export const validateUserId = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}`);
        return response.data.success; // Giả sử API trả về success: true nếu tồn tại
    } catch (error) {
        return false; // Nếu có lỗi, trả về false
    }
};

// Hàm kiểm tra PaymentID
export const validatePaymentId = async (paymentId) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/payment-gateways/${paymentId}`);
        return response.data.success; // Giả sử API trả về success: true nếu tồn tại
    } catch (error) {
        return false; // Nếu có lỗi, trả về false
    }
};
// 5. Export default cho apiClient
export default apiClient;
