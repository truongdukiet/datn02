import { useParams, Link } from "react-router-dom";

const NewsDetail = () => {
  const { id } = useParams();

  // ✅ CSS inline
  const styles = `
    .news-detail {
      font-family: "Roboto", sans-serif;
      line-height: 1.6;
      display: flex;
      justify-content: space-between;
      position: relative;
    }
    .main-content {
      width: 68%;
    }
    .sidebar {
      position: fixed;
      top: 100px;
      right: 50px;
      width: 300px;
      background: #fff;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      z-index: 100;
    }
    .sidebar h4 {
      font-size: 18px;
      margin-bottom: 16px;
      font-weight: 600;
      border-bottom: 2px solid #eee;
      padding-bottom: 8px;
    }
    .sidebar-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }
    .sidebar-item img {
      width: 70px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 10px;
    }
    .sidebar-item a {
      font-size: 14px;
      color: #333;
      text-decoration: none;
    }
    .sidebar-item a:hover {
      color: #ff5722;
    }
    .breadcrumb {
      font-size: 14px;
      background-color: #f8f9fa !important;
    }
    .breadcrumb a {
      text-decoration: none;
      color: #007bff;
    }
    .breadcrumb-item.active {
      color: #ff5722;
      font-weight: 500;
    }
    .news-detail h1 {
      font-size: 28px;
      color: #333;
    }
    .text-muted {
      font-size: 14px;
      color: #666 !important;
    }
    .social-share span {
      font-weight: 500;
      margin-right: 8px;
      font-size: 14px;
    }
    .news-content p {
      font-size: 16px;
      color: #444;
      margin-bottom: 16px;
    }
    .related-news .section-title {
      font-size: 20px;
      font-weight: 600;
      border-left: 4px solid #ff5722;
      padding-left: 8px;
      margin-bottom: 20px;
    }
    .post-entry img {
      transition: transform 0.3s ease;
    }
    .post-entry img:hover {
      transform: scale(1.05);
    }
    .post-entry h3 a {
      font-size: 16px;
      color: #333;
      text-decoration: none;
    }
    .post-entry h3 a:hover {
      color: #ff5722;
    }
  `;

  // ✅ Dữ liệu giả lập
  const newsData = [
    {
      id: 1,
      title: "Xu hướng thiết kế nội thất 2024: Minimalism và Sustainability",
      image: "/images/img_1.jpg",
      date: "23 Tháng 6, 2024",
      content: `
        <p>Minimalism (tối giản) và Sustainability (bền vững) đang là hai xu hướng
        được ưa chuộng nhất trong thiết kế nội thất hiện đại. Việc sử dụng vật liệu
        thân thiện môi trường và thiết kế tối giản không chỉ mang lại sự tinh tế
        mà còn bảo vệ môi trường sống của chúng ta.</p>
        <p>Hãy lựa chọn những món đồ nội thất có thiết kế đơn giản, màu sắc trung tính
        và ưu tiên sử dụng các vật liệu tái chế hoặc có nguồn gốc tự nhiên như gỗ,
        tre, nứa để tạo nên không gian sống hài hòa và bền vững.</p>
      `,
    },
    {
      id: 2,
      title: "Cách tối ưu hóa không gian nhỏ với thiết kế thông minh",
      image: "/images/img_2.jpg",
      date: "20 Tháng 6, 2024",
      content: `
        <p>Thiết kế thông minh giúp bạn tận dụng tối đa diện tích trong các căn hộ
        nhỏ. Hãy thử các giải pháp như nội thất đa năng, gam màu sáng và ánh sáng
        tự nhiên để không gian trở nên rộng rãi hơn.</p>
        <p> Sử dụng gương để tạo cảm giác không gian mở rộng, và lựa chọn các món đồ nội
        thất có kích thước phù hợp để tránh làm chật chội căn phòng của bạn.</p>
      `,
    },
    {
      id: 3,
      title: "Màu sắc và ánh sáng: Bí quyết tạo không gian sống ấm cúng",
      image: "/images/img_3.jpg",
      date: "18 Tháng 6, 2024",
      content: `
        <p>Màu sắc và ánh sáng đóng vai trò quan trọng trong việc tạo nên cảm giác
        ấm áp cho căn nhà của bạn. Kết hợp ánh sáng vàng và các tông màu trung tính
        để tạo ra một không gian thân thiện và thoải mái.</p>
        <p>Hãy sử dụng đèn bàn, đèn sàn và nến để tạo điểm nhấn ánh sáng mềm mại,
        đồng thời lựa chọn các màu sắc như be, nâu nhạt, và xanh pastel để mang lại
        cảm giác dễ chịu và thư giãn.</p>
      `,
    },
  ];

  const news = newsData.find((item) => item.id === parseInt(id));

  if (!news) {
    return (
      <div className="container text-center mt-5">
        <h2>Bài viết không tồn tại</h2>
        <Link to="/news" className="btn btn-primary mt-3">
          Quay lại Tin tức
        </Link>
      </div>
    );
  }

  const relatedNews = newsData.filter((item) => item.id !== parseInt(id)).slice(0, 3);

  return (
    <>
      <style>{styles}</style>

      <div className="container mt-5 mb-5 news-detail">
        {/* Nội dung chính */}
        <div className="main-content">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb bg-light p-2 rounded">
              <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/news">Tin tức</Link>
              </li>
              <li className="breadcrumb-item active text-primary" aria-current="page">
                {news.title}
              </li>
            </ol>
          </nav>

          <h1 className="mb-3 fw-bold">{news.title}</h1>
          <p className="text-muted mb-4">📅 {news.date}</p>

          {/* Chia sẻ */}
          <div className="social-share mb-4">
            <span>Chia sẻ: </span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary me-2">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info text-white me-2">Twitter</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">LinkedIn</a>
          </div>

          {/* Hình ảnh */}
          <div className="text-center mb-4">
            <img
              src={news.image}
              alt={news.title}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "450px", objectFit: "cover" }}
            />
          </div>

          {/* Nội dung */}
          <div
            className="news-content mb-5"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Bài viết liên quan */}
          <div className="related-news">
            <h4 className="section-title mb-4">BÀI VIẾT LIÊN QUAN</h4>
            <div className="row">
              {relatedNews.map((item) => (
                <div key={item.id} className="col-lg-4 col-md-6 mb-4 post-entry">
                  <Link to={`/news/${item.id}`} className="d-block figure">
                    <img src={item.image} alt={item.title} className="img-fluid rounded" />
                  </Link>
                  <span className="text-muted d-block mb-1">{item.date}</span>
                  <h3>
                    <Link to={`/news/${item.id}`}>{item.title}</Link>
                  </h3>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Link to="/news" className="btn btn-outline-primary">
              ← Quay lại danh sách Tin tức
            </Link>
          </div>
        </div>

        {/* Sidebar cố định */}
        <div className="sidebar">
          <h4>Tin tức nổi bật</h4>
          {newsData.slice(0, 5).map((item) => (
            <div key={item.id} className="sidebar-item">
              <img src={item.image} alt={item.title} />
              <div>
                <Link to={`/news/${item.id}`}>{item.title}</Link>
                <p className="text-muted" style={{ fontSize: "12px" }}>
                  {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewsDetail;
