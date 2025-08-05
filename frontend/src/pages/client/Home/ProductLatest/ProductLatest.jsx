import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Row, Col, Spin } from "antd";
import apiClient from "../../../../api/api";
import ProductItem from "../../../../components/ProductItem/ProductItem";

const ProductLatest = () => {
  const fetchProducts = async () => {
    try {
      const response = await apiClient.get("/api/products", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.data?.success) {
        const data = response.data.data;
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.products)) return data.products;
      }
      return [];
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      return [];
    }
  };

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["latestProducts"], // ✅ Key riêng biệt
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 phút
    cacheTime: 1000 * 60 * 10, // 10 phút
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="container tw-mx-auto tw-py-[48px] tw-text-center">
        <Spin size="large" />
        <p className="tw-mt-4">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container tw-mx-auto tw-py-[48px] tw-text-center">
        <p>Không thể tải sản phẩm. Vui lòng thử lại sau!</p>
      </div>
    );
  }

  return (
    <div className="container tw-mx-auto tw-py-[48px]">
      <h2 className="tw-font-bold tw-text-[32px] tw-mb-8">Sản phẩm nổi bật</h2>
      <Row gutter={[24, 24]}>
        {products.length > 0 ? (
          products
            .slice(-4) // ✅ Lấy 4 sản phẩm mới nhất
            .map((product) => (
              <Col key={product.ProductID || Math.random()} xs={24} sm={12} md={6}>
                <ProductItem product={product} />
              </Col>
            ))
        ) : (
          <p className="tw-text-center tw-w-full">Không có sản phẩm nào</p>
        )}
      </Row>
    </div>
  );
};

export default ProductLatest;
