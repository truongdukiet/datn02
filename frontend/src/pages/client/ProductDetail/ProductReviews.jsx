import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Rate,
  Avatar,
  Divider,
  Tag,
  Spin,
  Empty,
  Row,
  Col,
  Card,
  Typography,
  Pagination,
  Progress,
  Select,
  Button,
  message,
  Alert,
  Badge
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  SortAscendingOutlined,
  StarFilled,
  ShoppingOutlined,
  TagOutlined
} from '@ant-design/icons';
import { getProductReviews } from "../../../api/axiosClient";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const formatDateTime = (dateString) => {
  if (!dateString) return 'Chưa có thông tin';
  
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

// Component hiển thị thông tin biến thể sản phẩm
const ProductVariantInfo = ({ variantInfo }) => {
  if (!variantInfo) return null;

  return (
    <div style={{ marginBottom: 12, padding: 8, backgroundColor: '#f9f9f9', borderRadius: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
        <ShoppingOutlined style={{ color: '#1890ff', marginRight: 6 }} />
        <Text strong>Đã mua:</Text>
      </div>
      
      {/* Hiển thị các attribute */}
      {variantInfo.attribute && variantInfo.attribute.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {variantInfo.attribute.map((attr, index) => (
            <Badge 
              key={attr.VariantAttributeID || index}
              count={attr.value}
              style={{ 
                backgroundColor: '#1890ff',
                color: 'white',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: '12px'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Hiển thị SKU nếu có */}
      {variantInfo.sku && (
        <div style={{ marginTop: 4 }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            SKU: {variantInfo.sku}
          </Text>
        </div>
      )}
    </div>
  );
};

// Component hiển thị một review item
const ReviewItem = ({ review }) => {
  return (
    <Card 
      style={{ marginBottom: 16, borderRadius: 8 }}
      bodyStyle={{ padding: '16px' }}
    >
      {/* Header với thông tin user và rating */}
      <div style={{ display: 'flex', marginBottom: 12 }}>
        <Avatar 
          size={40}
          src={review.user_info.avatar}
          icon={!review.user_info.avatar ? <UserOutlined /> : null}
          style={{ marginRight: 12 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {review.user_info.name}
          </div>
          <Rate disabled value={review.rating} style={{ fontSize: 14 }} />
        </div>
        <Tag color="blue" style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {formatDateTime(review.created_at)}
        </Tag>
      </div>
      
      {/* Thông tin biến thể sản phẩm */}
      <ProductVariantInfo variantInfo={review.product_variant_info} />
      
      {/* Nội dung đánh giá */}
      <Paragraph style={{ 
        margin: 0, 
        lineHeight: 1.6,
        padding: '8px 0',
        borderTop: '1px solid #f0f0f0'
      }}>
        {review.comment}
      </Paragraph>
      
      {/* Trạng thái review */}
      <div style={{ marginTop: 8, textAlign: 'right' }}>
        <Tag 
          color={
            review.status === 'approved' ? 'green' : 
            review.status === 'pending' ? 'orange' : 'red'
          }
          style={{ fontSize: '12px' }}
        >
          {review.status === 'approved' ? 'Đã duyệt' : 
           review.status === 'pending' ? 'Chờ duyệt' : 'Đã ẩn'}
        </Tag>
      </div>
    </Card>
  );
};

const ProductReviews = () => {
  const { id } = useParams();
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    statistics: {
      total_reviews: 0,
      average_rating: 0,
      rating_counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      rating_percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      status_counts: { approved: 0, pending: 0, hidden: 0 }
    },
    product_info: {
      id: null,
      name: '',
      total_reviews: 0,
      approved_reviews: 0,
      average_rating: 0
    }
  });
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Hàm lấy dữ liệu đánh giá
  const fetchReviews = async () => {
    if (!id) {
      setError("Không tìm thấy ID sản phẩm");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await getProductReviews(id);
      
      if (response.data && response.data.success) {
        const apiData = response.data.data;
        console.log("API Data received:", apiData);
        
        setReviewsData(apiData);
        setFilteredReviews(apiData.reviews || []);
      } else {
        const errorMsg = response.data?.message || "Không thể tải đánh giá";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Lỗi khi tải đánh giá:", err);
      const errorMsg = err.response?.data?.message || 
                      err.message || 
                      "Lỗi kết nối server";
      setError(errorMsg);
      message.error("Lỗi khi tải đánh giá: " + errorMsg);
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
    let result = [...reviewsData.reviews];

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
    setCurrentPage(1);
  }, [ratingFilter, sortBy, reviewsData.reviews]);

  // Hiển thị thanh xếp hạng (rating bar)
  const renderRatingBar = (star, count, percentage) => {
    return (
      <div 
        key={star} 
        style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}
        onClick={() => setRatingFilter(star === ratingFilter ? 'all' : star)}
      >
        <Text style={{ width: 80 }}>
          {star} <StarFilled style={{ color: '#ffc107', fontSize: 12 }} />
        </Text>
        <Progress 
          percent={percentage} 
          showInfo={false} 
          strokeColor={ratingFilter === star ? '#1890ff' : '#f0f0f0'}
          trailColor="#f0f0f0"
          style={{ margin: '0 10px', flex: 1 }}
        />
        <Text style={{ width: 40, textAlign: 'right' }}>{count}</Text>
      </div>
    );
  };

  // Tính toán reviews hiển thị trên trang hiện tại
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const { statistics, product_info } = reviewsData;

  // Thống kê các biến thể được đánh giá
  const variantStats = {};
  reviewsData.reviews.forEach(review => {
    if (review.product_variant_info) {
      const variantId = review.product_variant_info.id;
      if (!variantStats[variantId]) {
        variantStats[variantId] = {
          count: 0,
          info: review.product_variant_info
        };
      }
      variantStats[variantId].count++;
    }
  });

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
        Đánh giá sản phẩm: {product_info.name}
      </Title>

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
          action={
            <Button size="small" onClick={fetchReviews}>
              Thử lại
            </Button>
          }
        />
      )}



      <Row gutter={24}>
        {/* Sidebar với thống kê */}
        <Col xs={24} md={8} lg={6}>
          <Card style={{ marginBottom: '24px' }} title="Thống kê đánh giá">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Title level={1} style={{ color: '#1890ff', margin: 0 }}>
                {statistics.average_rating}
              </Title>
              <Rate 
                disabled 
                value={statistics.average_rating} 
                style={{ fontSize: 16 }} 
              />
              <div>
                <Text type="secondary">
                  {statistics.total_reviews} đánh giá
                </Text>
              </div>
            </div>

            <Divider />

            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                Phân phối đánh giá
              </Text>
              {[5, 4, 3, 2, 1].map(star => 
                renderRatingBar(
                  star, 
                  statistics.rating_counts[star],
                  statistics.rating_percentages[star]
                )
              )}
            </div>

            {/* Thống kê biến thể */}
            {Object.keys(variantStats).length > 0 && (
              <>
                <Divider />
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                    <TagOutlined /> Biến thể được đánh giá
                  </Text>
                  {Object.values(variantStats).map((variant, index) => (
                    <div key={index} style={{ marginBottom: 8, fontSize: '12px' }}>
                      <Text>
                        {variant.info.attribute?.map(attr => attr.value).join(', ')}: 
                        <strong> {variant.count} đánh giá</strong>
                      </Text>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Button 
              type={ratingFilter === 'all' ? 'primary' : 'default'}
              style={{ width: '100%', marginTop: '10px' }}
              onClick={() => setRatingFilter('all')}
            >
              {ratingFilter === 'all' ? 'Đang hiển thị tất cả' : 'Hiển thị tất cả đánh giá'}
            </Button>
          </Card>
        </Col>

        {/* Danh sách đánh giá */}
        <Col xs={24} md={16} lg={18}>
          {/* Bộ lọc và sắp xếp */}
          <Card style={{ marginBottom: '16px' }}>
            <Row gutter={16} align="middle">
              <Col>
                <Text strong>Sắp xếp:</Text>
              </Col>
              <Col>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 150 }}
                  suffixIcon={<SortAscendingOutlined />}
                >
                  <Option value="newest">Mới nhất</Option>
                  <Option value="oldest">Cũ nhất</Option>
                  <Option value="highest">Điểm cao nhất</Option>
                  <Option value="lowest">Điểm thấp nhất</Option>
                </Select>
              </Col>
              <Col flex="auto">
                <Text>
                  Đang có {filteredReviews.length} đánh giá
                </Text>
              </Col>
            </Row>
          </Card>

          {filteredReviews.length === 0 ? (
            <Empty
              description={
                <span style={{ color: '#666', fontSize: '16px' }}>
                  {statistics.total_reviews === 0
                    ? "Sản phẩm chưa có đánh giá nào"
                    : ratingFilter !== 'all'
                    }
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
            <div>
              {paginatedReviews.map(review => (
                <ReviewItem key={review.id} review={review} />
              ))}
              
              {/* Phân trang */}
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
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} của ${total} đánh giá`
                    }
                  />
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductReviews;