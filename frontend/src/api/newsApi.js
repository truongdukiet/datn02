import axios from "axios";

const API_URL = "http://localhost:8000/api/admin/news"; // Đường dẫn Laravel API

export const newsApi = {
  getAll: async (page = 1) => {
    const response = await axios.get(`${API_URL}?page=${page}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  update: async (id, formData) => {
    const response = await axios.post(`${API_URL}/${id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};
