import React, { useState, useEffect } from 'react';
import { updateOrder, getOrders } from '../../api/api';

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [status, setStatus] = useState('pending');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Thứ tự ưu tiên sắp xếp theo trạng thái
    const statusPriority = {
        'pending': 1,
        'processing': 2,
        'shipped': 3,
        'completed': 4,
        'cancelled': 5
    };

    const translateStatus = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xử lý';
            case 'processing': return 'Đang xử lý';
            case 'completed': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            case 'shipped': return 'Đang giao hàng';
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ffc107';
            case 'processing': return '#17a2b8';
            case 'completed': return '#28a745';
            case 'cancelled': return '#dc3545';
            case 'shipped': return '#007bff';
            default: return '#ffffffff';
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            if (response.data.success) {
                // Đảm bảo mỗi đơn hàng có created_at và completed_at hợp lệ
                const processedOrders = response.data.data.map(order => ({
                    ...order,
                    created_at: order.created_at || new Date().toISOString(),
                    completed_at: order.Status === 'completed' ? (order.completed_at || new Date().toISOString()) : null
                }));
                setOrders(processedOrders);
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

    const getStatusOptions = (currentStatus) => {
        switch (currentStatus) {
            case 'pending':
                return [
                    { value: 'pending', label: 'Chờ xử lý' },
                    { value: 'processing', label: 'Đang xử lý' },
                    { value: 'cancelled', label: 'Đã hủy' },
                ];
            case 'processing':
                return [
                    { value: 'processing', label: 'Đang xử lý' },
                    { value: 'shipped', label: 'Đang giao hàng' },
                ];
            case 'shipped':
                return [
                    { value: 'shipped', label: 'Đang giao hàng' },
                    { value: 'completed', label: 'Đã hoàn thành' },
                ];
            default:
                return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingOrder) return;

        if (editingOrder.Status !== 'pending' && status === 'cancelled') {
            alert('Đơn hàng chỉ có thể hủy khi ở trạng thái "Chờ xử lý".');
            return;
        }

        if (editingOrder.Status === 'completed' || editingOrder.Status === 'cancelled') {
            alert('Đơn hàng đã hoàn thành hoặc bị hủy, không thể cập nhật.');
            return;
        }

        try {
            const updateData = {
                Status: status,
                // Đảm bảo giữ nguyên created_at khi cập nhật
                created_at: editingOrder.created_at
            };

            // Nếu cập nhật thành completed, thêm thời gian hoàn thành
            if (status === 'completed') {
                updateData.completed_at = new Date().toISOString();
            } else {
                // Nếu không phải completed, đặt completed_at thành null
                updateData.completed_at = null;
            }

            const response = await updateOrder(editingOrder.OrderID, updateData);
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

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Chưa hoàn thành';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Ngày không hợp lệ';
            }
            return date.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error('Lỗi định dạng ngày:', e);
            return 'Ngày không hợp lệ';
        }
    };

    const openEditModal = (orderItem) => {
        setEditingOrder(orderItem);
        setStatus(orderItem.Status || 'pending');
        setShowModal(true);
    };

    const filteredOrders = orders.filter(order => {
        const matchStatus = filterStatus === 'all' || order.Status === filterStatus;
        const matchSearch =
            order.Receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.Receiver_phone.includes(searchTerm);
        return matchStatus && matchSearch;
    });

    // Sắp xếp đơn hàng: ưu tiên trạng thái trước, sau đó sắp xếp theo ID giảm dần
    const sortedAndFilteredOrders = filteredOrders.sort((a, b) => {
        const statusComparison = statusPriority[a.Status] - statusPriority[b.Status];
        if (statusComparison === 0) {
            return b.OrderID - a.OrderID; // Sắp xếp ID giảm dần (mới nhất lên đầu)
        }
        return statusComparison;
    });

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Quản lý đơn hàng</h2>

            {/* Lọc và tìm kiếm */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc SĐT..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px', width: '50%' }}
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ padding: '8px' }}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đang giao hàng</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                </select>
            </div>

            {/* Modal cập nhật */}
            {showModal && editingOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', padding: '30px', borderRadius: '8px',
                        width: '400px'
                    }}>
                        <h3>Cập nhật trạng thái đơn hàng</h3>
                        <p><b>ID:</b> {editingOrder.OrderID}</p>
                        <p><b>Tên người nhận:</b> {editingOrder.Receiver_name}</p>
                        <p><b>Số điện thoại:</b> {editingOrder.Receiver_phone}</p>
                        <p><b>Tổng số tiền:</b> {editingOrder.Total_amount}</p>
                        <p><b>Ngày tạo:</b> {formatDateTime(editingOrder.created_at)}</p>
                        {editingOrder.completed_at && (
                            <p><b>Ngày hoàn thành:</b> {formatDateTime(editingOrder.completed_at)}</p>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Trạng thái</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    style={{ width: '100%', padding: '8px' }}
                                >
                                    {getStatusOptions(editingOrder.Status).map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" style={{ background: '#28a745', color: '#fff', padding: '8px 15px', marginRight: '10px' }}>Cập nhật</button>
                            <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 15px' }}>Hủy</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Danh sách đơn hàng */}
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
                        <th>Ngày hoàn thành</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAndFilteredOrders.length > 0 ? (
                        sortedAndFilteredOrders.map(item => (
                            <tr key={item.OrderID}>
                                <td>{item.OrderID}</td>
                                <td>{item.UserID}</td>
                                <td>{item.Receiver_name}</td>
                                <td>{item.Receiver_phone}</td>
                                <td>{item.Shipping_address}</td>
                                <td>{item.Total_amount}</td>
                                <td style={{
                                    color: '#fff',
                                    background: getStatusColor(item.Status),
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    textAlign: 'center'
                                }}>
                                    {translateStatus(item.Status)}
                                </td>
                                <td>{formatDateTime(item.created_at)}</td>
                                <td>{formatDateTime(item.completed_at)}</td>
                                <td>
                                    {(item.Status !== 'completed' && item.Status !== 'cancelled') && (
                                        <button
                                            onClick={() => openEditModal(item)}
                                            style={{ background: '#28a745', color: '#fff', padding: '5px 10px' }}
                                        >
                                            Cập nhật
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy đơn hàng phù hợp</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrder;
