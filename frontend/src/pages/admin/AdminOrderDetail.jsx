import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetail, updateOrderDetail } from "../../api/axiosClient";
import { Steps } from 'antd';
import {
    Descriptions,
    Button,
    Spin,
    Tag,
    Divider,
    Image,
    Modal,
    Form,
    Select,
    message
} from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
const { Step } = Steps;

const { Option } = Select;

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

// Thời gian tự động cập nhật dữ liệu (10 giây)
const POLLING_INTERVAL = 10000;

const AdminOrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [variantAttributes, setVariantAttributes] = useState({});
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [statusForm] = Form.useForm();

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
                        created_at: orderData.order_info?.created_at || new Date().toISOString(),
                    },
                    order_details: (orderData.order_details || []).sort((a, b) =>
                        new Date(b.created_at || b.CreatedAt) - new Date(a.created_at || a.CreatedAt)
                    )
                };

                setOrder(processedOrder);
                setLastUpdated(new Date());

                // Lấy thuộc tính cho các biến thể sản phẩm
                if (processedOrder.order_details.length > 0) {
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
    const getStepStatus = () => {
        const status = order?.order_info?.status || order?.Status;
        switch (status?.toLowerCase()) {
            case 'pending':
                return 0; // Chờ xử lý
            case 'processing':
                return 1; // Đang xử lý
            case 'shipped':
                return 2; // Đang giao hàng
            case 'delivered':
            case 'completed':
                return 3; // Đã giao hàng
            case 'cancelled':
                return 4; // Đã hủy (optional)
            default:
                return -1; // Không xác định
        }
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

    // Mở modal cập nhật trạng thái
    const handleStatusUpdateClick = () => {
        statusForm.setFieldsValue({
            status: order?.order_info?.status || order?.Status
        });
        setStatusModalVisible(true);
    };

    // Xử lý cập nhật trạng thái
    const handleStatusUpdate = async (values) => {
        try {
            const now = new Date().toISOString();
            const updateData = {
                Status: values.status,
                created_at: order?.order_info?.created_at || new Date().toISOString(),
                processing_at: values.status === 'processing' ? now : null,
                shipped_at: values.status === 'shipped' ? now : null,
                completed_at: values.status === 'completed' ? now : null,
                delivered_at: values.status === 'delivered' ? now : null,
                cancelled_at: values.status === 'cancelled' ? now : null
            };

            const response = await updateOrderDetail(orderId, updateData);
            if (response.data.success) {
                message.success('Cập nhật trạng thái thành công');
                setStatusModalVisible(false);
                fetchOrderDetail();
            } else {
                message.error(response.data.message || 'Cập nhật trạng thái thất bại');
            }
        } catch (err) {
            message.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
        }
    };

    // Hàm mô tả trạng thái
    const getStatusDescription = (status) => {
        const descriptions = {
            pending: 'Đơn hàng đã được đặt',
            processing: 'Đơn hàng đang được chuẩn bị',
            shipped: 'Đơn hàng đã được vận chuyển',
            completed: 'Đơn hàng đã được giao thành công',
            cancelled: 'Đơn hàng đã bị hủy'
        };
        return descriptions[status.toLowerCase()] || 'Chưa có thông tin';
    };

    // Hàm render bước trạng thái
    const renderOrderSteps = () => {
        const steps = [
            {
                title: "Chờ xử lý",
                description: getStatusDescription('pending'),
                time: order.order_info?.pending_at || 'Chưa có thông tin'
            },
            {
                title: "Đang xử lý",
                description: getStatusDescription('processing'),
                time: order.order_info?.processing_at || 'Chưa có thông tin'
            },
            {
                title: "Đang giao hàng",
                description: getStatusDescription('shipped'),
                time: order.order_info?.shipping_at || 'Chưa có thông tin'
            },
            {
                title: "Đã hoàn thành",
                description: getStatusDescription('completed'),
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
    const currentStatus = orderInfo.status || orderInfo.Status;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/admin/orders')}
                style={{ marginBottom: '20px' }}
            >
                Quay lại danh sách đơn hàng
            </Button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Chi tiết đơn hàng #{orderInfo.id || orderInfo.OrderID || 'Chưa có thông tin'}</h2>


            </div>

            <div style={{ textAlign: 'right', marginBottom: '10px', color: '#666', fontSize: '0.9em' }}>
                Cập nhật lần cuối: {lastUpdated ? formatOrderDate(lastUpdated) : 'Đang tải...'}
            </div>

            <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="Mã đơn hàng">{orderInfo.id || orderInfo.OrderID || 'Chưa có thông tin'}</Descriptions.Item>
                <Descriptions.Item label="ID người dùng">{orderInfo.user_id || orderInfo.UserID || 'Chưa có thông tin'}</Descriptions.Item>
                <Descriptions.Item label="Ngày đặt hàng">{formatOrderDate(orderInfo.created_at || orderInfo.CreatedAt)}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(currentStatus)} style={{ fontSize: '14px', padding: '5px 10px' }}>
                        {translateStatus(currentStatus)}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Thông tin người nhận">
                    <div>Tên: {orderInfo.receiver_name || 'Chưa có thông tin'}</div>
                    <div>SĐT: {orderInfo.receiver_phone || 'Chưa có thông tin'}</div>
                    <div>Địa chỉ: {orderInfo.shipping_address || 'Chưa có thông tin'}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">{orderInfo.payment_method || 'Chưa có thông tin'}</Descriptions.Item>
                <Descriptions.Item label="Mã giảm giá">{orderInfo.voucher_code || 'Không sử dụng'}</Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                    {orderInfo.total_amount || orderInfo.Total_amount
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderInfo.total_amount || orderInfo.Total_amount)
                        : 'Chưa có thông tin'}
                </Descriptions.Item>
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

            {/* Modal cập nhật trạng thái */}
            <Modal
                title="Cập nhật trạng thái đơn hàng"
                visible={statusModalVisible}
                onCancel={() => setStatusModalVisible(false)}
                footer={null}
            >
                <Form
                    form={statusForm}
                    layout="vertical"
                    onFinish={handleStatusUpdate}
                >
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            {['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'].map(status => (
                                <Option key={status} value={status}>
                                    {translateStatus(status)}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Button onClick={() => setStatusModalVisible(false)} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminOrderDetail;
