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
                        // Giữ nguyên ngày tạo đơn hàng ban đầu
                        created_at: orderData.order_info?.created_at || orderData.created_at || new Date().toISOString(),
                        // Cập nhật thời gian thực cho các trạng thái
                        processing_at: orderData.order_info?.processing_at ||
                                     (['processing', 'shipped', 'completed', 'delivered'].includes(orderData.order_info?.Status)
                                      ? new Date().toISOString()
                                      : null),
                        shipped_at: orderData.order_info?.shipped_at ||
                                  (['shipped', 'completed', 'delivered'].includes(orderData.order_info?.Status)
                                   ? new Date().toISOString()
                                   : null),
                        completed_at: orderData.order_info?.completed_at ||
                                    (orderData.order_info?.Status === 'completed'
                                     ? new Date().toISOString()
                                     : null),
                        delivered_at: orderData.order_info?.delivered_at ||
                                    (orderData.order_info?.Status === 'delivered'
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
        try {
            const attributesMap = {};
            const API_BASE_URL = 'http://localhost:8000/api';

            const attributePromises = orderDetails.map(async (item) => {
                try {
                    const variantId = item.ProductVariantID || item.productVariant?.id;
                    if (!variantId) return;
                    
                    const response = await fetch(
                        `${API_BASE_URL}/variant-attributes?variant_id=${variantId}`
                    );
                    const data = await response.json();
                    
                    const filteredAttributes = (data.data || []).filter(
                        attr => attr.ProductVariantID === variantId
                    );
                    attributesMap[variantId] = filteredAttributes;
                } catch (error) {
                    console.error(`Error fetching attributes for variant ${item.ProductVariantID}:`, error);
                    attributesMap[item.ProductVariantID] = [];
                }
            });

            await Promise.all(attributePromises);
            setVariantAttributes(attributesMap);
        } catch (error) {
            console.error('Error fetching variant attributes:', error);
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
            console.error('Lỗi khi gửi đánh giá:', err);
            message.error(err.response?.data?.message || 'Gửi đánh giá thất bại');
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

    // Hiển thị ảnh sản phẩm - SỬA LẠI để xử lý trường hợp undefined
    const renderProductImage = (item) => {
        // Debug để xem cấu trúc dữ liệu
        console.log('Item data:', item);
        
        // Tìm ảnh với xử lý lỗi cho các trường hợp undefined
        let imagePath = item?.Image;
        console.log(item?.Image);
        console.log(item?.variants?.Image);
        console.log(item?.productVariant?.product?.Image);


        // Nếu không tìm thấy ảnh
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
        
        // Sử dụng đúng định dạng URL
        const imageUrl = imagePath.startsWith('http') 
            ? imagePath 
            : `http://localhost:8000/storage/${imagePath}`;
            
        return (
            <Image 
                width={80} 
                height={80}
                src={imageUrl} 
                alt={item?.product_name || item?.productVariant?.product?.Name || 'Sản phẩm'}
                style={{ objectFit: 'cover', borderRadius: '4px' }}
                fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0MCIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxMiI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=="
            />
        );
    };

    // Hiển thị thuộc tính sản phẩm
    const renderAttributes = (item) => {
        const variantId = item?.ProductVariantID || item?.productVariant?.id;
        if (!variantId) return null;
        
        const attributes = variantAttributes[variantId] || [];
        
        if (!attributes.length) return null;

        return (
            <div className="attribute-tags" style={{ marginBottom: 5, marginTop: 5 }}>
                {attributes.map((attr, idx) => (
                    <span key={idx} className="attribute-tag" style={{
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

    const statusText = (order?.order_info?.status || order?.Status || '').toLowerCase();
    const canReview = ['completed', 'delivered'].includes(statusText);

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

    // Mô tả chi tiết cho từng trạng thái (đã bỏ thời gian)
    const getStatusDescription = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'Đơn hàng đã được đặt';
            case 'processing': return 'Đơn hàng đang được chuẩn bị';
            case 'shipped': return 'Đơn hàng đã được vận chuyển';
            case 'delivered':
            case 'completed': return 'Đơn hàng đã được giao thành công';
            case 'cancelled': return 'Đơn hàng đã bị hủy';
            default: return `Chưa có thông tin`;
        }
    };

    // Hiển thị loading khi đang tải dữ liệu
    if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />;

    // Hiển thị lỗi nếu có
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Lỗi: {error}</div>;

    // Hiển thị thông báo nếu không tìm thấy đơn hàng
    if (!order) return <div style={{ textAlign: 'center', marginTop: '20px' }}>Không tìm thấy đơn hàng</div>;

    const orderInfo = order?.order_info || order || {};

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
            <h2 style={{ marginBottom: '24px' }}>Chi tiết đơn hàng #{orderInfo.id || orderInfo.OrderID || 'Chưa có thông tin'}</h2>

            {/* Thời gian cập nhật cuối */}
            <div style={{ textAlign: 'right', marginBottom: '10px', color: '#666', fontSize: '0.9em' }}>
                Cập nhật lần cuối: {lastUpdated ? formatOrderDate(lastUpdated) : 'Đang tải...'}
            </div>

            {/* Thông tin chung đơn hàng */}
            <Descriptions bordered column={1} size="middle">
                <Item label="Mã đơn hàng">{orderInfo.id || orderInfo.OrderID || 'Chưa có thông tin'}</Item>
                <Item label="Ngày đặt hàng">
                    {formatOrderDate(orderInfo.created_at || orderInfo.CreatedAt)}
                </Item>
                <Item label="Trạng thái">
                    <Tag color={getStatusColor(orderInfo.status || orderInfo.Status)}>
                        {translateStatus(orderInfo.status || orderInfo.Status)}
                    </Tag>
                </Item>
                <Item label="Thông tin người nhận">
                    <div>Tên: {orderInfo.receiver_name || orderInfo.Receiver_name || 'Chưa có thông tin'}</div>
                    <div>SĐT: {orderInfo.receiver_phone || orderInfo.Receiver_phone || 'Chưa có thông tin'}</div>
                    <div>Địa chỉ: {orderInfo.shipping_address || orderInfo.Shipping_address || 'Chưa có thông tin'}</div>
                </Item>
                <Item label="Phương thức thanh toán">
                    {orderInfo.payment_method || order.paymentGateway?.Name || 'thanh toán VNPAY '}
                </Item>
                <Item label="Mã giảm giá">
                    {orderInfo.voucher_code || order.voucher?.Code || 'Không sử dụng'}
                </Item>
                <Item label="Tổng tiền">
                    {orderInfo.total_amount || orderInfo.Total_amount
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderInfo.total_amount || orderInfo.Total_amount)
                        : 'Chưa có thông tin'}
                </Item>
            </Descriptions>

            <Divider />

            {/* Trạng thái đơn hàng dưới dạng Steps (đã bỏ thời gian) */}
            <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>Tiến trình đơn hàng</h3>
            <div style={{ marginBottom: '40px' }}>
                <Steps current={getStepStatus()} status={isCancelled ? 'error' : 'process'}>
                    <Step
                        title="Chờ xử lý"
                        description={getStatusDescription('pending')}
                    />
                    <Step
                        title="Đang xử lý"
                        description={getStatusDescription('processing')}
                    />
                    <Step
                        title="Đang giao hàng"
                        description={getStatusDescription('shipped')}
                    />
                    <Step
                        title="Đã hoàn thành"
                        description={getStatusDescription('completed')}
                    />
                </Steps>
            </div>

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
                            {renderProductImage(item)}
                            <div style={{ marginLeft: '20px', flex: 1 }}>
                                <h4 style={{ marginBottom: '5px' }}>
                                    {item?.product_name || item?.productVariant?.product?.Name || 'Chưa có tên sản phẩm'}
                                </h4>
                                
                                {/* Hiển thị thuộc tính sản phẩm */}
                                {renderAttributes(item)}
                                
                                <div>Số lượng: {item?.quantity || item?.Quantity || '0'}</div>
                                <div>
                                    Đơn giá: {item?.unit_price || item?.Unit_price
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unit_price || item.Unit_price)
                                        : 'Chưa có thông tin'}
                                </div>
                                <div style={{ fontWeight: 'bold', marginTop: '5px' }}>
                                    Thành tiền: {item?.subtotal || item?.Subtotal
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.subtotal || item.Subtotal)
                                        : 'Chưa có thông tin'}
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
            {(orderInfo.status === 'pending' || orderInfo.Status === 'pending') && (
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Button
                        type="primary"
                        danger
                        onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                                handleCancelOrder(orderInfo.id || orderInfo.OrderID);
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
                        rules={[{ required: 'Vui lòng chọn số sao đánh giá' }]}
                    >
                        <Rate />
                    </Form.Item>
                    <Form.Item
                        name="comment"
                        label="Nhận xét"
                        rules={[{ required: 'Vui lòng nhập nhận xét' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MyOrderDetail;