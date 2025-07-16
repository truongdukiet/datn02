import React, { useState } from "react";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import { Link } from "react-router-dom";
import { formatPrice } from "../../../utils/formatPrice";
import ProductItem from "../../../components/ProductItem/ProductItem";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <ClientHeader lightMode={false} />

      <main className="tw-pt-32 container">
        <div className="tw-grid tw-grid-cols-2 tw-gap-6">
          <div className="tw-col-span-1">
            <div className="tw-relative tw-pt-[100%]">
              <img
                src="https://picsum.photos/1000/1000"
                alt="product"
                className="tw-w-full tw-h-full tw-object-cover tw-block tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-bottom-0"
              />
            </div>
          </div>

          <div className="tw-col-span-1">
            <div className="tw-flex tw-items-center tw-gap-3 tw-uppercase">
              <Link
                to="/"
                className="tw-m-0 tw-text-[#9E9E9E] tw-text-sm tw-uppercase tw-font-normal"
              >
                Trang chủ
              </Link>

              <div className="tw-text-xs tw-text-[#9e9e9e]">
                <i class="fa-solid fa-chevron-right"></i>
              </div>

              <p className="tw-m-0 tw-text-[#9E9E9E] tw-text-sm tw-uppercase tw-font-normal">
                Sản phẩm
              </p>

              <div className="tw-text-xs tw-text-[#9e9e9e]">
                <i class="fa-solid fa-chevron-right"></i>
              </div>

              <p className="tw-m-0 tw-text-[#9E9E9E] tw-text-sm tw-uppercase tw-font-normal">
                Ghế sofa
              </p>

              <div className="tw-text-xs tw-text-[#9e9e9e]">
                <i class="fa-solid fa-chevron-right"></i>
              </div>

              <p className="tw-m-0 tw-text-[#212121] tw-text-sm tw-uppercase tw-font-normal">
                Ghế Sofa MOHO HALDEN 801
              </p>
            </div>

            <h1 className="tw-mt-6 tw-text-[#212121] tw-text-[32px] tw-font-bold">
              Ghế Sofa HALDEN 801
            </h1>

            <div className="tw-flex tw-items-center tw-gap-6 tw-mt-4">
              <p className="tw-m-0 tw-text-2xl tw-font-bold tw-text-[#99CCD0]">
                {formatPrice(950000)}
              </p>

              <p className="tw-text-xl tw-text-[#E0E0E0] tw-line-through tw-font-bold tw-m-0">
                {formatPrice(10000000)}
              </p>

              <p className="tw-m-0 tw-px-3 tw-py-1 tw-bg-[#99CCD0] tw-text-white tw-text-xs tw-font-medium">
                -5%
              </p>
            </div>

            <hr className="tw-my-6" />

            <section>
              <p className="tw-font-semibold tw-text-[#212121] tw-m-0">
                Kích thước:
              </p>
              <p className="tw-m-0 tw-text-[#424242] tw-mt-1.5">
                Dài 180cm x Rộng 85cm x Cao 82cm
              </p>
            </section>

            {/* <section className="tw-mt-6">
              <p className="tw-font-semibold tw-text-[#212121] tw-m-0">
                Chất liệu:
              </p>
              <p className="tw-m-0 tw-text-[#424242] tw-mt-1.5">
                - Gỗ cao su tự nhiên <br />
                - Vải sợi tổng hợp có khả năng chống thấm nước và dầu <br />
                (*) Tiêu chuẩn California Air Resources Board xuất khẩu Mỹ, đảm
                bảo gỗ không độc hại, an toàn sức khỏe. <br />
              </p>
            </section>

            <hr className="tw-my-6" /> */}

            <section>
              <p className="tw-font-semibold tw-text-[#212121] tw-m-0">
                Màu sắc:
              </p>

              <div className="tw-mt-2 tw-flex tw-items-center tw-gap-3">
                <div className="tw-cursor-pointer tw-border tw-border-solid tw-border-[#99CCD0] tw-size-6 tw-p-1">
                  <p className="tw-bg-[#D9D9D9] tw-w-full tw-h-full tw-m-0"></p>
                </div>

                <div className="tw-cursor-pointer tw-border tw-border-[#99CCD0] tw-size-6 tw-p-1">
                  <p className="tw-bg-[#F44336] tw-w-full tw-h-full tw-m-0"></p>
                </div>

                <div className="tw-cursor-pointer tw-border tw-border-[#99CCD0] tw-size-6 tw-p-1">
                  <p className="tw-bg-[#2196F3] tw-w-full tw-h-full tw-m-0"></p>
                </div>
              </div>
            </section>

            <hr className="tw-my-6" />

            <section className="tw-flex tw-items-center">
              <div className="tw-h-12 tw-border tw-border-solid tw-border-[#E0E0E0] tw-flex tw-items-center">
                <div
                  className="tw-size-6 tw-flex tw-items-center tw-justify-center tw-mx-3 tw-cursor-pointer"
                  onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                >
                  <i class="fa-solid fa-minus"></i>
                </div>

                <input
                  type="number"
                  name=""
                  id=""
                  className="tw-bg-transparent tw-border-none tw-outline-none tw-text-black tw-w-12 tw-text-center"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />

                <div
                  className="tw-size-6 tw-flex tw-items-center tw-justify-center tw-mx-3 tw-cursor-pointer"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <i class="fa-solid fa-plus"></i>
                </div>
              </div>

              <button className="tw-bg-[#99CCD0] tw-text-white tw-font-medium tw-px-4 tw-h-12 tw-uppercase tw-ml-4 tw-cursor-pointer">
                Thêm vào giỏ hàng
              </button>
            </section>

            <hr className="tw-my-6" />

            <section>
              <p className="tw-mb-2">
                <span className="tw-font-semibold tw-text-[#616161]">
                  Danh mục:
                </span>
                <span className="tw-text-[#9E9E9E] tw-ml-1">Ghế sofa</span>
              </p>

              <p className="tw-mb-2">
                <span className="tw-font-semibold tw-text-[#616161]">
                  Thương hiệu:
                </span>
                <span className="tw-text-[#9E9E9E] tw-ml-1">HALDEN</span>
              </p>

              <p>
                <span className="tw-font-semibold tw-text-[#616161]">
                  Mã sản phẩm:
                </span>
                <span className="tw-text-[#9E9E9E] tw-ml-1">801</span>
              </p>
            </section>
          </div>
        </div>

        <section className="tw-mb-12 tw-mt-6">
          <div className="tw-flex tw-justify-center tw-border-b tw-border-solid tw-border-[#E0E0E0] tw-border-x-0 tw-border-t-0">
            <p className="tw-m-0 tw-px-6 tw-py-3 tw-cursor-pointer tw-font-bold tw-text-[#99CCD0] tw-border-b-2 tw-border-solid tw-border-[#99CCD0] tw-border-x-0 tw-border-t-0 tw-text-xl">
              Mô tả
            </p>
            <p className="tw-m-0 tw-px-6 tw-py-3 tw-cursor-pointer tw-font-bold tw-text-[#757575] tw-text-xl">
              Đánh giá
            </p>
          </div>
        </section>

        <section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </section>

        <section className="tw-my-12">
          <h2 className="tw-text-[32px] tw-font-bold tw-text-[#212121] tw-text-center">
            Sản phẩm liên quan
          </h2>

          <div className="tw-mt-8 tw-grid tw-grid-cols-12 tw-gap-6">
            <div className="tw-col-span-3">
              <ProductItem />
            </div>

            <div className="tw-col-span-3">
              <ProductItem />
            </div>

            <div className="tw-col-span-3">
              <ProductItem />
            </div>

            <div className="tw-col-span-3">
              <ProductItem />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProductDetail;
