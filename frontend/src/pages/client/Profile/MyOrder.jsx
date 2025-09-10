import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Input,
  Select,
  Button,
  message,
  Tag,
  Spin,
  Space
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getOrdersByUser, cancelOrder } from '../../../api/axiosClient';

const { Search } = Input;
const { Option } = Select;

const MyOrder = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.UserID;

    const translateStatus = (status) => {
        const statusMap = {
            'pending': 'Chờ xử lý',
            'processing': 'Đang xử lý',
            'completed': 'Đã hoàn thành',
            'cancelled': 'Đã hủy',
            'shipped': 'Đang giao hàng'
        };
        return statusMap[status] || status;
    };

    const statusColors = {
        'pending': 'orange',
        'processing': 'blue',
        'completed': 'green',
        'cancelled': 'red',
        'shipped': 'geekblue'
    };

    const fetchOrders = async () => {
        if (!userId) {
            setError('Vui lòng đăng nhập để xem đơn hàng');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await getOrdersByUser(userId);

            if (response.data && response.data.success) {
                const formattedOrders = response.data.data.map(order => ({
                    ...order,
                    created_at: order.created_at
                        ? new Date(order.created_at).toISOString()
                        : new Date().toISOString()
                }));
                setOrders(formattedOrders);
                setError(null);
            } else {
                setError(response.data?.message || 'Không thể tải danh sách đơn hàng');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [userId]);

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await cancelOrder(orderId);
            if (response.data.success) {
                message.success('Hủy đơn hàng thành công');
                fetchOrders();
            } else {
                message.error(response.data.message || 'Hủy đơn hàng thất bại');
            }
        } catch (err) {
            message.error(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Đang cập nhật';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Đang cập nhật';

        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return date.toLocaleString('vi-VN', options);
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.Status === filterStatus;
        const matchesSearch = searchTerm === '' ||
            (order.Receiver_name && order.Receiver_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.Receiver_phone && order.Receiver_phone.includes(searchTerm)) ||
            (order.OrderID && order.OrderID.toString().includes(searchTerm));

        return matchesStatus && matchesSearch;
    });

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'OrderID',
            key: 'OrderID',
            render: (id) => id || 'N/A',
        },
        {
            title: 'Người nhận',
            dataIndex: 'Receiver_name',
            key: 'Receiver_name',
            render: (name) => name || 'N/A',
        },
        {
            title: 'SĐT',
            dataIndex: 'Receiver_phone',
            key: 'Receiver_phone',
            render: (phone) => phone || 'N/A',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'Total_amount',
            key: 'Total_amount',
            render: (amount) => amount ? new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(amount) : 'N/A',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'Status',
            key: 'Status',
            render: (status) => (
                <Tag color={statusColors[status]}>
                    {translateStatus(status)}
                </Tag>
            ),
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'Pending_at',
            key: 'Pending_at',
            render: formatDateTime,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/myorder/${record.OrderID}`);
                        }}
                    >
                        Chi tiết
                    </Button>
                    {record.Status === 'pending' && (
                        <Button
                            type="link"
                            danger
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancelOrder(record.OrderID);
                            }}
                        >
                            Hủy đơn
                        </Button>
                    )}
                </Space>
            ),
        },
        {
            title: 'Ngày xử lý',
            dataIndex: 'Processing_at',
            key: 'Processing_at',
            render: (_, item) => (
                <>
                    <div>{formatDateTime(item.Pending_at)}</div>
                    {item.Status === 'processing' && <div>{formatDateTime(item.Processing_at)}</div>}
                    {item.Status === 'shipped' && <div>{formatDateTime(item.Shipping_at)}</div>}
                    {item.Status === 'completed' && <div>{formatDateTime(item.Completed_at)}</div>}
                </>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={fetchOrders}
                    >
                        Thử lại
                    </Button>
                </div>
            ) : (
                <>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                        flexWrap: 'wrap',
                        gap: '15px'
                    }}>
                        <h2>Đơn hàng của tôi</h2>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <Search
                                placeholder="Tìm kiếm..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: 300 }}
                            />
                            <Select
                                value={filterStatus}
                                onChange={setFilterStatus}
                                style={{ width: 200 }}
                            >
                                <Option value="all">Tất cả</Option>
                                <Option value="pending">Chờ xử lý</Option>
                                <Option value="processing">Đang xử lý</Option>
                                <Option value="shipped">Đang giao</Option>
                                <Option value="completed">Hoàn thành</Option>
                                <Option value="cancelled">Đã hủy</Option>
                            </Select>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={fetchOrders}
                            >
                                Làm mới
                            </Button>
                        </div>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredOrders}
                        rowKey="OrderID"
                        loading={loading}
                        locale={{ emptyText: 'Không có đơn hàng nào' }}
                        onRow={(record) => ({
                            onClick: () => navigate(`/myorder/${record.OrderID}`),
                        })}
                    />
                </>
            )}
        </div>
    );
};

export default MyOrder;