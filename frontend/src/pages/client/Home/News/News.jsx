import React from "react";
import { Link } from "react-router-dom";

// Dữ liệu mẫu (có thể thay thế bằng dữ liệu từ API)
const newsData = [
  {
    id: 1,
    image: "/images/news-1.png",
    date: "23, thang 6 2025",
    title: "Xu hướng nội thất 2025: Tối giản lên ngôi, thân thiện môi trường",
  },
  {
    id: 2,
    image: "/images/news-2.png",
    date: "20, tháng 7 2025",
    title: "5 mẹo nhỏ biến phòng khách thành không gian thư giãn lý tưởng",
  },
  {
    id: 3,
    image: "/images/news-3.png",
    date: "18, tháng 7 2025",
    title: "Thiết kế căn hộ 60m2 theo phong cách Scandinavian ấm cúng",
  },
];

const News = () => {
  return (
    <div className="tw-bg-[#E0E0E0] tw-mt-[32px]">
      <div className="container tw-mx-auto tw-py-[48px]">
        <div className="tw-grid tw-grid-cols-3 tw-gap-[24px]">
          {/* Sử dụng map để lặp qua mảng dữ liệu và render từng tin tức */}
          {newsData.map((newsItem) => (
            <div key={newsItem.id}>
              <img
                src={newsItem.image}
                alt={newsItem.title}
                className="tw-block tw-w-full"
              />
              <p className="tw-text-[12px] tw-text-[#BDBDBD] tw-mt-[16px] tw-mb-[12px]">
                {newsItem.date}
              </p>
              <Link to={`/news/${newsItem.id}`} className="tw-text-[#212121]">
                {newsItem.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
