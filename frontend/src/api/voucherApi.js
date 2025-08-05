import apiClient from "./apiClient";

export const getVouchers = () => apiClient.get("/vouchers");
export const addVoucher = (data) => apiClient.post("/vouchers", data);
export const updateVoucher = (id, data) => apiClient.put(`/vouchers/${id}`, data);
export const deleteVoucher = (id) => apiClient.delete(`/vouchers/${id}`);
