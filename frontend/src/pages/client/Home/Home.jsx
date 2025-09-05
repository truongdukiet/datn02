import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import ProductItem from "../../../components/ProductItem/ProductItem";
import apiClient from "../../../api/api";

// Import các section từ thư mục
import Banner from "./Banner/Banner";
import CouponList from "./CouponList/CouponList";
import CategoryList from "./CategoryList/CategoryList";
import SectionContent from "./SectionContent/SectionContent";
import ProductLatest from "./ProductLatest/ProductLatest";
import BestSelling from "./BestSelling/BestSelling";
import News from "./News/News";
import SectionContent2 from "./SectionContent2/SectionContent2";
import Favorites from "./Favorites/Favorites";

const Home = () => {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await apiClient.get("/api/products");
      return response.data;
    },
  });

  // State quản lý danh sách yêu thích
  const [favorites, setFavorites] = useState([]);

  // Load favorites từ LocalStorage khi load trang
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Hàm xử lý thêm/xóa sản phẩm yêu thích
  const handleToggleFavorite = (product) => {
    const exists = favorites.find((item) => item.ProductID === product.ProductID);
    const updatedFavorites = exists
      ? favorites.filter((item) => item.ProductID !== product.ProductID)
      : [...favorites, product];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Hiệu ứng AOS và OwlCarousel
  useEffect(() => {
    if (window.AOS) window.AOS.init();
    if (window.jQuery && window.jQuery.fn.owlCarousel) {
      window.jQuery(".nonloop-block-13").owlCarousel({
        center: false,
        items: 1,
        loop: false,
        stagePadding: 0,
        margin: 20,
        nav: true,
        navText: [
          '<span class="icon-arrow_back">',
          '<span class="icon-arrow_forward">',
        ],
        responsive: {
          600: { margin: 20, items: 2 },
          1000: { margin: 20, items: 3 },
        },
      });
    }
  }, []);

  // Lọc sản phẩm chỉ hiển thị những sản phẩm có status = 1 và có ít nhất 1 biến thể
  const activeProducts = productsData?.data?.filter(
    product => product.Status === 1 && Array.isArray(product.variants) && product.variants.length > 0
  ) || [];

  return (
    <>
      <ClientHeader />

      {/* ========================================================= */}
      {/* ✅ PHẦN NỘI THẤT ĐÃ ĐƯỢC CHUYỂN LÊN ĐÂY */}
      {/* ========================================================= */}
      <div
        className="site-blocks-cover overlay"
        style={{ backgroundImage: "url(/images/hero_bg_1.jpg)" }}
        data-aos="fade"
        data-stellar-background-ratio="0.5"
      >
        <div className="container">
          <div className="row align-items-center text-center justify-content-center">
            <div className="col-md-8">
              <span className="sub-text"> Next Gen furniture business</span>
              <h1>Next Gen</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Các component còn lại được giữ nguyên thứ tự như bạn đã chỉnh sửa trước đó */}
      <Banner />
      <CouponList />
      <CategoryList />

      {favorites.length > 0 && <Favorites favorites={favorites} />}

      {/* Sản phẩm nổi bật */}
      <div className="site-section tw-mb-32">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <span className="sub-title">Sản phẩm độc quyền</span>
              <h2 className="font-weight-bold text-black mb-5">
                Sản phẩm nổi bật
              </h2>
            </div>
          </div>
          <div className="row">
            {isLoading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
              </div>
            ) : (
              activeProducts.slice(0, 8).map((product) => (
                <div key={product.ProductID} className="col-lg-3 col-md-6 mb-4">
                  <ProductItem
                    product={product}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.some((item) => item.ProductID === product.ProductID)}
                  />
                </div>
              ))
            )}
          </div>
          <div className="row mt-5 text-center">
            <div className="col-12">
              <Link to="/products" className="btn btn-primary btn-lg rounded-0">
                Xem tất cả sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </div>

      <SectionContent />
      <ProductLatest />
      <BestSelling />
      <News />
      {/* Testimonials Section */}
<div className="container site-section block-13 testimonial-wrap">
  <div className="row">
    <div className="col-12 text-center">
      <span className="sub-title">Khách Hàng Hài Lòng</span>
      <h2 className="font-weight-bold text-black mb-5">Đánh Giá Nội Thất</h2>
    </div>
  </div>
  <div className="nonloop-block-13 owl-carousel">
    <div className="testimony">
      <img src="/images/person_1.jpg" alt="Khách hàng" className="img-fluid" />
      <h3>Ngọc Anh</h3>
      <span className="sub-title">Chủ căn hộ cao cấp</span>
      <p>
        &ldquo;
        <em>
          Bộ sofa hiện đại cực kỳ êm ái và sang trọng, màu sắc hài hòa với phòng khách. Rất đáng tiền!
        </em>
        &rdquo;
      </p>
    </div>
    <div className="testimony">
      <img src="/images/person_2.jpg" alt="Khách hàng" className="img-fluid" />
      <h3>Lan Hương</h3>
      <span className="sub-title">Chủ biệt thự</span>
      <p>
        &ldquo;
        <em>
          Tủ quần áo thiết kế tinh tế, chất liệu gỗ chắc chắn và hoàn thiện tỉ mỉ. Hoàn toàn hài lòng!
        </em>
        &rdquo;
      </p>
    </div>
    <div className="testimony">
      <img src="/images/person_3.jpg" alt="Khách hàng" className="img-fluid" />
      <h3>Minh Quân</h3>
      <span className="sub-title">Nhà phố hiện đại</span>
      <p>
        &ldquo;
        <em>
          Bàn ăn đẹp, sang trọng, kích thước vừa vặn. Phù hợp với phong cách tối giản của gia đình tôi.
        </em>
        &rdquo;
      </p>
    </div>
    <div className="testimony">
      <img src="/images/person_4.jpg" alt="Khách hàng" className="img-fluid" />
      <h3>Hữu Thắng</h3>
      <span className="sub-title">Căn hộ chung cư</span>
      <p>
        &ldquo;
        <em>
          Kệ tivi và tủ trang trí rất chắc chắn, kiểu dáng hiện đại, lắp đặt nhanh chóng và chuyên nghiệp.
        </em>
        &rdquo;
      </p>
    </div>
  </div>
</div>

      <SectionContent2 />
    </>
  );
};

export default Home;