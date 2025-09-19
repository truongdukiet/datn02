import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Rate,
  Avatar,
  Divider,
  Tag,
  Spin,
  Empty,
  Button,
  Row,
  Col,
  Card,
  Space,
  Typography,
  Pagination,
  Form,
  Input,
  Modal,
  message,
  Select,
  Progress
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  StarOutlined,
  FilterOutlined,
  SortAscendingOutlined
} from '@ant-design/icons';
import { getProductReviews, submitReview } from "../../../api/axiosClient";
import { formatPrice } from "../../../utils/formatPrice";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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

const ProductReviews = ({ product }) => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Thống kê đánh giá
  const stats = {
    total: reviews.length,
    average: reviews.length > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0,
    ratingCounts: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    }
  };

  // Hàm lấy dữ liệu đánh giá
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await getProductReviews(id);
      
      if (response.data.success) {
        // Sử dụng dữ liệu trực tiếp từ API mà không cần transform nhiều
        const reviewsData = response.data.data.map((review) => ({
          ...review,
          key: review.id,
          user_info: {
            name: review.user_info?.name || 'Khách hàng',
            avatar: review.user_info?.avatar || null
          },
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          status: review.status
        }));

        setReviews(reviewsData);
        setFilteredReviews(reviewsData);
      } else {
        setError(response.data.message || "Không thể tải đánh giá");
        message.error(response.data.message || "Không thể tải đánh giá");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Lỗi kết nối server";
      setError(errorMsg);
      message.error(errorMsg);
      console.error("Lỗi khi tải đánh giá:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    let result = [...reviews];

    // Lọc theo số sao
    if (ratingFilter !== 'all') {
      const ratingValue = parseInt(ratingFilter);
      result = result.filter(review => review.rating === ratingValue);
    }

    // Sắp xếp
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    }

    setFilteredReviews(result);
    setCurrentPage(1); // Reset về trang đầu khi filter thay đổi
  }, [ratingFilter, sortBy, reviews]);

  // Hiển thị thanh xếp hạng (rating bar)
  const renderRatingBar = (star, count) => {
    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
    return (
      <div 
        key={star} 
        style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}
        onClick={() => setRatingFilter(star === ratingFilter ? 'all' : star)}
      >
        <Text style={{ width: 60 }}>{star} sao</Text>
        <Progress 
          percent={percentage} 
          showInfo={false} 
          strokeColor={ratingFilter === star ? '#1890ff' : '#ffc107'}
          style={{ margin: '0 10px', flex: 1 }}
        />
        <Text style={{ width: 40, textAlign: 'right' }}>{count}</Text>
      </div>
    );
  };

  // Xử lý gửi đánh giá
  const handleSubmitReview = async (values) => {
    setSubmitting(true);
    try {
      const response = await submitReview({
        product_id: id,
        rating: values.rating,
        comment: values.comment
      });
      
      if (response.data.success) {
        message.success("Đánh giá của bạn đã được gửi và đang chờ duyệt!");
        reviewForm.resetFields();
        setShowReviewForm(false);
        fetchReviews(); // Làm mới danh sách đánh giá
      } else {
        message.error(response.data.message || "Gửi đánh giá thất bại");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Lỗi kết nối server";
      message.error(errorMsg);
      console.error("Lỗi khi gửi đánh giá:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Tính toán reviews hiển thị trên trang hiện tại
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" tip="Đang tải đánh giá..." />
      </div>
    );
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <Divider />
      
      <Title level={2} style={{ marginBottom: '24px' }}>
        Đánh giá sản phẩm
      </Title>

      <Row gutter={24}>
        {/* Sidebar với thống kê và bộ lọc */}
        <Col xs={24} md={8} lg={6}>
          <Card style={{ marginBottom: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Title level={1} style={{ color: '#1890ff', margin: 0 }}>
                {stats.average}
              </Title>
              <Rate disabled defaultValue={parseFloat(stats.average)} style={{ fontSize: 16 }} />
              <div>
                <Text type="secondary">{stats.total} đánh giá</Text>
              </div>
            </div>

            <Divider />

            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ display: 'block', marginBottom: '10px' }}>Phân phối đánh giá</Text>
              {[5, 4, 3, 2, 1].map(star => 
                renderRatingBar(star, stats.ratingCounts[star])
              )}
            </div>

            <Divider />

            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ display: 'block', marginBottom: '10px' }}>Lọc theo đánh giá</Text>
              <Button 
                type={ratingFilter === 'all' ? 'primary' : 'default'} 
                size="small"
                style={{ margin: '4px' }}
                onClick={() => setRatingFilter('all')}
              >
                Tất cả
              </Button>
              {[5, 4, 3, 2, 1].map(star => (
                <Button 
                  key={star}
                  type={ratingFilter === star.toString() ? 'primary' : 'default'} 
                  size="small"
                  style={{ margin: '4px' }}
                  onClick={() => setRatingFilter(ratingFilter === star.toString() ? 'all' : star.toString())}
                >
                  {star} sao
                </Button>
              ))}
            </div>

            <Divider />

            <div>
              <Text strong style={{ display: 'block', marginBottom: '10px' }}>Sắp xếp theo</Text>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: '100%' }}
                suffixIcon={<SortAscendingOutlined />}
              >
                <Option value="newest">Mới nhất</Option>
                <Option value="oldest">Cũ nhất</Option>
                <Option value="highest">Điểm cao nhất</Option>
                <Option value="lowest">Điểm thấp nhất</Option>
              </Select>
            </div>
          </Card>

          <Button 
            type="primary" 
            block
            onClick={() => setShowReviewForm(true)}
            icon={<StarOutlined />}
            size="large"
          >
            Viết đánh giá
          </Button>
        </Col>

        {/* Danh sách đánh giá */}
        <Col xs={24} md={16} lg={18}>
          {filteredReviews.length === 0 ? (
            <Empty
              description={
                <span style={{ color: '#666', fontSize: '16px' }}>
                  {reviews.length === 0
                    ? "Sản phẩm chưa có đánh giá nào"
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
            >
              <Button type="primary" onClick={() => setShowReviewForm(true)}>
                Trở thành người đầu tiên đánh giá
              </Button>
            </Empty>
          ) : (
            <div>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Hiển thị {paginatedReviews.length} của {filteredReviews.length} đánh giá</Text>
              </div>

              {paginatedReviews.map(review => (
                <Card 
                  key={review.id} 
                  style={{ marginBottom: 16, borderRadius: 8 }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <div style={{ display: 'flex', marginBottom: 12 }}>
                    <Avatar 
                      size={40}
                      src={review.user_info.avatar ? `http://localhost:8000/storage/${review.user_info.avatar}` : null}
                      icon={!review.user_info.avatar ? <UserOutlined /> : null}
                      style={{ marginRight: 12 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                        {review.user_info.name}
                      </div>
                      <Rate disabled defaultValue={review.rating} style={{ fontSize: 14 }} />
                    </div>
                    <Tag color="blue" style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
                      <CalendarOutlined style={{ marginRight: 4 }} />
                      {formatDateTime(review.created_at)}
                    </Tag>
                  </div>
                  
                  <Paragraph style={{ margin: 0, lineHeight: 1.6 }}>
                    {review.comment}
                  </Paragraph>
                </Card>
              ))}
              
              {filteredReviews.length > pageSize && (
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredReviews.length}
                    onChange={(page, size) => {
                      setCurrentPage(page);
                      setPageSize(size);
                    }}
                    showSizeChanger
                    pageSizeOptions={['5', '10', '20', '50']}
                  />
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>

      {/* Modal viết đánh giá */}
      <Modal
        title="Viết đánh giá sản phẩm"
        open={showReviewForm}
        onCancel={() => {
          setShowReviewForm(false);
          reviewForm.resetFields();
        }}
        footer={null}
        width={600}
        centered
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <img 
              src={`http://localhost:8000/storage/${product?.Image}`} 
              alt={product?.Name}
              style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: 12, borderRadius: 4 }}
            />
            <div>
              <div style={{ fontWeight: 'bold' }}>{product?.Name}</div>
              <div>{formatPrice(product?.base_price)}</div>
            </div>
          </div>
        </div>

        <Form
          form={reviewForm}
          layout="vertical"
          onFinish={handleSubmitReview}
        >
          <Form.Item
            name="rating"
            label="Đánh giá của bạn"
            rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
          >
            <Rate style={{ fontSize: 24 }} />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Nhận xét chi tiết"
            rules={[
              { required: true, message: 'Vui lòng nhập nhận xét' },
              { min: 10, message: 'Nhận xét phải có ít nhất 10 ký tự' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button 
              onClick={() => {
                setShowReviewForm(false);
                reviewForm.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting}
            >
              Gửi đánh giá
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductReviews;