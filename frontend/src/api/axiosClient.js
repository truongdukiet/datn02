import axios from "axios";

// ✅ Tạo instance axios
const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Laravel API URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Cho phép gửi cookie nếu dùng Sanctum
});

// ✅ Interceptor cho request: luôn thêm Authorization token nếu có
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Interceptor cho response: xử lý lỗi chung
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "";

      // ✅ Chỉ logout nếu thực sự là lỗi xác thực
      if (status === 401 && message.toLowerCase().includes("unauthenticated")) {
        console.warn("Phiên đăng nhập hết hạn, yêu cầu đăng nhập lại.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userProfile");
        window.location.href = "/login";
      } else {
        console.error(`Lỗi API: ${status}`, error.response.data);
      }
    } else {
      console.error("Không kết nối được đến API. Kiểm tra server.");
    }
    return Promise.reject(error);
  }
);

/* ============================================
   ✅ API cho Categories, Vouchers, News
   ============================================ */

// Categories
export const fetchCategories = () => axiosClient.get("/categories");
export const addCategory = (data) => axiosClient.post("/categories", data);
export const updateCategory = (id, data) => axiosClient.put(`/categories/${id}`, data);
export const deleteCategory = (id) => axiosClient.delete(`/categories/${id}`);

// Vouchers
export const fetchVouchers = () => axiosClient.get("/vouchers");
export const addVoucher = (data) => axiosClient.post("/vouchers", data);
export const updateVoucher = (id, data) => axiosClient.put(`/vouchers/${id}`, data);
export const deleteVoucher = (id) => axiosClient.delete(`/vouchers/${id}`);

// News
export const fetchNews = () => axiosClient.get("/news");
export const addNews = (data) => axiosClient.post("/news", data);
export const updateNews = (id, data) => axiosClient.put(`/news/${id}`, data);
export const deleteNews = (id) => axiosClient.delete(`/news/${id}`);

// Orders
export const getOrdersByUser = (userId) => axiosClient.get(`/orders/user/${userId}`);
export const cancelOrder = (orderId) => axiosClient.put(`/orders/${orderId}/cancel`);
export const getOrderDetail = (orderId) => axiosClient.get(`/orders/${orderId}`);

// ✅ Reviews (đánh giá)
export const getReviews = () => axiosClient.get("/reviews");
export const submitReview = (data) => axiosClient.post("/reviews", data);
export const updateReview = (id, data) => axiosClient.put(`/reviews/${id}`, data);
export const deleteReview = (id) => axiosClient.delete(`/reviews/${id}`);

// ✅ Giữ nguyên export default
export default axiosClient;
