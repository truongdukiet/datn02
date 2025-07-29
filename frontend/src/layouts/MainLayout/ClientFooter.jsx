import { Link } from "react-router-dom";

const ClientFooter = () => {
  return (
    <footer className="site-footer border-top">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-5 mb-lg-0">
            <div className="row mb-5">
              <div className="col-md-12">
                <h3 className="footer-heading mb-4">Điều hướng</h3>
              </div>
              <div className="col-md-6 col-lg-6">
                <ul className="list-unstyled">
                  <li>
                    <Link to="/">Trang chủ</Link>
                  </li>
                  <li>
                    <Link to="/services">Dịch vụ</Link>
                  </li>
                  <li>
                    <Link to="/news">Tin tức</Link>
                  </li>
                  <li>
                    <a href="#">Đội ngũ</a>
                  </li>
                </ul>
              </div>
              <div className="col-md-6 col-lg-6">
                <ul className="list-unstyled">
                  <li>
                    <Link to="/about">Về chúng tôi</Link>
                  </li>
                  <li>
                    <a href="#">Chính sách bảo mật</a>
                  </li>
                  <li>
                    <Link to="/contact">Liên hệ</Link>
                  </li>
                  <li>
                    <a href="#">Thành viên</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="mb-5">
              <h3 className="footer-heading mb-4">Tin tức gần đây</h3>
              <div className="block-25">
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <a href="#" className="d-flex">
                      <figure className="image mr-4">
                        <img
                          src="/images/hero_bg_1.jpg"
                          alt="Hình ảnh"
                          className="img-fluid"
                        />
                      </figure>
                      <div className="text">
                        <span className="small text-uppercase date">
                          Ngày 16 tháng 9, 2018
                        </span>
                        <h3 className="heading font-weight-light">
                          Lorem ipsum dolor sit amet consectetur elit
                        </h3>
                      </div>
                    </a>
                  </li>
                  <li className="mb-3">
                    <a href="#" className="d-flex">
                      <figure className="image mr-4">
                        <img
                          src="/images/hero_bg_1.jpg"
                          alt="Hình ảnh"
                          className="img-fluid"
                        />
                      </figure>
                      <div className="text">
                        <span className="small text-uppercase date">
                          Ngày 16 tháng 9, 2018
                        </span>
                        <h3 className="heading font-weight-light">
                          Lorem ipsum dolor sit amet consectetur elit
                        </h3>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-5 mb-lg-0">
            <div className="mb-5">
              <h3 className="footer-heading mb-2">Đăng ký nhận bản tin</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit minima
                minus odio.
              </p>
              <form action="#" method="post">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control border-white text-white bg-transparent"
                    placeholder="Nhập Email"
                    aria-label="Nhập Email"
                    aria-describedby="button-addon2"
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary"
                      type="button"
                      id="button-addon2"
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="row">
              <div className="col-md-12">
                <h3 className="footer-heading mb-4">Theo dõi chúng tôi</h3>
                <div>
                  <a href="#" className="pl-0 pr-3">
                    <span className="icon-facebook"></span>
                  </a>
                  <a href="#" className="pl-3 pr-3">
                    <span className="icon-twitter"></span>
                  </a>
                  <a href="#" className="pl-3 pr-3">
                    <span className="icon-instagram"></span>
                  </a>
                  <a href="#" className="pl-3 pr-3">
                    <span className="icon-linkedin"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row pt-5 mt-5 text-center">
          <div className="col-md-12">
            <p>
              Bản quyền &copy; {new Date().getFullYear()} Mọi quyền được bảo lưu |
              Thiết kế Nội thất NextGen
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ClientFooter;
