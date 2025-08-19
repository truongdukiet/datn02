import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetail, cancelOrder, submitReview } from "../../../api/axiosClient";
import { message, Descriptions, Button, Spin, Tag, Divider, Image, Rate, Modal, Form, Input, Steps, Timeline, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { Item } = Descriptions;

// Hàm định dạng ngày tháng
const formatOrderDate = (dateString) => {
    if (!dateString || dateString === 'Chưa có thông tin') {
        return 'Chưa có thông tin';
    }

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Ngày không hợp lệ';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
        console.error('Lỗi định dạng ngày:', e);
        return 'Ngày không hợp lệ';
    }
};

// Thời gian tự động cập nhật dữ liệu (5 giây)
const POLLING_INTERVAL = 5000;

const MyOrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [form] = Form.useForm();
    const [lastUpdated, setLastUpdated] = useState(null);

    // Hàm lấy chi tiết đơn hàng
    const fetchOrderDetail = async () => {
        try {
            const response = await getOrderDetail(orderId);
            if (response.data.success) {
                const orderData = response.data.data;
                const processedOrder = {
                    ...orderData,
                    order_info: {
                        ...orderData.order_info,
                        // Giữ nguyên ngày tạo đơn hàng ban đầu
                        created_at: orderData.order_info?.created_at || new Date().toISOString(),
                        // Cập nhật thời gian thực cho các trạng thái
                        processing_at: orderData.order_info?.processing_at ||
                                     (['processing', 'shipped', 'completed'].includes(orderData.order_info?.Status)
                                      ? new Date().toISOString()
                                      : null),
                        shipped_at: orderData.order_info?.shipped_at ||
                                  (['shipped', 'completed'].includes(orderData.order_info?.Status)
                                   ? new Date().toISOString()
                                   : null),
                        completed_at: orderData.order_info?.completed_at ||
                                    (orderData.order_info?.Status === 'completed'
                                     ? new Date().toISOString()
                                     : null),
                        cancelled_at: orderData.order_info?.cancelled_at ||
                                    (orderData.order_info?.Status === 'cancelled'
                                     ? new Date().toISOString()
                                     : null)
                    },
                    // Sắp xếp sản phẩm theo ngày tạo (mới nhất lên đầu)
                    order_details: [...(orderData.order_details || [])].sort((a, b) =>
                        new Date(b.created_at || b.CreatedAt) - new Date(a.created_at || a.CreatedAt)
                    )
                };

                setOrder(processedOrder);
                setLastUpdated(new Date());
            } else {
                setError(response.data.message || 'Không thể tải chi tiết đơn hàng');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi component mount và thiết lập polling
    useEffect(() => {
        fetchOrderDetail();

        const intervalId = setInterval(fetchOrderDetail, POLLING_INTERVAL);
        return () => clearInterval(intervalId);
    }, [orderId]);

    // Hàm hủy đơn hàng
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

    // Mở modal đánh giá sản phẩm
    const handleReviewClick = (product) => {
        setCurrentProduct(product);
        setReviewModalVisible(true);
    };

    // Gửi đánh giá sản phẩm
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

    // Dịch trạng thái sang tiếng Việt
    const translateStatus = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'Chờ xử lý';
            case 'processing': return 'Đang xử lý';
            case 'completed': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            case 'shipped': return 'Đang giao hàng';
            case 'delivered': return 'Đã giao hàng';
            default: return status || 'Chưa có thông tin';
        }
    };

    // Màu sắc cho các tag trạng thái
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'orange';
            case 'processing': return 'blue';
            case 'completed': return 'green';
            case 'cancelled': return 'red';
            case 'shipped': return 'geekblue';
            case 'delivered': return 'cyan';
            default: return 'default';
        }
    };

    const statusText = (order?.order_info?.status || order?.Status || '').toLowerCase();
    const canReview = ['completed', 'shipped', 'delivered', 'đã giao', 'đã hoàn thành'].includes(statusText);

    // Xác định bước hiện tại trong tiến trình đơn hàng
    const getStepStatus = () => {
        switch (statusText) {
            case 'pending': return 0;
            case 'processing': return 1;
            case 'shipped': return 2;
            case 'delivered':
            case 'completed': return 3;
            default: return -1;
        }
    };

    const isCancelled = statusText === 'cancelled';

    // Tạo timeline lịch sử trạng thái
    const getStatusTimeline = () => {
        const statusHistory = order?.status_history || order?.StatusHistory || [];
        const orderInfo = order?.order_info || order || {};
        const currentStatus = orderInfo.status || orderInfo.Status;

        // Ưu tiên sử dụng lịch sử từ API nếu có
        if (statusHistory.length > 0) {
            return statusHistory
                .map(item => ({
                    status: item.status,
                    description: getStatusDescription(item.status),
                    timestamp: item.created_at || item.timestamp || 'Chưa có thông tin'
                }))
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        }

        // Tạo timeline từ các mốc thời gian nếu không có lịch sử từ API
        const items = [];

        // Mốc tạo đơn hàng (luôn có)
        if (orderInfo.created_at || orderInfo.CreatedAt) {
            items.push({
                status: 'pending',
                description: 'Đơn hàng đã được đặt',
                timestamp: orderInfo.created_at || orderInfo.CreatedAt
            });
        }

        // Thêm các mốc thời gian khác theo trạng thái hiện tại
        if (orderInfo.processing_at && ['processing', 'shipped', 'delivered', 'completed'].includes(currentStatus)) {
            items.push({
                status: 'processing',
                description: 'Đơn hàng đang được xử lý',
                timestamp: orderInfo.processing_at
            });
        }

        if (orderInfo.shipped_at && ['shipped', 'delivered', 'completed'].includes(currentStatus)) {
            items.push({
                status: 'shipped',
                description: 'Đơn hàng đã được vận chuyển',
                timestamp: orderInfo.shipped_at
            });
        }

        if (orderInfo.delivered_at && ['delivered', 'completed'].includes(currentStatus)) {
            items.push({
                status: 'delivered',
                description: 'Đơn hàng đã được giao',
                timestamp: orderInfo.delivered_at
            });
        }

        if (orderInfo.completed_at && currentStatus === 'completed') {
            items.push({
                status: 'completed',
                description: 'Đơn hàng đã hoàn thành',
                timestamp: orderInfo.completed_at
            });
        }

        if (orderInfo.cancelled_at && currentStatus === 'cancelled') {
            items.push({
                status: 'cancelled',
                description: 'Đơn hàng đã bị hủy',
                timestamp: orderInfo.cancelled_at
            });
        }

        return items;
    };

    // Mô tả chi tiết cho từng trạng thái
    const getStatusDescription = (status) => {
        return translateStatus(status) + ' - ' + (
            status?.toLowerCase() === 'pending' ? 'Đơn hàng đã được đặt' :
            status?.toLowerCase() === 'processing' ? 'Đơn hàng đang được xử lý' :
            status?.toLowerCase() === 'shipped' ? 'Đơn hàng đã được vận chuyển' :
            status?.toLowerCase() === 'delivered' ? 'Đơn hàng đã được giao thành công' :
            status?.toLowerCase() === 'completed' ? 'Đơn hàng đã hoàn thành' :
            status?.toLowerCase() === 'cancelled' ? 'Đơn hàng đã bị hủy' :
            'Cập nhật trạng thái đơn hàng'
        );
    };

    // Hiển thị ảnh sản phẩm
    const renderProductImage = (imagePath) => {
        if (!imagePath) {
            return (
                <div style={{
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                    color: '#999'
                }}>
                    Không có ảnh
                </div>
            );
        }
        return <Image width={80} src={`http://localhost:8000/storage/${imagePath}`} />;
    };

    // Hiển thị loading khi đang tải dữ liệu
    if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />;

    // Hiển thị lỗi nếu có
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Lỗi: {error}</div>;

    // Hiển thị thông báo nếu không tìm thấy đơn hàng
    if (!order) return <div style={{ textAlign: 'center', marginTop: '20px' }}>Không tìm thấy đơn hàng</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            {/* Nút quay lại */}
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: '20px' }}
            >
                Quay lại
            </Button>

            {/* Tiêu đề */}
            <h2 style={{ marginBottom: '24px' }}>Chi tiết đơn hàng #{order.order_info?.id || order.OrderID || 'Chưa có thông tin'}</h2>

            {/* Thời gian cập nhật cuối */}
            <div style={{ textAlign: 'right', marginBottom: '10px', color: '#666', fontSize: '0.9em' }}>
                Cập nhật lần cuối: {lastUpdated ? formatOrderDate(lastUpdated) : 'Đang tải...'}
            </div>

            {/* Thông tin chung đơn hàng */}
            <Descriptions bordered column={1} size="middle">
                <Item label="Mã đơn hàng">{order.order_info?.id || order.OrderID || 'Chưa có thông tin'}</Item>
                <Item label="Ngày đặt hàng">
                    {formatOrderDate(order.order_info?.created_at || order.created_at || order.CreatedAt)}
                </Item>
                <Item label="Trạng thái">
                    <Tag color={getStatusColor(order.order_info?.status || order.Status)}>
                        {translateStatus(order.order_info?.status || order.Status)}
                    </Tag>
                </Item>
                <Item label="Thông tin người nhận">
                    <div>Tên: {order.order_info?.receiver_name || order.Receiver_name || 'Chưa có thông tin'}</div>
                    <div>SĐT: {order.order_info?.receiver_phone || order.Receiver_phone || 'Chưa có thông tin'}</div>
                    <div>Địa chỉ: {order.order_info?.shipping_address || order.Shipping_address || 'Chưa có thông tin'}</div>
                </Item>
                <Item label="Phương thức thanh toán">
                    {order.order_info?.payment_method || order.paymentGateway?.Name || 'Chưa xác định'}
                </Item>
                <Item label="Mã giảm giá">
                    {order.order_info?.voucher_code || order.voucher?.Code || 'Không sử dụng'}
                </Item>
                <Item label="Tổng tiền">
                    {order.order_info?.total_amount || order.Total_amount
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.order_info?.total_amount || order.Total_amount)
                        : 'Chưa có thông tin'}
                </Item>
            </Descriptions>

            <Divider />

            {/* Trạng thái đơn hàng dưới dạng Steps */}
            <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>Trạng thái đơn hàng</h3>
            <div style={{ marginBottom: '40px' }}>
                <Steps current={getStepStatus()} status={isCancelled ? 'error' : 'process'}>
                    <Step title="Chờ xử lý" description="Đơn hàng đang chờ xác nhận." />
                    <Step title="Đang xử lý" description="Đơn hàng đang được chuẩn bị." />
                    <Step title="Đang giao hàng" description="Đơn hàng đang được vận chuyển." />
                    <Step title="Đã hoàn thành" description="Đơn hàng đã được giao thành công." />
                </Steps>
            </div>

            {/* Timeline lịch sử trạng thái */}
            <Divider orientation="left">Lịch sử trạng thái</Divider>
            <Card style={{ marginBottom: '24px' }}>
                <Timeline mode="left" pending={statusText !== 'completed' && statusText !== 'cancelled' ? "Đang cập nhật..." : false}>
                    {getStatusTimeline().map((item, index) => (
                        <Timeline.Item
                            key={index}
                            label={formatOrderDate(item.timestamp)}
                            color={getStatusColor(item.status)}
                        >
                            <strong>{translateStatus(item.status)}</strong>
                            <p>{item.description}</p>
                            {item.timestamp && item.timestamp !== 'Chưa có thông tin' && (
                                <div style={{ color: '#888', fontSize: '0.85em' }}>
                                    {formatOrderDate(item.timestamp)}
                                </div>
                            )}
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Card>

            {/* Danh sách sản phẩm */}
            <Divider orientation="left">Danh sách sản phẩm</Divider>

            <div style={{ marginTop: '20px' }}>
                {(order.order_details || order.orderDetails || []).length > 0 ? (
                    (order.order_details || order.orderDetails || []).map((item, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px',
                            paddingBottom: '20px',
                            borderBottom: '1px solid #f0f0f0'
                        }}>
                            {renderProductImage(item.Image || item.productVariant?.product?.Image)}
                            <div style={{ marginLeft: '20px', flex: 1 }}>
                                <h4 style={{ marginBottom: '5px' }}>
                                    {item.product_name || item.productVariant?.product?.Name || 'Chưa có tên sản phẩm'}
                                </h4>
                                <div style={{ color: '#666', marginBottom: '5px' }}>
                                    Phân loại: {item.variant_name || item.productVariant?.Name || 'Chưa có thông tin'}
                                    {item.color && ` - Màu: ${item.color}`}
                                    {item.size && ` - Size: ${item.size}`}
                                </div>
                                <div>Số lượng: {item.quantity || item.Quantity || '0'}</div>
                                <div>
                                    Đơn giá: {item.unit_price || item.Unit_price
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unit_price || item.Unit_price)
                                        : 'Chưa có thông tin'}
                                </div>
                                <div style={{ fontWeight: 'bold', marginTop: '5px' }}>
                                    Thành tiền: {item.subtotal || item.Subtotal
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.subtotal || item.Subtotal)
                                        : 'Chưa có thông tin'}
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
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                        Không có sản phẩm nào trong đơn hàng này
                    </div>
                )}
            </div>

            {/* Nút hủy đơn hàng (chỉ hiện khi đơn ở trạng thái pending) */}
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

            {/* Modal đánh giá sản phẩm */}
            <Modal
                title={`Đánh giá sản phẩm ${currentProduct?.product_name || currentProduct?.productVariant?.product?.Name || 'Chưa có tên sản phẩm'}`}
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

export default MyOrderDetail;
