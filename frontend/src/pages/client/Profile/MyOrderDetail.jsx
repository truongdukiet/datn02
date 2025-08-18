import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetail, cancelOrder, submitReview } from "../../../api/axiosClient";
import { message, Descriptions, Button, Spin, Tag, Divider, Image, Rate, Modal, Form, Input, Steps } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Step } = Steps;

const MyOrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [form] = Form.useForm();

    const fetchOrderDetail = async () => {
        try {
            const response = await getOrderDetail(orderId);
            if (response.data.success) {
                const sortedOrder = {
                    ...response.data.data,
                    order_details: [...(response.data.data.order_details || [])].sort((a, b) => new Date(b.created_at || b.CreatedAt) - new Date(a.created_at || a.CreatedAt)),
                    orderDetails: [...(response.data.data.orderDetails || [])].sort((a, b) => new Date(b.created_at || b.CreatedAt) - new Date(a.created_at || a.CreatedAt))
                };
                setOrder(sortedOrder);
            } else {
                setError(response.data.message || 'Không thể tải chi tiết đơn hàng');
            }
        } catch (err) {
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
                fetchOrderDetail();
            } else {
                message.error(response.data.message || 'Hủy đơn hàng thất bại');
            }
        } catch (err) {
            message.error(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleReviewClick = (product) => {
        setCurrentProduct(product);
        setReviewModalVisible(true);
    };

    const handleReviewSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                OrderDetailID: currentProduct.OrderDetailID,
                ProductVariantID: currentProduct.ProductVariantID,
                Star_rating: values.rating,
                Comment: values.comment
            };
            await submitReview(payload);
            message.success('Đã gửi đánh giá thành công');
            setReviewModalVisible(false);
            form.resetFields();
        } catch (err) {
            console.error('Lỗi khi gửi đánh giá:', err);
            message.error('Gửi đánh giá thất bại');
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);

    const formatOrderDate = (dateString) => {
        if (!dateString) {
            return 'Đang cập nhật';
        }

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return 'Đang cập nhật';
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const statusText = (order?.order_info?.status || order?.Status || '').toLowerCase();
    const canReview = ['completed', 'shipped', 'delivered', 'đã giao', 'đã hoàn thành'].includes(statusText);

    // Xác định trạng thái hiện tại cho Steps
    const getStepStatus = () => {
        switch (statusText) {
            case 'pending':
                return 0;
            case 'processing':
                return 1;
            case 'shipped':
                return 2;
            case 'delivered':
            case 'completed':
                return 3;
            default:
                return -1; // Đã hủy hoặc không xác định
        }
    };

    // Kiểm tra nếu đơn hàng bị hủy
    const isCancelled = statusText === 'cancelled';

    // Logic hiển thị
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
                    {formatOrderDate(order.order_info?.created_at || order.created_at || order.CreatedAt)}
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
                    {order.order_info?.payment_method || order.paymentGateway?.Name || 'Chưa xác định'}
                </Descriptions.Item>
                <Descriptions.Item label="Mã giảm giá">
                    {order.order_info?.voucher_code || order.voucher?.Code || 'Không sử dụng'}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.order_info?.total_amount || order.Total_amount)}
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Thêm Steps Component */}
            <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>Trạng thái đơn hàng</h3>
            <div style={{ marginBottom: '40px' }}>
                <Steps current={getStepStatus()} status={isCancelled ? 'error' : 'process'}>
                    <Step title="Chờ xử lý" description="Đơn hàng đang chờ xác nhận." />
                    <Step title="Đang xử lý" description="Đơn hàng đang được chuẩn bị." />
                    <Step title="Đang giao hàng" description="Đơn hàng đang được vận chuyển." />
                    <Step title="Đã hoàn thành" description="Đơn hàng đã được giao thành công." />
                </Steps>
            </div>

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
                                Đơn giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unit_price || item.Unit_price)}
                            </div>
                            <div style={{ fontWeight: 'bold', marginTop: '5px' }}>
                                Thành tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.subtotal || item.Subtotal)}
                            </div>
                            <div style={{ color: '#888', fontSize: '0.9em', marginTop: '5px' }}>
                                Ngày đặt: {formatOrderDate(item.created_at || item.CreatedAt)}
                            </div>

                            {canReview && (
                                <Button type="link" style={{ padding: 0, marginTop: '10px' }} onClick={() => handleReviewClick(item)}>
                                    Đánh giá sản phẩm
                                </Button>
                            )}
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

            <Modal
                title={`Đánh giá sản phẩm ${currentProduct?.product_name || currentProduct?.productVariant?.product?.Name}`}
                visible={reviewModalVisible}
                onOk={handleReviewSubmit}
                onCancel={() => {
                    setReviewModalVisible(false);
                    form.resetFields();
                }}
                okText="Gửi đánh giá"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="rating"
                        label="Đánh giá"
                        rules={[{ required: true, message: 'Vui lòng chọn số sao đánh giá' }]}
                    >
                        <Rate />
                    </Form.Item>
                    <Form.Item
                        name="comment"
                        label="Nhận xét"
                        rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

const translateStatus = (status) => {
    const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'completed': 'Đã hoàn thành',
        'cancelled': 'Đã hủy',
        'shipped': 'Đang giao hàng',
        'delivered': 'Đã giao hàng'
    };
    return statusMap[status.toLowerCase()] || status;
};

const getStatusColor = (status) => {
    const colorMap = {
        'pending': 'orange',
        'processing': 'blue',
        'completed': 'green',
        'cancelled': 'red',
        'shipped': 'geekblue',
        'delivered': 'cyan'
    };
    return colorMap[status.toLowerCase()] || 'default';
};

export default MyOrderDetail;
