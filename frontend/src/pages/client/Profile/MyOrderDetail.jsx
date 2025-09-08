import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetail, cancelOrder, submitReview } from "../../../api/axiosClient";
import { message, Descriptions, Button, Spin, Tag, Divider, Image, Rate, Modal, Form, Input, Steps } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { Item } = Descriptions;

// Hàm định dạng ngày tháng
const formatOrderDate = (dateString) => {
    if (!dateString || dateString === 'Chưa có thông tin' || dateString === 'undefined') {
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
    const [variantAttributes, setVariantAttributes] = useState({});

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
                        created_at: orderData.order_info?.created_at || orderData.created_at || new Date().toISOString(),
                    },
                    order_details: (orderData.order_details || []).sort((a, b) =>
                        new Date(b.created_at || b.CreatedAt) - new Date(a.created_at || a.CreatedAt)
                    )
                };

                setOrder(processedOrder);
                setLastUpdated(new Date());
                
                // Lấy thuộc tính cho các biến thể sản phẩm
                if (processedOrder.order_details && processedOrder.order_details.length > 0) {
                    fetchAllVariantAttributes(processedOrder.order_details);
                }
            } else {
                setError(response.data.message || 'Không thể tải chi tiết đơn hàng');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    // Lấy thuộc tính cho tất cả các biến thể sản phẩm
    const fetchAllVariantAttributes = async (orderDetails) => {
        const attributesMap = {};
        const API_BASE_URL = 'http://localhost:8000/api';

        await Promise.all(orderDetails.map(async (item) => {
            const variantId = item.ProductVariantID || item.productVariant?.id;
            if (!variantId) return;
            
            try {
                const response = await fetch(`${API_BASE_URL}/variant-attributes?variant_id=${variantId}`);
                const data = await response.json();
                const filteredAttributes = (data.data || []).filter(attr => attr.ProductVariantID === variantId);
                attributesMap[variantId] = filteredAttributes;
            } catch (error) {
                console.error(`Error fetching attributes for variant ${variantId}:`, error);
                attributesMap[variantId] = [];
            }
        }));

        setVariantAttributes(attributesMap);
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
                fetchOrderDetail(); // Tải lại dữ liệu sau khi hủy
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
            const response = await submitReview(payload);
            if(response.data.success){
                message.success('Đã gửi đánh giá thành công');
                setReviewModalVisible(false);
                form.resetFields();
                fetchOrderDetail(); // Tải lại dữ liệu sau khi gửi đánh giá
            } else {
                message.error(response.data.message || 'Gửi đánh giá thất bại');
            }
        } catch (err) {
            message.error(err.response?.data?.message || 'Gửi đánh giá thất bại');
        }
    };

    // Dịch trạng thái sang tiếng Việt
    const translateStatus = (status) => {
        const statusMap = {
            pending: 'Chờ xử lý',
            processing: 'Đang xử lý',
            completed: 'Đã hoàn thành',
            cancelled: 'Đã hủy',
            shipped: 'Đang giao hàng',
            delivered: 'Đã giao hàng'
        };
        return statusMap[status?.toLowerCase()] || 'Chưa có thông tin';
    };

    // Màu sắc cho các tag trạng thái
    const getStatusColor = (status) => {
        const colorMap = {
            pending: 'orange',
            processing: 'blue',
            completed: 'green',
            cancelled: 'red',
            shipped: 'geekblue',
            delivered: 'cyan'
        };
        return colorMap[status?.toLowerCase()] || 'default';
    };

    // Hiển thị ảnh sản phẩm
    const renderProductImage = (item) => {
        const imagePath = item?.product_variant?.Image || item?.Image || '';
        if (!imagePath) {
            return (
                <div style={{
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                    color: '#999',
                    borderRadius: '4px'
                }}>
                    Không có ảnh
                </div>
            );
        }
        
        const imageUrl = imagePath.startsWith('http') ? imagePath : `http://localhost:8000/storage/${imagePath}`;
        
        return (
            <Image 
                width={80} 
                height={80}
                src={imageUrl} 
                alt={item?.product_name || 'Sản phẩm'}
                style={{ objectFit: 'cover', borderRadius: '4px' }}
                fallback="data:image/svg+xml;base64,..."
            />
        );
    };

    // Hiển thị thuộc tính sản phẩm
    const renderAttributes = (item) => {
        const variantId = item?.ProductVariantID || item?.productVariant?.id;
        const attributes = variantAttributes[variantId] || [];
        
        if (!attributes.length) return null;

        return (
            <div style={{ marginBottom: 5, marginTop: 5 }}>
                {attributes.map((attr, idx) => (
                    <span key={idx} style={{
                        backgroundColor: '#f0f0f0',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        marginRight: '5px',
                        display: 'inline-block',
                        marginBottom: '3px'
                    }}>
                        {attr.attribute?.name ? `${attr.attribute.name}: ` : ""}
                        {attr.value}
                    </span>
                ))}
            </div>
        );
    };

    // Xác định bước hiện tại trong tiến trình đơn hàng
    const getStepStatus = () => {
        const status = order?.order_info?.status || order?.Status;
        switch (status?.toLowerCase()) {
            case 'pending': return 0;
            case 'processing': return 1;
            case 'shipped': return 2;
            case 'delivered':
            case 'completed': return 3;
            default: return -1; // Không xác định
        }
    };

    // Hàm render bước trạng thái
    const renderOrderSteps = () => {
        const steps = [
            {
                title: "Chờ xử lý",
                description: 'Đơn hàng đã được đặt',
                time: order.order_info?.pending_at || 'Chưa có thông tin'
            },
            {
                title: "Đang xử lý",
                description: 'Đơn hàng đang được chuẩn bị',
                time: order.order_info?.processing_at || 'Chưa có thông tin'
            },
            {
                title: "Đang giao hàng",
                description: 'Đơn hàng đã được vận chuyển',
                time: order.order_info?.shipped_at || 'Chưa có thông tin'
            },
            {
                title: "Đã hoàn thành",
                description: 'Đơn hàng đã được giao thành công',
                time: order.order_info?.completed_at || 'Chưa có thông tin'
            }
        ];

        return (
            <Steps current={getStepStatus()} status={order.order_info?.cancelled_at ? 'error' : 'process'}>
                {steps.map((step, index) => (
                    <Step 
                        key={index} 
                        title={step.title} 
                        description={(
                            <div>
                                {step.description}
                                <div style={{ fontSize: '12px', color: '#888' }}>
                                    Thời gian: {formatOrderDate(step.time)}
                                </div>
                            </div>
                        )} 
                    />
                ))}
            </Steps>
        );
    };

    // Hiển thị loading khi đang tải dữ liệu
    if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Lỗi: {error}</div>;
    if (!order) return <div style={{ textAlign: 'center', marginTop: '20px' }}>Không tìm thấy đơn hàng</div>;

    const orderInfo = order?.order_info || order || {};

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

            <h2 style={{ marginBottom: '24px' }}>Chi tiết đơn hàng #{orderInfo.id || orderInfo.OrderID || 'Chưa có thông tin'}</h2>

            <div style={{ textAlign: 'right', marginBottom: '10px', color: '#666', fontSize: '0.9em' }}>
                Cập nhật lần cuối: {lastUpdated ? formatOrderDate(lastUpdated) : 'Đang tải...'}
            </div>

            <Descriptions bordered column={1} size="middle">
                <Item label="Mã đơn hàng">{orderInfo.id || orderInfo.OrderID || 'Chưa có thông tin'}</Item>
                <Item label="Ngày đặt hàng">{formatOrderDate(orderInfo.created_at || orderInfo.CreatedAt)}</Item>
                <Item label="Trạng thái">
                    <Tag color={getStatusColor(orderInfo.status || orderInfo.Status)}>
                        {translateStatus(orderInfo.status || orderInfo.Status)}
                    </Tag>
                </Item>
                <Item label="Thông tin người nhận">
                    <div>Tên: {orderInfo.receiver_name || 'Chưa có thông tin'}</div>
                    <div>SĐT: {orderInfo.receiver_phone || 'Chưa có thông tin'}</div>
                    <div>Địa chỉ: {orderInfo.shipping_address || 'Chưa có thông tin'}</div>
                </Item>
                <Item label="Phương thức thanh toán">{orderInfo.payment_method || 'Chưa có thông tin'}</Item>
                <Item label="Mã giảm giá">{orderInfo.voucher_code || 'Không sử dụng'}</Item>
                <Item label="Tổng tiền">
                    {orderInfo.total_amount || orderInfo.Total_amount
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderInfo.total_amount || orderInfo.Total_amount)
                        : 'Chưa có thông tin'}
                </Item>
            </Descriptions>

            <Divider orientation="left">Tiến trình đơn hàng</Divider>
            {renderOrderSteps()}

            <Divider orientation="left">Danh sách sản phẩm</Divider>

            <div style={{ marginTop: '20px' }}>
                {(order.order_details || []).length > 0 ? (
                    (order.order_details || []).map((item, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px',
                            paddingBottom: '20px',
                            borderBottom: '1px solid #f0f0f0'
                        }}>
                            {renderProductImage(item)}
                            <div style={{ marginLeft: '20px', flex: 1 }}>
                                <h4 style={{ marginBottom: '5px' }}>
                                    {item?.product_name || 'Chưa có tên sản phẩm'}
                                </h4>
                                {renderAttributes(item)}
                                <div>Số lượng: {item?.quantity || '0'}</div>
                                <div>
                                    Đơn giá: {item.Unit_price
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Unit_price)
                                        : 'Chưa có thông tin'}
                                </div>
                                <div style={{ fontWeight: 'bold', marginTop: '5px' }}>
                                    Thành tiền: {item?.Subtotal
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Subtotal)
                                        : 'Chưa có thông tin'}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                        Không có sản phẩm nào trong đơn hàng này
                    </div>
                )}
            </div>

            {/* Modal đánh giá sản phẩm */}
            <Modal
                title={`Đánh giá sản phẩm ${currentProduct?.product_name || 'Chưa có tên sản phẩm'}`}
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