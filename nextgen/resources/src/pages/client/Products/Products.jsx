import { Checkbox, Radio, Select, Slider } from "antd";
import { useState } from "react";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import { formatPrice } from "../../../utils/formatPrice";
import { Link } from "react-router-dom";
import ProductItem from "../../../components/ProductItem/ProductItem";

const Products = () => {
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedColor, setSelectedColor] = useState(null);

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

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
          <div className="row align-items-end">
            <div className="col-md-12">
              <h1 className="tw-text-center tw-mb-36">Products</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section bg-light">
        <div className="container">
          <div className="tw-grid tw-grid-cols-12 tw-gap-8">
            <div className="tw-col-span-3">
              <section>
                <h2 className="tw-text-[#212121] tw-font-bold tw-text-[32px]">
                  Danh mục
                </h2>
              </section>

              <hr className="tw-my-8 tw-bg-[#EEEEEE]" />

              <section>
                <h3 className="tw-text-[#212121] tw-font-bold tw-text-xl tw-mb-4">
                  Mức giá
                </h3>

                <Slider
                  range
                  value={priceRange}
                  min={0}
                  max={1000000}
                  onChange={handlePriceChange}
                  tooltip={{
                    formatter: (value) => formatPrice(value),
                  }}
                />

                <p>
                  <span className="tw-text-[#212121]">Giá:</span>{" "}
                  <span className="tw-text-[#9E9E9E]">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </span>
                </p>
              </section>

              <hr className="tw-my-8 tw-bg-[#EEEEEE]" />

              <section>
                <h3 className="tw-text-[#212121] tw-font-bold tw-text-xl tw-mb-4">
                  Chất liệu
                </h3>

                <div className="tw-flex tw-flex-col tw-gap-3">
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <Checkbox className="tw-text-[#212121] tw-text-base">
                      Ceramic
                    </Checkbox>

                    <p className="tw-m-0 tw-border tw-border-solid tw-border-[#999] tw-rounded-xl tw-text-xs tw-text-[#999] tw-min-w-6 tw-flex tw-justify-center tw-px-1">
                      10
                    </p>
                  </div>

                  <div className="tw-flex tw-items-center tw-justify-between">
                    <Checkbox className="tw-text-[#212121] tw-text-base">
                      Ceramic
                    </Checkbox>

                    <p className="tw-m-0 tw-border tw-border-solid tw-border-[#999] tw-rounded-xl tw-text-xs tw-text-[#999] tw-min-w-6 tw-flex tw-justify-center tw-px-1">
                      10
                    </p>
                  </div>

                  <div className="tw-flex tw-items-center tw-justify-between">
                    <Checkbox className="tw-text-[#212121] tw-text-base">
                      Ceramic
                    </Checkbox>

                    <p className="tw-m-0 tw-border tw-border-solid tw-border-[#999] tw-rounded-xl tw-text-xs tw-text-[#999] tw-min-w-6 tw-flex tw-justify-center tw-px-1">
                      10
                    </p>
                  </div>
                </div>
              </section>

              <hr className="tw-my-8 tw-bg-[#EEEEEE]" />

              <section>
                <h3 className="tw-text-[#212121] tw-font-bold tw-text-xl tw-mb-4">
                  Màu sắc
                </h3>

                <Radio.Group
                  value={selectedColor}
                  onChange={handleColorChange}
                  className="tw-flex tw-flex-col tw-gap-3"
                >
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <Radio
                      value="xanh"
                      className="tw-text-[#212121] tw-text-base"
                    >
                      Xanh
                    </Radio>

                    <p className="tw-m-0 tw-border tw-border-solid tw-border-[#999] tw-rounded-xl tw-text-xs tw-text-[#999] tw-min-w-6 tw-flex tw-justify-center tw-px-1">
                      10
                    </p>
                  </div>

                  <div className="tw-flex tw-items-center tw-justify-between">
                    <Radio
                      value="do"
                      className="tw-text-[#212121] tw-text-base"
                    >
                      Đỏ
                    </Radio>

                    <p className="tw-m-0 tw-border tw-border-solid tw-border-[#999] tw-rounded-xl tw-text-xs tw-text-[#999] tw-min-w-6 tw-flex tw-justify-center tw-px-1">
                      10
                    </p>
                  </div>

                  <div className="tw-flex tw-items-center tw-justify-between">
                    <Radio
                      value="vang"
                      className="tw-text-[#212121] tw-text-base"
                    >
                      Vàng
                    </Radio>

                    <p className="tw-m-0 tw-border tw-border-solid tw-border-[#999] tw-rounded-xl tw-text-xs tw-text-[#999] tw-min-w-6 tw-flex tw-justify-center tw-px-1">
                      10
                    </p>
                  </div>
                </Radio.Group>
              </section>

              <hr className="tw-my-8 tw-bg-[#EEEEEE]" />

              <section>
                <h3 className="tw-text-[#212121] tw-font-bold tw-text-xl tw-mb-4">
                  Kích thước
                </h3>

                <div className="tw-flex tw-flex-col tw-gap-3">
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <Checkbox className="tw-text-[#212121] tw-text-base">
                      1m2
                    </Checkbox>

                    <p className="tw-m-0 tw-border tw-border-solid tw-border-[#999] tw-rounded-xl tw-text-xs tw-text-[#999] tw-min-w-6 tw-flex tw-justify-center tw-px-1">
                      10
                    </p>
                  </div>

                  <div className="tw-flex tw-items-center tw-justify-between">
                    <Checkbox className="tw-text-[#212121] tw-text-base">
                      1m4
                    </Checkbox>

                    <p className="tw-m-0 tw-border tw-border-solid tw-border-[#999] tw-rounded-xl tw-text-xs tw-text-[#999] tw-min-w-6 tw-flex tw-justify-center tw-px-1">
                      10
                    </p>
                  </div>

                  <div className="tw-flex tw-items-center tw-justify-between">
                    <Checkbox className="tw-text-[#212121] tw-text-base">
                      1m6
                    </Checkbox>

                    <p className="tw-m-0 tw-border tw-border-solid tw-border-[#999] tw-rounded-xl tw-text-xs tw-text-[#999] tw-min-w-6 tw-flex tw-justify-center tw-px-1">
                      10
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="tw-col-span-9">
              <div className="tw-flex tw-items-center tw-justify-between">
                <p className="tw-m-0 tw-text-xs tw-uppercase tw-text-[#666]">
                  Hiển thị 12 sản phẩm, trong số 20 sản phẩm
                </p>

                <Select
                  defaultValue="Mới nhất"
                  options={[
                    { value: "Mới nhất", label: "Mới nhất" },
                    { value: "Bán chạy", label: "Bán chạy" },
                    { value: "Giá thấp", label: "Giá thấp" },
                    { value: "Giá cao", label: "Giá cao" },
                  ]}
                  className="tw-w-40"
                />
              </div>

              <div className="tw-mt-4 tw-grid tw-grid-cols-3 tw-gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <ProductItem key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
