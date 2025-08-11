import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Dropdown, Menu, message } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const ClientHeader = ({ lightMode = true }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi khi phân tích dữ liệu người dùng:", error);
      }
    }

    if (location.pathname === "/products") {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get("q");
      if (query) {
        setSearchQuery(query);
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    message.success("Đăng xuất thành công");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Thông tin tài khoản</Link>
      </Menu.Item>
      <Menu.Item key="myorder" icon={<UserOutlined />}>
        <Link to="/myorder">Thông tin đơn hàng</Link>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className="site-mobile-menu">
        <div className="site-mobile-menu-header">
          <div className="site-mobile-menu-close mt-3">
            <span className="icon-close2 js-menu-toggle"></span>
          </div>
        </div>
        <div className="site-mobile-menu-body"></div>
      </div>

      <div className="site-navbar-wrap">
        <div className="site-navbar">
          <div className="container tw-py-6 tw-flex tw-items-center tw-justify-between">
            <Link
              to="/"
              className={classNames("tw-text-4xl tw-font-normal", {
                "!tw-text-white": lightMode,
                "!tw-text-[#212121]": !lightMode,
              })}
            >
             Next Gen
            </Link>

            <form
              onSubmit={handleSearch}
              className="tw-w-[300px] tw-h-12 tw-border tw-border-solid tw-border-[#BDBDBD] tw-flex"
            >
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={classNames(
                  "tw-bg-transparent tw-border-none tw-outline-none tw-flex-1 tw-px-2 [&::placeholder]:tw-text-gray-[#BDBDBD]",
                  {
                    "tw-text-white": lightMode,
                    "tw-text-[#212121]": !lightMode,
                  }
                )}
              />

              <button
                type="submit"
                className={classNames(
                  "tw-self-center tw-mx-4 tw-bg-transparent tw-border-none tw-cursor-pointer",
                  {
                    "!tw-text-white": lightMode,
                    "!tw-text-[#212121]": !lightMode,
                  }
                )}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>

            <ul
              className={classNames(
                "tw-flex tw-items-center tw-gap-6 tw-list-none tw-m-0",
                {
                  "tw-text-white": lightMode,
                  "tw-text-[#212121]": !lightMode,
                }
              )}
            >
              <li>
                <NavLink className="!tw-text-[inherit]" to="/products">
                  Sản phẩm
                </NavLink>
              </li>
              <li>
                <NavLink className="!tw-text-[inherit]" to="/about">
                  Về chúng tôi
                </NavLink>
              </li>

              <li>
                <NavLink className="!tw-text-[inherit]" to="/news">
                  Tin tức
                </NavLink>
              </li>
              <li>
                <NavLink className="!tw-text-[inherit]" to="/contact">
                  Liên hệ
                </NavLink>
              </li>
            </ul>

            <div className="tw-flex tw-items-center tw-gap-6">
              {user ? (
                <>
                  <div
                    className={classNames("tw-text-xl", {
                      "!tw-text-white": lightMode,
                      "!tw-text-[#212121]": !lightMode,
                    })}
                  >
                    <Link to="/favorites">
                      <HeartOutlined className="tw-text-xl" />
                    </Link>
                  </div>

                  <Dropdown overlay={userMenu} placement="bottomRight" arrow>
                    <div
                      className={classNames(
                        "tw-flex tw-items-center tw-gap-2 tw-cursor-pointer",
                        {
                          "!tw-text-white": lightMode,
                          "!tw-text-[#212121]": !lightMode,
                        }
                      )}
                    >
                      <span className="tw-text-base tw-font-medium tw-hidden md:tw-block">
                        {user.Fullname || user.Username}
                      </span>
                      <div className="tw-w-8 tw-h-8 tw-bg-[#99CCD0] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-white">
                        {(user.Fullname || user.Username || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    </div>
                  </Dropdown>

                  <Link
                    to="/cart"
                    className={classNames("tw-text-xl", {
                      "!tw-text-white": lightMode,
                      "!tw-text-[#212121]": !lightMode,
                    })}
                  >
                    <ShoppingCartOutlined />
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className={classNames("tw-text-xl", {
                    "!tw-text-white": lightMode,
                    "!tw-text-[#212121]": !lightMode,
                  })}
                >
                  <UserOutlined />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientHeader;
