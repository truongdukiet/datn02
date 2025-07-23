import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/news") // Thay đổi URL API theo địa chỉ của bạn
      .then((res) => res.json())
      .then((data) => setNews(data.data || data));
  }, []);

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
            {news.map((item) => (
              <div className="col-lg-4 col-md-6 mb-5 post-entry" key={item.id}>
                <Link to={`/news/${item.slug}`} className="d-block figure">
                  <img
                    src={item.image || "/images/img_1.jpg"}
                    alt="Image"
                    className="img-fluid"
                  />
                </Link>
                <span className="text-muted d-block mb-1">
                  {item.published_at
                    ? new Date(item.published_at).toLocaleDateString()
                    : ""}
                </span>
                <h3>
                  <Link to={`/news/${item.slug}`}>{item.title}</Link>
                </h3>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {/* Thêm phân trang ở đây nếu cần */}
        </div>
      </div>
    </>
  );
};

export default News;