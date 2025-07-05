import classNames from "classnames";
import React from "react";
import { Link, NavLink } from "react-router-dom";

const ClientHeader = ({ lightMode = true }) => {
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

      {/* Navbar */}
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
              Interior
            </Link>

            <form
              action=""
              className="tw-w-[300px] tw-h-12 tw-border tw-border-solid tw-border-[#BDBDBD] tw-flex"
            >
              <input
                type="text"
                placeholder="Search"
                className={classNames(
                  "tw-bg-transparent tw-border-none tw-outline-none tw-flex-1 tw-px-2 [&::placeholder]:tw-text-gray-[#BDBDBD]",
                  {
                    "tw-text-white": lightMode,
                    "tw-text-[#212121]": !lightMode,
                  }
                )}
              />

              <div
                className={classNames("tw-self-center tw-mx-4", {
                  "!tw-text-white": lightMode,
                  "!tw-text-[#212121]": !lightMode,
                })}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
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
                <NavLink className="!tw-text-[inherit]" to="/">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink className="!tw-text-[inherit]" to="/about">
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink className="!tw-text-[inherit]" to="/projects">
                  Projects
                </NavLink>
              </li>
              <li>
                <NavLink className="!tw-text-[inherit]" to="/news">
                  News
                </NavLink>
              </li>
              <li>
                <NavLink className="!tw-text-[inherit]" to="/contact">
                  Contact
                </NavLink>
              </li>
            </ul>

            <div className="tw-flex tw-items-center tw-gap-6">
              <div
                className={classNames("tw-text-xl", {
                  "!tw-text-white": lightMode,
                  "!tw-text-[#212121]": !lightMode,
                })}
              >
                <i class="fa-regular fa-heart"></i>
              </div>

              <Link
                to="/login"
                className={classNames("tw-text-xl", {
                  "!tw-text-white": lightMode,
                  "!tw-text-[#212121]": !lightMode,
                })}
              >
                <i class="fa-regular fa-user"></i>
              </Link>

              <Link
                to="/cart"
                className={classNames("tw-text-xl", {
                  "!tw-text-white": lightMode,
                  "!tw-text-[#212121]": !lightMode,
                })}
              >
                <i class="fa-solid fa-cart-shopping"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientHeader;
