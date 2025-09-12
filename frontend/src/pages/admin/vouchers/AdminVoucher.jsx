import React, { useEffect, useState } from 'react';
import { getVouchers, addVoucher, updateVoucher, deleteVoucher } from '../../../api/api';
import './AdminVoucher.css';

const AdminVoucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [formData, setFormData] = useState({
        Code: '',
        Value: '',
        Quantity: '',
        Status: true,
        Description: '',
        Expiry_date: '',
    });
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_BASE_URL = 'http://localhost:8000/api';

    const fetchVouchers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/vouchers`);
            const data = await response.json();
            if (data.success) {
                setVouchers(data.data || []);
            } else {
                setError('Không thể lấy danh sách mã giảm giá');
            }
        } catch (err) {
            setError('Lỗi khi lấy dữ liệu: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "Status" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (selectedVoucher) {
                await updateVoucher({ ...formData, id: selectedVoucher.VoucherID });
                alert('✅ Cập nhật mã giảm giá thành công!');
            } else {
                await addVoucher(formData);
                alert('✅ Thêm mã giảm giá thành công!');
            }
            setFormData({ Code: '', Value: '', Quantity: '', Status: true, Description: '', Expiry_date: '' });
            setSelectedVoucher(null);
            fetchVouchers();
        } catch (err) {
            setError('Lỗi: ' + (err.response?.data?.message || 'Đã có lỗi xảy ra'));
        }
    };

    const handleEdit = (voucher) => {
        setSelectedVoucher(voucher);
        setFormData({
            ...voucher,
            Status: Number(voucher.Status), 
            Expiry_date: voucher.Expiry_date
                ? voucher.Expiry_date.split("T")[0]
                : ""
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteVoucher(id);
            alert('🗑️ Xóa mã giảm giá thành công!');
            fetchVouchers();
        } catch (err) {
            setError('Lỗi: ' + (err.response?.data?.message || 'Không thể xóa'));
        }
    };

    return (
        <div className="voucher-management">
            <h2>Quản lý mã giảm giá</h2>
            {error && <p className="error">{error}</p>}

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <>
                    <button onClick={() => setSelectedVoucher(null)}>Thêm mã mới</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>Giá trị</th>
                                <th>Số lượng</th>
                                <th>Trạng thái</th>
                                <th>Mô tả</th>
                                <th>Hạn sử dụng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(vouchers) && vouchers.map(voucher => (
                                <tr key={voucher.VoucherID}>
                                    <td>{voucher.Code}</td>
                                    <td>{voucher.Value}</td>
                                    <td>{voucher.Quantity}</td>
                                    <td>{voucher.Status ? 'Kích hoạt' : 'Không kích hoạt'}</td>
                                    <td>{voucher.Description}</td>
                                    <td>{new Date(voucher.Expiry_date).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        <button onClick={() => handleEdit(voucher)}>Sửa</button>
                                        <button onClick={() => handleDelete(voucher.VoucherID)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            <form onSubmit={handleSubmit}>
                <h3>{selectedVoucher ? 'Chỉnh sửa mã' : 'Thêm mã giảm giá'}</h3>
                <input
                    name="Code"
                    placeholder="Nhập mã giảm giá"
                    value={formData.Code}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="Value"
                    placeholder="Giá trị giảm (%)"
                    value={formData.Value}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="Quantity"
                    placeholder="Số lượng"
                    value={formData.Quantity}
                    onChange={handleChange}
                    required
                />
                <select
                    name="Status"
                    value={Number(formData.Status)}
                    onChange={handleChange}
                >
                    <option value={1}>Kích hoạt</option>
                    <option value={0}>Không kích hoạt</option>
                </select>

                <textarea
                    name="Description"
                    placeholder="Mô tả mã giảm giá"
                    value={formData.Description}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="Expiry_date"
                    value={formData.Expiry_date}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{selectedVoucher ? 'Cập nhật' : 'Thêm'} mã</button>
            </form>
        </div>
    );
};

export default AdminVoucher;
