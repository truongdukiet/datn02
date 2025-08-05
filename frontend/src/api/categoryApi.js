import apiClient from "./apiClient";

// Lấy danh sách category
export const fetchCategories = () => apiClient.get("/categories");

// Thêm category (hỗ trợ upload ảnh)
export const addCategory = (formData) => {
  return apiClient.post("/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Cập nhật category
export const updateCategory = (id, formData) => {
  return apiClient.post(`/categories/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Xóa category
export const deleteCategory = (id) => apiClient.delete(`/categories/${id}`);
