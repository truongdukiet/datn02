import { Link } from "react-router-dom";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";

const News = () => {
  // ✅ Dữ liệu demo để mapping (sau này có thể thay bằng API)
  const newsList = [
    {
      id: 1,
      title: "Xu hướng thiết kế nội thất 2024: Minimalism và Sustainability",
      image: "/images/img_1.jpg",
      date: "23 Tháng 6, 2024",
    },
    {
      id: 2,
      title: "Cách tối ưu hóa không gian nhỏ với thiết kế thông minh",
      image: "/images/img_2.jpg",
      date: "20 Tháng 6, 2024",
    },
    {
      id: 3,
      title: "Màu sắc và ánh sáng: Bí quyết tạo không gian sống ấm cúng",
      image: "/images/img_3.jpg",
      date: "18 Tháng 6, 2024",
    },
    {
      id: 4,
      title: "Thiết kế văn phòng hiện đại: Productivity meets Aesthetics",
      image: "/images/img_4.jpg",
      date: "15 Tháng 6, 2024",
    },
    {
      id: 5,
      title: "Smart Home Integration: Công nghệ trong thiết kế nội thất",
      image: "/images/img_5.jpg",
      date: "12 Tháng 6, 2024",
    },
    {
      id: 6,
      title: "Kinh nghiệm lựa chọn nội thất cho căn hộ chung cư",
      image: "/images/img_1.jpg",
      date: "10 Tháng 6, 2024",
    },
  ];

  return (
    <>
      <ClientHeader />

      {/* Hero Section */}
      <div
        className="site-blocks-cover overlay inner-page"
        style={{ backgroundImage: "url(/images/hero_bg_1.jpg)" }}
        data-aos="fade"
        data-stellar-background-ratio="0.5"
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-10">
              <span className="sub-text">Cập nhật</span>
              <h1>Tin Tức &amp; Blogs</h1>
            </div>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="site-section">
        <div className="container">
          <div className="row mb-5">
            {newsList.map((news) => (
              <div key={news.id} className="col-lg-4 col-md-6 mb-5 post-entry">
                <Link to={`/news/${news.id}`} className="d-block figure">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="img-fluid"
                  />
                </Link>
                <span className="text-muted d-block mb-1">{news.date}</span>
                <h3>
                  <Link to={`/news/${news.id}`}>{news.title}</Link>
                </h3>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="row">
            <div className="col-md-12 text-center">
              <div className="site-block-27">
                <ul>
                  <li>
                    <a href="#">&lt;</a>
                  </li>
                  <li className="active">
                    <span>1</span>
                  </li>
                  <li>
                    <a href="#">2</a>
                  </li>
                  <li>
                    <a href="#">3</a>
                  </li>
                  <li>
                    <a href="#">4</a>
                  </li>
                  <li>
                    <a href="#">5</a>
                  </li>
                  <li>
                    <a href="#">&gt;</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default News;
