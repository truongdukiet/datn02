import axiosClient from './axiosClient';

const userApi = {
  // ✅ Lấy thông tin user theo ID
  getProfile: (id) => axiosClient.get(`/users/profile/${id}`),

  // ✅ Cập nhật thông tin user
  update: (id, data) => axiosClient.put(`/users/${id}`, data),

  // ✅ Đăng ký
  register: (data) => axiosClient.post('/users/register', data),

  // ✅ Đăng nhập
  login: (data) => axiosClient.post('/users/login', data),

  // ✅ Xóa user
  delete: (id) => axiosClient.delete(`/users/${id}`),
};

export default userApi;
