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
import Favorites from "./Favorites/Favorites"; // ✅ Thêm component Favorites

const Home = () => {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await apiClient.get("/api/products");
      return response.data;
    },
  });

  // ✅ State quản lý danh sách yêu thích
  const [favorites, setFavorites] = useState([]);

  // ✅ Load favorites từ LocalStorage khi load trang
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // ✅ Hàm xử lý thêm/xóa sản phẩm yêu thích
  const handleToggleFavorite = (product) => {
    const exists = favorites.find((item) => item.ProductID === product.ProductID);
    const updatedFavorites = exists
      ? favorites.filter((item) => item.ProductID !== product.ProductID)
      : [...favorites, product];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // ✅ Hiệu ứng AOS và OwlCarousel
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

  return (
    <>
      <ClientHeader />

      {/* ✅ Các component mới */}
      <Banner />
      <CouponList />
      <CategoryList />

      {/* ✅ Hiển thị danh sách sản phẩm yêu thích */}
      {favorites.length > 0 && <Favorites favorites={favorites} />}

      <SectionContent />
      <ProductLatest />
      <BestSelling />
      <News />
      <SectionContent2 />

      {/* ✅ Hero giữ nguyên */}
      <div
        className="site-blocks-cover overlay"
        style={{ backgroundImage: "url(/images/hero_bg_1.jpg)" }}
        data-aos="fade"
        data-stellar-background-ratio="0.5"
      >
        <div className="container">
          <div className="row align-items-center text-center justify-content-center">
            <div className="col-md-8">
              <span className="sub-text">Công ty Thiết kế Nội thất</span>
              <h1>Trải nghiệm Thiết kế Nội thất</h1>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Sản phẩm nổi bật */}
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
              productsData?.data?.slice(0, 8).map((product) => (
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
    </>
  );
};

export default Home;
