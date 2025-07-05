import React from "react";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import { Link } from "react-router-dom";
import { Checkbox } from "antd";

const Register = () => {
  return (
    <>
      <ClientHeader lightMode={false} />

      <main className="tw-min-h-[80vh] tw-pt-24 container">
        <div className="tw-mt-6 tw-mb-24">
          <div className="tw-flex tw-items-center tw-gap-5">
            <Link to="/" className="tw-text-[#9E9E9E]">
              Trang chủ
            </Link>

            <div className="tw-text-[#9E9E9E]">
              <i className="fa-solid fa-chevron-right"></i>
            </div>

            <p className="tw-text-[#1A1C20] tw-font-bold tw-m-0">Đăng ký</p>
          </div>

          <form
            action=""
            className="tw-w-[600px] tw-max-w-full tw-mx-auto tw-mt-24"
          >
            <h1 className="tw-text-center tw-text-5xl tw-font-bold tw-mb-6">
              Đăng ký
            </h1>

            <div className="row form-group">
              <div className="col-md-12 mb-3 mb-md-0">
                <label className="font-weight-bold" htmlFor="phone">
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="phone"
                  className="form-control"
                  placeholder="0983983983"
                />
              </div>
            </div>

            <div className="row form-group">
              <div className="col-md-12 mb-3 mb-md-0">
                <label className="font-weight-bold" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="phone"
                  className="form-control"
                  placeholder="0983983983"
                />
              </div>
            </div>

            <div className="row form-group">
              <div className="col-md-12 tw-mb-3 mb-md-0">
                <label className="font-weight-bold" htmlFor="password">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="phone"
                  className="form-control"
                  placeholder="0983983983"
                />
              </div>
            </div>

            <div className="row form-group">
              <div className="col-md-12 tw-mb-3 mb-md-0">
                <label className="font-weight-bold" htmlFor="password">
                  Nhập lại mật khẩu
                </label>
                <input
                  type="password"
                  id="phone"
                  className="form-control"
                  placeholder="0983983983"
                />
              </div>
            </div>

            <div className="tw-flex tw-items-center tw-gap-x-2">
              <Checkbox>
                <p className="tw-text-[#1A1C20] tw-m-0">
                  Đồng ý với{" "}
                  <Link className="tw-text-[#99CCD0] tw-underline">
                    điều khoản
                  </Link>{" "}
                  và{" "}
                  <Link className="tw-text-[#99CCD0] tw-underline">
                    điều kiện
                  </Link>{" "}
                  của chúng tôi
                </p>
              </Checkbox>
            </div>

            <input
              type="submit"
              value="Đăng ký"
              className="btn btn-primary rounded-0 btn-lg tw-w-full tw-text-2xl tw-mt-6 tw-uppercase tw-font-semibold"
            />

            <p className="tw-text-center tw-mt-6">
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className="tw-text-[#99CCD0] tw-underline">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
