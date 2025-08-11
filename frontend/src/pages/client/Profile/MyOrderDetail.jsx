import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetail, cancelOrder } from '../../../api/axiosClient';
import { message, Descriptions, Button, Spin, Tag, Divider, Image } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const MyOrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrderDetail = async () => {
        try {
            const response = await getOrderDetail(orderId);
            console.log('Order detail response:', response.data);
            
            if (response.data.success) {
                setOrder(response.data.data);
            } else {
                setError(response.data.message || 'Không thể tải chi tiết đơn hàng');
            }
        } catch (err) {
            console.error('Lỗi khi tải chi tiết đơn hàng:', err);
            setError(err.response?.data?.message || 'Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await cancelOrder(orderId);
            if (response.data.success) {
                message.success('Đã hủy đơn hàng thành công');
                fetchOrderDetail(); // Refresh data
            } else {
                message.error(response.data.message || 'Hủy đơn hàng thất bại');
            }
        } catch (err) {
            console.error('Lỗi khi hủy đơn hàng:', err);
            message.error(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);

    if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Lỗi: {error}</div>;
    if (!order) return <div style={{ textAlign: 'center', marginTop: '20px' }}>Không tìm thấy đơn hàng</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(-1)}
                style={{ marginBottom: '20px' }}
            >
                Quay lại
            </Button>

            <h2 style={{ marginBottom: '24px' }}>Chi tiết đơn hàng #{order.order_info?.id || order.OrderID}</h2>

            <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="Mã đơn hàng">{order.order_info?.id || order.OrderID}</Descriptions.Item>
                <Descriptions.Item label="Ngày đặt hàng">
                    {new Date(order.order_info?.created_at || order.created_at).toLocaleString('vi-VN')}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(order.order_info?.status || order.Status)}>
                        {translateStatus(order.order_info?.status || order.Status)}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Thông tin người nhận">
                    <div>Tên: {order.order_info?.receiver_name || order.Receiver_name}</div>
                    <div>SĐT: {order.order_info?.receiver_phone || order.Receiver_phone}</div>
                    <div>Địa chỉ: {order.order_info?.shipping_address || order.Shipping_address}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                    {order.order_info?.payment_method || order.paymentGateway?.Name || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Mã giảm giá">
                    {order.order_info?.voucher_code || order.voucher?.Code || 'Không sử dụng'}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                    {new Intl.NumberFormat('vi-VN', { 
                        style: 'currency', 
                        currency: 'VND' 
                    }).format(order.order_info?.total_amount || order.Total_amount)}
                </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Danh sách sản phẩm</Divider>
            
            <div style={{ marginTop: '20px' }}>
                {(order.order_details || order.orderDetails || []).map((item, index) => (
                    <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: '20px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <Image
                            width={80}
                            src={`http://localhost:8000/storage/${item.Image || item.productVariant?.product?.Image}`}
                            alt={item.product_name || item.productVariant?.product?.Name}
                            
                        />
                        <div style={{ marginLeft: '20px', flex: 1 }}>
                            <h4 style={{ marginBottom: '5px' }}>
                                {item.product_name || item.productVariant?.product?.Name}
                            </h4>
                            <div style={{ color: '#666', marginBottom: '5px' }}>
                                Phân loại: {item.variant_name || item.productVariant?.Name}
                                {item.color && ` - Màu: ${item.color}`}
                                {item.size && ` - Size: ${item.size}`}
                            </div>
                            <div>Số lượng: {item.quantity || item.Quantity}</div>
                            <div>
                                Đơn giá: {new Intl.NumberFormat('vi-VN', { 
                                    style: 'currency', 
                                    currency: 'VND' 
                                }).format(item.unit_price || item.Unit_price)}
                            </div>
                            <div style={{ fontWeight: 'bold', marginTop: '5px' }}>
                                Thành tiền: {new Intl.NumberFormat('vi-VN', { 
                                    style: 'currency', 
                                    currency: 'VND' 
                                }).format(item.subtotal || item.Subtotal)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(order.order_info?.status === 'pending' || order.Status === 'pending') && (
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Button 
                        type="primary" 
                        danger
                        onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                                handleCancelOrder(order.order_info?.id || order.OrderID);
                            }
                        }}
                    >
                        Hủy đơn hàng
                    </Button>
                </div>
            )}
        </div>
    );
};

// Các hàm hỗ trợ
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

const getStatusColor = (status) => {
    const colorMap = {
        'pending': 'orange',
        'processing': 'blue',
        'completed': 'green',
        'cancelled': 'red',
        'shipped': 'geekblue'
    };
    return colorMap[status] || 'default';
};

export default MyOrderDetail;