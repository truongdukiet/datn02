import React, { useState, useEffect } from 'react';
import { updateOrder, getOrders } from '../../api/api';

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [status, setStatus] = useState('pending');

    // ✅ Hàm dịch trạng thái sang tiếng Việt
    const translateStatus = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xử lý';
            case 'processing': return 'Đang xử lý';
            case 'completed': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            case 'shipped': return 'Đã giao hàng';
            default: return status;
        }
    };

    // ✅ Hàm chọn màu cho trạng thái
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ffc107'; // vàng
            case 'processing': return '#17a2b8'; // xanh nhạt
            case 'completed': return '#28a745'; // xanh lá
            case 'cancelled': return '#dc3545'; // đỏ
            case 'shipped': return '#007bff'; // xanh đậm
            default: return '#ffffffff'; // xám
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                setError('Không thể tải danh sách đơn hàng');
            }
        } catch (err) {
            console.error('Lỗi khi tải danh sách đơn hàng:', err);
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingOrder) return;

        try {
            const response = await updateOrder(editingOrder.OrderID, { Status: status });
            if (response.data.success) {
                setShowModal(false);
                fetchOrders();
            } else {
                alert('Cập nhật thất bại');
            }
        } catch (err) {
            alert('Có lỗi khi cập nhật trạng thái');
        }
    };

    const openEditModal = (orderItem) => {
        setEditingOrder(orderItem);
        setStatus(orderItem.Status || 'pending');
        setShowModal(true);
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Quản lý đơn hàng</h2>

            {/* Modal cập nhật trạng thái */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', padding: '30px', borderRadius: '8px',
                        width: '400px'
                    }}>
                        <h3>Cập nhật trạng thái đơn hàng</h3>
                        <p><b>ID:</b> {editingOrder?.OrderID}</p>
                        <p><b>Tên người nhận:</b> {editingOrder?.Receiver_name}</p>
                        <p><b>Số điện thoại:</b> {editingOrder?.Receiver_phone}</p>
                        <p><b>Tổng số tiền:</b> {editingOrder?.Total_amount}</p>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Trạng thái</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    style={{ width: '100%', padding: '8px' }}
                                >
                                    <option value="pending">Chờ xử lý</option>
                                    <option value="processing">Đang xử lý</option>
                                    <option value="completed">Đã hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
                                    <option value="shipped">Đã giao hàng</option>
                                </select>
                            </div>
                            <button type="submit" style={{ background: '#28a745', color: '#fff', padding: '8px 15px', marginRight: '10px' }}>Cập nhật</button>
                            <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 15px' }}>Hủy</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Bảng danh sách đơn hàng */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                        <th>ID</th>
                        <th>ID người dùng</th>
                        <th>Tên người nhận</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Tổng số tiền</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(item => (
                        <tr key={item.OrderID}>
                            <td>{item.OrderID}</td>
                            <td>{item.UserID}</td>
                            <td>{item.Receiver_name}</td>
                            <td>{item.Receiver_phone}</td>
                            <td>{item.Shipping_address}</td>
                            <td>{item.Total_amount}</td>
                            {/* ✅ Hiển thị trạng thái tiếng Việt + màu */}
                            <td style={{
                                color: '#fff',
                                background: getStatusColor(item.Status),
                                padding: '5px 10px',
                                borderRadius: '4px',
                                textAlign: 'center'
                            }}>
                                {translateStatus(item.Status)}
                            </td>
                            {/* ✅ Hiển thị ngày tạo */}
                            <td>
                                {item.created_at
                                    ? new Date(item.created_at).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                    : 'Không có dữ liệu'}
                            </td>
                            <td>
                                <button
                                    onClick={() => openEditModal(item)}
                                    style={{ background: '#28a745', color: '#fff', padding: '5px 10px' }}
                                >Cập nhật</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrder;
