import { Flex, Spin } from "antd";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import apiClient from "../../../../api/api";

const CategoryList = () => {
  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/api/categories", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data; // API trả về { success, data }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return null;
    }
  };

  const {
    data: categoryResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Đảm bảo categories luôn là mảng
  const categories = Array.isArray(categoryResponse)
    ? categoryResponse
    : categoryResponse?.data || [];

  if (isLoading) {
    return (
      <div className="container tw-mx-auto tw-mt-[52px] tw-text-center">
        <Spin size="large" />
        <p className="tw-mt-4">Đang tải danh mục...</p>
      </div>
    );
  }

  if (error || categories.length === 0) {
    return (
      <div className="container tw-mx-auto tw-mt-[52px] tw-text-center">
        <p className="tw-text-gray-500 tw-text-lg">Chưa có danh mục nào</p>
      </div>
    );
  }

  return (
    <div className="container tw-mx-auto tw-mt-[52px]">
      <h2 className="tw-font-bold tw-text-[32px]">Danh mục</h2>

      <Flex className="tw-mt-[32px]" wrap="wrap" gap={42} justify="center">
        {categories.slice(0, 6).map((category) => (
          <Link
            to={`/products?category=${category.CategoryID}`}
            key={category.CategoryID}
            className="tw-text-center tw-cursor-pointer hover:tw-transform hover:tw-scale-105 tw-transition-all tw-duration-300"
          >
            {/* ✅ Chỉ giữ ảnh từ localhost */}
            <img
              src={`http://localhost:8000/storage/${category.Image}`}
              alt={category.Name}
              className="admin-category-image tw-size-[123px] tw-border tw-border-solid tw-border-[#2196F3] tw-rounded-full tw-object-cover"
              onError={(e) => {
                e.target.src = "/images/category-1.png"; // fallback nếu ảnh không tồn tại
              }}
            />
            <p className="tw-text-[20px] tw-mt-[12px] tw-font-medium">
              {category.Name}
            </p>
          </Link>
        ))}
      </Flex>
    </div>
  );
};

export default CategoryList;
