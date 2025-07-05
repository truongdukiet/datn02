import React from "react";
import { formatPrice } from "../../utils/formatPrice";
import { Link } from "react-router-dom";

const ProductItem = () => {
  return (
    <div>
      <div className="tw-relative tw-pt-[100%]">
        <img
          src="https://picsum.photos/500/500"
          alt="product"
          className="tw-w-full tw-h-full tw-object-cover tw-absolute tw-top-0 tw-left-0"
        />

        <p className="tw-px-3 tw-py-1 tw-bg-[#99CCD0] tw-text-white tw-absolute tw-top-4 tw-right-4 tw-text-xs tw-font-medium">
          -5%
        </p>
      </div>

      <div className="tw-mt-5 tw-flex tw-flex-col tw-items-center tw-gap-y-3">
        <Link className="tw-text-center tw-line-clamp-1 tw-font-semibold tw-text-[#212121]">
          Ghế Sofa MOHO HALDEN 801
        </Link>

        <p className="tw-m-0 tw-flex tw-items-center tw-gap-x-4">
          <span className="tw-text-[#99CCD0]">{formatPrice(9000000)}</span>
          <span className="tw-text-sm tw-line-through tw-text-[#E0E0E0]">
            {formatPrice(10000000)}
          </span>
        </p>

        <hr className="tw-bg-[#EEEEEE] tw-w-full tw-m-0" />

        <button className="tw-uppercase tw-bg-transparent tw-text-[#9E9E9E] tw-font-medium tw-outline-none tw-border-none tw-flex tw-items-center tw-gap-x-2 tw-cursor-pointer">
          Thêm vào giỏ hàng
          <i class="fa-solid fa-cart-shopping"></i>
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
