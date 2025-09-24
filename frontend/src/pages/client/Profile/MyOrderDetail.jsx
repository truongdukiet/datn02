import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetail, cancelOrder, submitReview } from "../../../api/axiosClient";
import { message, Descriptions, Button, Spin, Tag, Divider, Image, Rate, Modal, Form, Input, Steps } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { Item } = Descriptions;
const { TextArea } = Input;

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
    const [cancelling, setCancelling] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    
    // Hàm lấy userID từ authentication
    const getCurrentUserID = () => {
        try {
            // Lấy từ localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                return userData.UserID || userData.id || userData.userId;
            }
            
            // Hoặc lấy từ context/auth state nếu có
            // return authContext.userID;
            
            return null;
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    };
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
    const handleCancelOrder = async () => {
        setCancelling(true);
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
        } finally {
            setCancelling(false);
        }
    };

    // Mở modal đánh giá sản phẩm
    // Mở modal đánh giá sản phẩm
// Trong hàm handleReviewClick, thêm kiểm tra kỹ hơn
const handleReviewClick = (product) => {
    const userID = getCurrentUserID();
    if (!userID) {
        message.error('Vui lòng đăng nhập để đánh giá sản phẩm');
        return;
    }

    // Kiểm tra kỹ hơn
    if (product.is_reviewed) {
        message.warning('Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi');
        return;
    }

    // Kiểm tra thêm trong console để debug
    console.log('Product review status:', {
        is_reviewed: product.is_reviewed,
        review: product.review,
        OrderDetailID: product.OrderDetailID,
        ProductVariantID: product.ProductVariantID
    });

    setCurrentProduct(product);
    setReviewModalVisible(true);
    form.resetFields();
};

    // Gửi đánh giá sản phẩm
 const handleReviewSubmit = async () => {
    const userID = getCurrentUserID();
    if (!userID) {
        message.error('Vui lòng đăng nhập để đánh giá sản phẩm');
        return;
    }

    setSubmittingReview(true);
    try {
        const values = await form.validateFields();
        const payload = {
            ProductVariantID: currentProduct.ProductVariantID || currentProduct.productVariant?.id,
            OrderDetailID: currentProduct.OrderDetailID,
            Star_rating: values.rating,
            Comment: values.comment,
            UserID: parseInt(userID), // Đảm bảo là số
        };

        console.log('Submitting review with payload:', payload);

        const response = await submitReview(payload);
        if (response.data.success) {
            message.success('Đã gửi đánh giá thành công');
            setReviewModalVisible(false);
            form.resetFields();
            fetchOrderDetail();
        } else {
            message.error(response.data.message || 'Gửi đánh giá thất bại');
        }
    } catch (err) {
        console.error('Review submission error:', err);
        
        // Hiển thị chi tiết lỗi cụ thể
        if (err.response) {
            console.log('Response data:', err.response.data);
            console.log('Response status:', err.response.status);
            
            if (err.response.status === 422 && err.response.data.errors) {
                const errors = err.response.data.errors;
                Object.keys(errors).forEach(key => {
                    message.error(`${key}: ${errors[key][0]}`);
                });
            } else if (err.response.data.message) {
                message.error(err.response.data.message);
            } else {
                message.error('Lỗi server: ' + err.response.status);
            }
        } else if (err.request) {
            message.error('Không thể kết nối đến server');
        } else {
            message.error('Lỗi: ' + err.message);
        }
    } finally {
        setSubmittingReview(false);
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
        return statusMap[status?.toLowerCase()] || status || 'Chưa có thông tin';
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
        const imagePath = item?.product_variant?.Image || item?.Image || item?.productVariant?.Image || '';
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
                fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zNiAyOEgyOFYzNkgzNlYyOFoiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTMyIDhDMjAuOTU0NSA4IDEyIDE2Ljk1NDUgMTIgMjhTMjAuOTU0NSA0OCAzMiA0OFM1MiAzOS4wNDU1IDUyIDI4UzQzLjA0NTUgOCAzMiA4Wk0zMiA0NEMyMy4xNjM0IDQ0IDE2IDM2LjgzNjYgMTYgMjhTMTkuMTYzNCAxMiAzMiAxMlM0OCAxOS4xNjM0IDQ4IDI4UzQwLjgzNjYgNDQgMzIgNDRaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPg=="
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
            case 'cancelled': return -1;
            default: return -1; // Không xác định
        }
    };

    // Hàm render bước trạng thái
    const renderOrderSteps = () => {
        const steps = [
            {
                title: "Chờ xử lý",
                description: 'Đơn hàng đã được đặt',
                time: order.order_info?.pending_at || order.order_info?.created_at || 'Chưa có thông tin'
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
                time: order.order_info?.completed_at || order.order_info?.delivered_at || 'Chưa có thông tin'
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
    const orderStatus = orderInfo.status || orderInfo.Status;

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
                    <Tag color={getStatusColor(orderStatus)}>
                        {translateStatus(orderStatus)}
                    </Tag>
                    {orderStatus === 'pending' && (
                        <Button
                            type="danger"
                            size="small"
                            onClick={handleCancelOrder}
                            loading={cancelling}
                            style={{ marginLeft: '10px' }}
                        >
                            Hủy đơn hàng
                        </Button>
                    )}
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
                            alignItems: 'flex-start',
                            marginBottom: '20px',
                            paddingBottom: '20px',
                            borderBottom: '1px solid #f0f0f0'
                        }}>
                            {renderProductImage(item)}
                            <div style={{ marginLeft: '20px', flex: 1 }}>
                                <h4 style={{ marginBottom: '5px' }}>
                                    {item?.product_name || item?.product_variant?.product?.name || 'Chưa có tên sản phẩm'}
                                </h4>
                                {renderAttributes(item)}
                                <div>Số lượng: {item?.quantity || '0'}</div>
                                <div>
                                    Đơn giá: {item.Unit_price || item?.unit_price
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Unit_price || item?.unit_price)
                                        : 'Chưa có thông tin'}
                                </div>
                                <div style={{ fontWeight: 'bold', marginTop: '5px' }}>
                                    Thành tiền: {item?.Subtotal || item?.subtotal
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Subtotal || item?.subtotal)
                                        : 'Chưa có thông tin'}
                                </div>

                                {/* Nút đánh giá sản phẩm */}
                                {(orderStatus === 'completed' || orderStatus === 'delivered') && (
                                    <div style={{ marginTop: '10px' }}>
                                        {item.is_reviewed ? (
                                            <Tag color="green" style={{ cursor: 'not-allowed' }}>
                                                Đã đánh giá
                                            </Tag>
                                        ) : (
                                            <Button
                                                type="primary"
                                                size="small"
                                                onClick={() => handleReviewClick(item)}
                                            >
                                                Đánh giá sản phẩm
                                            </Button>
                                        )}
                                    </div>
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

            {/* Modal đánh giá sản phẩm */}
            <Modal
                title={`Đánh giá sản phẩm ${currentProduct?.product_name || currentProduct?.product_variant?.product?.name || 'Chưa có tên sản phẩm'}`}
                open={reviewModalVisible}
                onOk={handleReviewSubmit}
                onCancel={() => {
                    setReviewModalVisible(false);
                    form.resetFields();
                }}
                okText="Gửi đánh giá"
                cancelText="Hủy"
                confirmLoading={submittingReview}
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
                        <TextArea
                            rows={4}
                            placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MyOrderDetail;
