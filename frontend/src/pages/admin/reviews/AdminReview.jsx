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
    Image,
    Descriptions,
    Divider,
    Empty,
    Card
} from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getReviews, updateReview, deleteReview } from "../../../api/axiosClient";

const formatDateTime = (isoDate) => {
    if (!isoDate) {
        // Nếu không có ngày, trả về ngày hiện tại
        const now = new Date();
        return now.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    try {
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) {
            // Nếu ngày không hợp lệ, trả về ngày hiện tại
            const now = new Date();
            return now.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        // Nếu có lỗi khi parse, trả về ngày hiện tại
        const now = new Date();
        return now.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

const AdminReview = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [form] = Form.useForm();

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await getReviews();
            if (response.data.success) {
                const reviewsData = response.data.data.map((r) => ({
                    ...r,
                    key: r.id,
                    id: r.id,
                    user_info: {
                        name: r.user?.name || 'Khách hàng',
                        email: r.user?.email || 'Chưa có email',
                        phone: r.user?.phone || 'Chưa có số điện thoại',
                        address: r.user?.address || 'Chưa có địa chỉ'
                    },
                    order_id: r.order_id || 'OD' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
                    product_info: {
                        name: r.product?.Name || r.product_name || 'Sản phẩm không xác định',
                        image: r.product?.Image || r.productVariant?.product?.Image || r.product_image
                    },
                    rating: r.Star_rating || r.rating || 0,
                    comment: r.Comment || r.comment || 'Không có nhận xét',
                    created_at: r.created_at || r.CreatedAt || new Date().toISOString(), // Đảm bảo luôn có ngày
                    updated_at: r.updated_at || r.UpdatedAt || new Date().toISOString()
                }));
                setReviews(reviewsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            } else {
                setError(response.data.message || "Không thể tải danh sách đánh giá");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi kết nối server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleEdit = (review) => {
        setCurrentReview(review);
        form.setFieldsValue({
            rating: review.rating,
            comment: review.comment
        });
        setModalVisible(true);
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            await updateReview(currentReview.id, {
                Star_rating: values.rating,
                Comment: values.comment
            });
            message.success("Cập nhật đánh giá thành công");
            setModalVisible(false);
            fetchReviews();
        } catch (err) {
            message.error(err.response?.data?.message || "Cập nhật thất bại");
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Bạn có chắc muốn xóa đánh giá này?",
            content: "Hành động này không thể hoàn tác",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    await deleteReview(id);
                    message.success("Đã xóa đánh giá");
                    fetchReviews();
                } catch (err) {
                    message.error(err.response?.data?.message || "Xóa thất bại");
                }
            },
        });
    };

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "order_id",
            key: "order_id",
            sorter: (a, b) => a.order_id.localeCompare(b.order_id),
            width: 120,
            align: 'center'
        },
        {
            title: "Thông tin người đánh giá",
            key: "user_info",
            render: (_, record) => (
                <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                    <div>
                        <div><strong>👤 {record.user_info.name}</strong></div>
                        <div>✉️ {record.user_info.email}</div>
                        <div>📞 {record.user_info.phone}</div>
                        <div>🏠 {record.user_info.address}</div>
                    </div>
                </Card>
            ),
            width: 250
        },
        {
            title: "Sản phẩm",
            key: "product",
            render: (_, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Image
                        width={60}
                        height={60}
                        style={{
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #f0f0f0'
                        }}
                        src={record.product_info.image
                            ? `http://localhost:8000/storage/${record.product_info.image}`
                            : 'https://via.placeholder.com/60'}
                        alt={record.product_info.name}
                        fallback="https://via.placeholder.com/60"
                        preview={false}
                    />
                    <span style={{ fontWeight: 500 }}>{record.product_info.name}</span>
                </div>
            ),
            width: 250
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            render: (rating) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
                    {text}
                </div>
            )
        },
        {
            title: "Ngày đánh giá",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) => (
                <Tag color="blue">
                    {formatDateTime(date)}
                </Tag>
            ),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            width: 180
        },
        {
            title: "Thao tác",
            key: "action",
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                        size="small"
                        onClick={() => handleEdit(record)}
                        style={{ backgroundColor: '#1890ff', color: '#fff' }}
                    >
                        Sửa
                    </Button>
                    <Button
                        size="small"
                        danger
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </div>
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
                <Spin size="large" />
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

            {reviews.length === 0 ? (
                <Empty
                    description={
                        <span style={{ color: '#666', fontSize: '16px' }}>
                            Chưa có đánh giá nào
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
                    dataSource={reviews}
                    columns={columns}
                    rowKey="id"
                    bordered
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} đánh giá`
                    }}
                    scroll={{ x: 1500 }}
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
                visible={modalVisible}
                onOk={handleUpdate}
                onCancel={() => setModalVisible(false)}
                okText="Cập nhật"
                cancelText="Hủy"
                width={700}
                bodyStyle={{ padding: '24px' }}
            >
                {currentReview && (
                    <>
                        <Descriptions
                            bordered
                            column={1}
                            size="small"
                            labelStyle={{
                                fontWeight: '500',
                                width: '120px'
                            }}
                        >
                            <Descriptions.Item label="Người đánh giá">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#1890ff',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {currentReview.user_info.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div><strong>{currentReview.user_info.name}</strong></div>
                                        <div style={{ color: '#666', fontSize: '13px' }}>{currentReview.user_info.email}</div>
                                    </div>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Sản phẩm">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Image
                                        width={60}
                                        height={60}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            border: '1px solid #f0f0f0'
                                        }}
                                        src={currentReview.product_info.image
                                            ? `http://localhost:8000/storage/${currentReview.product_info.image}`
                                            : 'https://via.placeholder.com/60'}
                                        alt={currentReview.product_info.name}
                                    />
                                    <span style={{ fontWeight: 500 }}>{currentReview.product_info.name}</span>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đánh giá">
                                {formatDateTime(currentReview.created_at)}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left" style={{ margin: '24px 0 16px' }}>Nội dung đánh giá</Divider>

                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="rating"
                                label="Đánh giá (sao)"
                                rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
                            >
                                <Rate style={{ fontSize: 24 }} />
                            </Form.Item>
                            <Form.Item
                                name="comment"
                                label="Nhận xét"
                                rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
                            >
                                <Input.TextArea
                                    rows={5}
                                    style={{ width: '100%' }}
                                    placeholder="Nhập nội dung nhận xét..."
                                />
                            </Form.Item>
                        </Form>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default AdminReview;
