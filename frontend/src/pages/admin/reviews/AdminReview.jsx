import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    Spin,
    message,
    Tag,
    Modal,
    Form,
    Input,
    Rate,
    Button,
    Descriptions,
    Divider,
    Empty,
    Card,
    Space,
    Row,
    Col,
    Statistic,
    Select
} from "antd";
import {
    ArrowLeftOutlined,
    EyeOutlined,
    EditOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    ShopOutlined,
    StarOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { getReviews, updateReview } from "../../../api/axiosClient";

// Hàm định dạng ngày tháng
const formatDateTime = (dateString) => {
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

const AdminReview = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [form] = Form.useForm();
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchText, setSearchText] = useState('');

    const stats = {
        total: reviews.length,
        approved: reviews.filter(r => r.status === 'approved').length,
        pending: reviews.filter(r => r.status === 'pending').length,
        hidden: reviews.filter(r => r.status === 'hidden').length
    };

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await getReviews();
            console.log('API Reviews Response:', response); // Debug log

            if (response.data.success) {
                const reviewsData = response.data.data.map((review) => {
                    console.log('Raw review data:', review); // Debug log

                    // Xử lý thông tin người dùng - dựa trên cấu trúc từ MyOrderDetail
                    let userInfo = {
                        name: 'Khách hàng',
                        phone: 'Chưa có số điện thoại',
                        email: 'Chưa có email'
                    };

                    // Kiểm tra nhiều cấu trúc user có thể có
                    if (review.user) {
                        userInfo = {
                            name: review.user.Name || review.user.name || review.user.username || 'Khách hàng',
                            phone: review.user.Phone || review.user.phone || review.user.phone_number || 'Chưa có số điện thoại',
                            email: review.user.Email || review.user.email || 'Chưa có email'
                        };
                    } else if (review.user_info) {
                        // Nếu có sẵn user_info từ API
                        userInfo = {
                            name: review.user_info.name || 'Khách hàng',
                            phone: review.user_info.phone || 'Chưa có số điện thoại',
                            email: review.user_info.email || 'Chưa có email'
                        };
                    }

                    // Xử lý thông tin sản phẩm - dựa trên cấu trúc từ MyOrderDetail
                    let productName = 'Sản phẩm không xác định';
                    let productId = null;

                    // Kiểm tra nhiều cấu trúc dữ liệu sản phẩm có thể có
                    if (review.product_variant?.product?.Name) {
                        productName = review.product_variant.product.Name;
                        productId = review.product_variant.product.id || review.product_variant.product.ID;
                    } else if (review.product_variant?.product?.name) {
                        productName = review.product_variant.product.name;
                        productId = review.product_variant.product.id || review.product_variant.product.ID;
                    } else if (review.product?.Name) {
                        productName = review.product.Name;
                        productId = review.product.id || review.product.ID;
                    } else if (review.product?.name) {
                        productName = review.product.name;
                        productId = review.product.id || review.product.ID;
                    } else if (review.product_name) {
                        productName = review.product_name;
                        productId = review.product_id || null;
                    } else if (review.product_info?.name) {
                        productName = review.product_info.name;
                        productId = review.product_info.id || null;
                    }

                    // Xử lý rating và comment
                    const rating = review.Star_rating || review.rating || review.star_rating || 0;
                    const comment = review.Comment || review.comment || 'Không có nhận xét';

                    // Xử lý ngày tháng
                    const createdAt = review.created_at || review.CreatedAt || review.createdAt || new Date().toISOString();
                    const updatedAt = review.updated_at || review.UpdatedAt || review.updatedAt || new Date().toISOString();

                    // Xử lý trạng thái - kiểm tra nhiều trường có thể có
                    let status = 'pending';
                    let isApproved = false;
                    let isHidden = false;

                    // Ưu tiên trường status nếu có
                    if (review.status) {
                        status = review.status;
                        isApproved = status === 'approved';
                        isHidden = status === 'hidden';
                    } else {
                        // Fallback về các trường cũ
                        isApproved = review.is_approved !== undefined ? review.is_approved :
                                    (review.approved !== undefined ? review.approved : false);
                        isHidden = review.is_hidden !== undefined ? review.is_hidden :
                                  (review.hidden !== undefined ? review.hidden : false);

                        if (isHidden) {
                            status = 'hidden';
                        } else if (isApproved) {
                            status = 'approved';
                        } else {
                            status = 'pending';
                        }
                    }

                    return {
                        ...review,
                        key: review.id || review.ID || Math.random().toString(36).substr(2, 9),
                        id: review.id || review.ID,
                        user_info: userInfo,
                        product_info: {
                            id: productId,
                            name: productName
                        },
                        rating: rating,
                        comment: comment,
                        created_at: createdAt,
                        updated_at: updatedAt,
                        is_approved: isApproved,
                        is_hidden: isHidden,
                        status: status
                    };
                });

                const sortedReviews = reviewsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setReviews(sortedReviews);
                setFilteredReviews(sortedReviews);
                console.log('Processed reviews:', sortedReviews); // Debug log
            } else {
                setError(response.data.message || "Không thể tải danh sách đánh giá");
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError(err.response?.data?.message || "Lỗi kết nối server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        let result = reviews;

        if (statusFilter !== 'all') {
            result = result.filter(review => review.status === statusFilter);
        }

        if (searchText) {
            const lowerSearch = searchText.toLowerCase();
            result = result.filter(review =>
                (review.user_info.name && review.user_info.name.toLowerCase().includes(lowerSearch)) ||
                (review.user_info.phone && review.user_info.phone.toLowerCase().includes(lowerSearch)) ||
                (review.user_info.email && review.user_info.email.toLowerCase().includes(lowerSearch)) ||
                (review.product_info.name && review.product_info.name.toLowerCase().includes(lowerSearch)) ||
                (review.comment && review.comment.toLowerCase().includes(lowerSearch))
            );
        }

        setFilteredReviews(result);
    }, [statusFilter, searchText, reviews]);

    const handleViewDetails = (review) => {
        setCurrentReview(review);
        setDetailModalVisible(true);
    };

    const handleEdit = (review) => {
        setCurrentReview(review);
        form.setFieldsValue({
            status: review.status
        });
        setModalVisible(true);
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const newStatus = values.status;

            const updateData = {};
            if (newStatus === 'approved') {
                updateData.is_approved = true;
                updateData.is_hidden = false;
                // Cũng có thể gửi status nếu API hỗ trợ
                updateData.status = 'approved';
            } else if (newStatus === 'hidden') {
                updateData.is_approved = false;
                updateData.is_hidden = true;
                updateData.status = 'hidden';
            } else if (newStatus === 'pending') {
                updateData.is_approved = false;
                updateData.is_hidden = false;
                updateData.status = 'pending';
            }

            console.log('Updating review with data:', updateData); // Debug log

            const response = await updateReview(currentReview.id, updateData);
            console.log('Update response:', response); // Debug log

            if (response.data.success) {
                message.success("Cập nhật trạng thái thành công");
                setModalVisible(false);
                fetchReviews(); // Refresh data
            } else {
                message.error(response.data.message || "Cập nhật thất bại");
            }
        } catch (err) {
            console.error('Update error:', err);
            message.error(err.response?.data?.message || "Cập nhật thất bại");
        }
    };

    const handleStatusChange = async (review, newStatus) => {
        try {
            const updateData = {};
            if (newStatus === 'approved') {
                updateData.is_approved = true;
                updateData.is_hidden = false;
                updateData.status = 'approved';
            } else if (newStatus === 'hidden') {
                updateData.is_approved = false;
                updateData.is_hidden = true;
                updateData.status = 'hidden';
            }

            console.log('Quick update with data:', updateData); // Debug log

            const response = await updateReview(review.id, updateData);
            console.log('Quick update response:', response); // Debug log

            if (response.data.success) {
                message.success("Cập nhật trạng thái thành công");
                fetchReviews(); // Refresh data
            } else {
                message.error(response.data.message || "Cập nhật thất bại");
            }
        } catch (err) {
            console.error('Quick update error:', err);
            message.error(err.response?.data?.message || "Cập nhật thất bại");
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'approved':
                return <Tag color="green">Đã duyệt</Tag>;
            case 'pending':
                return <Tag color="orange">Chờ duyệt</Tag>;
            case 'hidden':
                return <Tag color="red">Đã ẩn</Tag>;
            default:
                return <Tag>Không xác định</Tag>;
        }
    };

    const columns = [
        {
            title: "Người đánh giá",
            key: "user_info",
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        <UserOutlined style={{ marginRight: 5, color: '#1890ff' }} />
                        {record.user_info.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#666' }}>
                        <PhoneOutlined style={{ marginRight: 5 }} />
                        {record.user_info.phone}
                    </div>
                </div>
            ),
            width: 180
        },
        {
            title: "Sản phẩm",
            key: "product",
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                        <ShopOutlined style={{ marginRight: 5, color: '#52c41a' }} />
                        {record.product_info.name}
                    </div>
                    {record.product_info.id && (
                        <div style={{ fontSize: '12px', color: '#888', marginLeft: '20px' }}>
                            ID: {record.product_info.id}
                        </div>
                    )}
                </div>
            ),
            width: 200
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            render: (rating) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Rate
                        disabled
                        defaultValue={rating}
                        style={{ fontSize: 16, marginRight: 8 }}
                    />
                    <span style={{ color: '#faad14', fontWeight: 500 }}>{rating}.0</span>
                </div>
            ),
            sorter: (a, b) => a.rating - b.rating,
            width: 150,
            align: 'center'
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => getStatusTag(status),
            width: 150,
            align: 'center',
            filters: [
                { text: 'Đã duyệt', value: 'approved' },
                { text: 'Chờ duyệt', value: 'pending' },
                { text: 'Đã ẩn', value: 'hidden' }
            ],
            onFilter: (value, record) => record.status === value
        },
        {
            title: "Nhận xét",
            dataIndex: "comment",
            key: "comment",
            render: (text) => (
                <div style={{
                    maxWidth: 300,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {text || 'Không có nhận xét'}
                </div>
            )
        },
        {
            title: "Ngày đánh giá",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) => (
                <Tag color="blue" style={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarOutlined style={{ marginRight: 5 }} />
                    {formatDateTime(date)}
                </Tag>
            ),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            width: 200
        },
        {
            title: "Thao tác",
            key: "action",
            fixed: 'right',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record)}
                    >
                        Xem
                    </Button>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    {record.status !== 'approved' && (
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => handleStatusChange(record, 'approved')}
                        >
                            Duyệt
                        </Button>
                    )}
                    {record.status !== 'hidden' && (
                        <Button
                            size="small"
                            danger
                            onClick={() => handleStatusChange(record, 'hidden')}
                        >
                            Ẩn
                        </Button>
                    )}
                </Space>
            )
        }
    ];

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh'
            }}>
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '50px',
                color: 'red',
                backgroundColor: '#fff2f0',
                borderRadius: '4px',
                margin: '20px'
            }}>
                <h3>Lỗi khi tải dữ liệu</h3>
                <p>{error}</p>
                <Button
                    type="primary"
                    onClick={fetchReviews}
                    style={{ marginTop: '20px' }}
                >
                    Thử lại
                </Button>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '98%',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 0'
                    }}
                >
                    Quay lại
                </Button>
                <h2 style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#333'
                }}>
                    Quản lý đánh giá sản phẩm
                </h2>
                <div style={{ width: '100px' }}></div>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng số đánh giá"
                            value={stats.total}
                            prefix={<StarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đã duyệt"
                            value={stats.approved}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Chờ duyệt"
                            value={stats.pending}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đã ẩn"
                            value={stats.hidden}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col span={8}>
                        <Input
                            placeholder="Tìm kiếm theo tên, sđt, email, sản phẩm hoặc nhận xét..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col span={8}>
                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="all">Tất cả trạng thái</Select.Option>
                            <Select.Option value="approved">Đã duyệt</Select.Option>
                            <Select.Option value="pending">Chờ duyệt</Select.Option>
                            <Select.Option value="hidden">Đã ẩn</Select.Option>
                        </Select>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                        <Button type="primary" onClick={fetchReviews}>
                            Làm mới
                        </Button>
                    </Col>
                </Row>
            </Card>

            {filteredReviews.length === 0 ? (
                <Empty
                    description={
                        <span style={{ color: '#666', fontSize: '16px' }}>
                            {reviews.length === 0
                                ? "Chưa có đánh giá nào"
                                : "Không tìm thấy đánh giá phù hợp"}
                        </span>
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{
                        margin: '50px 0',
                        padding: '40px',
                        backgroundColor: '#fafafa',
                        borderRadius: '4px'
                    }}
                />
            ) : (
                <Table
                    dataSource={filteredReviews}
                    columns={columns}
                    rowKey="id"
                    bordered
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} đánh giá`,
                        showQuickJumper: true
                    }}
                    scroll={{ x: 1300 }}
                    locale={{
                        emptyText: 'Không có dữ liệu đánh giá'
                    }}
                    style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                    }}
                />
            )}

            <Modal
                title={`Chi tiết đánh giá #${currentReview?.id || ''}`}
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Button
                        key="edit"
                        type="primary"
                        onClick={() => {
                            setDetailModalVisible(false);
                            handleEdit(currentReview);
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                ]}
                width={700}
            >
                {currentReview && (
                    <Descriptions
                        bordered
                        column={1}
                        size="small"
                        labelStyle={{
                            fontWeight: '500',
                            width: '120px',
                            backgroundColor: '#fafafa'
                        }}
                    >
                        <Descriptions.Item label="Người đánh giá">
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: 5 }}>
                                    <UserOutlined style={{ marginRight: 5 }} />
                                    {currentReview.user_info.name}
                                </div>
                                <div style={{ marginBottom: 3 }}>
                                    <PhoneOutlined style={{ marginRight: 5 }} />
                                    {currentReview.user_info.phone}
                                </div>
                                <div>
                                    <MailOutlined style={{ marginRight: 5 }} />
                                    {currentReview.user_info.email}
                                </div>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Sản phẩm">
                            <div>
                                <div style={{ fontWeight: 500 }}>
                                    <ShopOutlined style={{ marginRight: 5 }} />
                                    {currentReview.product_info.name}
                                </div>
                                {currentReview.product_info.id && (
                                    <div style={{ fontSize: '12px', color: '#888', marginLeft: 20 }}>
                                        ID: {currentReview.product_info.id}
                                    </div>
                                )}
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {getStatusTag(currentReview.status)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày đánh giá">
                            <CalendarOutlined style={{ marginRight: 5 }} />
                            {formatDateTime(currentReview.created_at)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Đánh giá">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Rate disabled defaultValue={currentReview.rating} />
                                <span style={{ marginLeft: 8, color: '#faad14', fontWeight: 500 }}>
                                    {currentReview.rating}.0
                                </span>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Nhận xét">
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '4px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                lineHeight: 1.6
                            }}>
                                {currentReview.comment}
                            </div>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            <Modal
                title={`Chỉnh sửa trạng thái đánh giá #${currentReview?.id || ''}`}
                open={modalVisible}
                onOk={handleUpdate}
                onCancel={() => setModalVisible(false)}
                okText="Cập nhật trạng thái"
                cancelText="Hủy"
                width={500}
            >
                {currentReview && (
                    <>
                        <Descriptions
                            bordered
                            column={1}
                            size="small"
                            labelStyle={{
                                fontWeight: '500',
                                width: '120px',
                                backgroundColor: '#fafafa'
                            }}
                        >
                            <Descriptions.Item label="Đánh giá">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Rate disabled defaultValue={currentReview.rating} />
                                    <span style={{ marginLeft: 8, color: '#faad14', fontWeight: 500 }}>
                                        {currentReview.rating}.0
                                    </span>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Nhận xét">
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '4px',
                                    lineHeight: 1.6
                                }}>
                                    {currentReview.comment}
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                        <Divider />
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="status"
                                label="Trạng thái"
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                            >
                                <Select placeholder="Chọn trạng thái">
                                    <Select.Option value="approved">Đã duyệt</Select.Option>
                                    <Select.Option value="pending">Chờ duyệt</Select.Option>
                                    <Select.Option value="hidden">Đã ẩn</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default AdminReview;
