import React, { useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { formatPrice } from "../../../utils/formatPrice";
import ProductItem from "../../../components/ProductItem/ProductItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../api/api";
import { message } from "antd";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import { favoriteApi } from "../../../api/favoriteApi";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [availableAttributeValues, setAvailableAttributeValues] = useState({});
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [mainImage, setMainImage] = useState(null);
  const [thumbnailImages, setThumbnailImages] = useState([]);
  
  const noMatchingVariantRef = useRef(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  // ✅ Lấy thông tin user từ localStorage
  const getUserInfo = () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const user = getUserInfo();
  const userId = user?.UserID;
  const token = localStorage.getItem("token");

  // ✅ Query sản phẩm chi tiết
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/products/detail/${id}`);
      return response.data.data;
    },
    onSuccess: (data) => {
      if (data?.variants && data.variants.length > 0) {
        const initialAttributes = {};
        if (data.variants[0].attributes) {
          data.variants[0].attributes.forEach((attr) => {
            if (attr?.attribute) {
              initialAttributes[attr.attribute.AttributeID] = attr.value;
            }
          });
        }
        setSelectedVariant(data.variants[0]);
        setSelectedAttributes(initialAttributes);
        updateAvailableAttributeValues(initialAttributes, data.variants);
      } else {
        setSelectedVariant(null);
      }

      // Xử lý ảnh sản phẩm
      let imagesToDisplay = [];
      let mainImg = null;

      if (data.variants?.[0]) {
        imagesToDisplay = data.media.filter(
          (img) => img.variant_id === data.variants[0].ProductVariantID
        );
      }

      if (imagesToDisplay.length === 0) {
        imagesToDisplay = data.media.filter((img) => img.variant_id === null);
      }

      mainImg = imagesToDisplay.find((img) => img.is_main === 1) || imagesToDisplay[0];
      setMainImage(mainImg);
      setThumbnailImages(imagesToDisplay.filter((img) => img !== mainImg));
    },
  });

  // ✅ Query danh sách yêu thích
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => favoriteApi.getFavorites(userId),
    enabled: !!userId,
    select: (data) => data?.data || [],
  });

  // ✅ Kiểm tra xem sản phẩm có trong danh sách yêu thích không
  const isFavorite =
    selectedVariant &&
    Array.isArray(favorites) &&
    favorites.some(
      (fav) =>
        fav?.ProductVariantID === selectedVariant?.ProductVariantID ||
        fav?.productVariant?.ProductVariantID === selectedVariant?.ProductVariantID
    );

  // ✅ Query sản phẩm liên quan
  const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery({
    queryKey: ["relatedProducts"],
    queryFn: async () => {
      const response = await apiClient.get("/api/products");
      return response.data.data;
    },
  });

  // ✅ Mutation thêm vào giỏ hàng
  const addToCartMutation = useMutation({
    mutationFn: async ({ variantId, quantity }) => {
      const response = await apiClient.post("/api/carts", {
        ProductVariantID: variantId,
        Quantity: quantity,
      });
      return response.data;
    },
    onSuccess: (data) => {
      message.success(data.message || "Đã thêm sản phẩm vào giỏ hàng!");
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng."
      );
    },
  });

  // ✅ Mutation thêm yêu thích
  const addToFavoritesMutation = useMutation({
    mutationFn: favoriteApi.addToFavorites,
    onSuccess: () => {
      message.success("Đã thêm vào danh sách yêu thích!");
      queryClient.invalidateQueries(["favorites", userId]);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi thêm vào danh sách yêu thích."
      );
    },
  });

  // ✅ Mutation xóa yêu thích
  const removeFromFavoritesMutation = useMutation({
    mutationFn: favoriteApi.removeFromFavorites,
    onSuccess: () => {
      message.success("Đã xóa khỏi danh sách yêu thích!");
      queryClient.invalidateQueries(["favorites", userId]);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi xóa khỏi danh sách yêu thích."
      );
    },
  });

  // ✅ Mutation gửi đánh giá
  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const response = await apiClient.post("/api/reviews", {
        product_id: id,
        ...reviewData,
      });
      return response.data;
    },
    onSuccess: (data) => {
      message.success("Đã gửi đánh giá thành công!");
      setNewReview({ rating: 0, comment: "" });
      queryClient.invalidateQueries(["product", id]);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi gửi đánh giá."
      );
    },
  });

  // ✅ Cập nhật giá trị thuộc tính khả dụng
  const updateAvailableAttributeValues = (currentAttributes, variants) => {
    if (!variants) return;
    const available = {};
    const allAttributeIds = new Set(
      variants.flatMap((variant) =>
        variant.attributes.flatMap((attr) =>
          attr?.attribute?.AttributeID ? [attr.attribute.AttributeID] : []
        )
      )
    );

    allAttributeIds.forEach((attrId) => {
      const validValues = new Set();
      variants.forEach((variant) => {
        const matchesOtherAttributes = Object.entries(currentAttributes).every(
          ([currentAttrId, currentValue]) => {
            if (currentAttrId == attrId) return true;
            return variant.attributes.some(
              (attr) =>
                attr?.attribute?.AttributeID == currentAttrId &&
                attr.value === currentValue
            );
          }
        );

        if (matchesOtherAttributes) {
          const attrValue = variant.attributes.find(
            (attr) => attr?.attribute?.AttributeID == attrId
          )?.value;
          if (attrValue) validValues.add(attrValue);
        }
      });
      available[attrId] = Array.from(validValues);
    });
    setAvailableAttributeValues(available);
  };

  // ✅ Xử lý chọn thuộc tính
  const handleAttributeSelect = (attributeId, value) => {
    const updatedAttributes = { ...selectedAttributes, [attributeId]: value };
    setSelectedAttributes(updatedAttributes);

    if (product?.variants) {
      const matchingVariant = product.variants.find((variant) =>
        Object.entries(updatedAttributes).every(([attrId, attrValue]) =>
          variant.attributes.some(
            (attr) =>
              attr?.attribute?.AttributeID == attrId && attr.value === attrValue
          )
        )
      );

      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
        noMatchingVariantRef.current = false;
        
        // Cập nhật ảnh khi chọn biến thể mới
        const variantImages = product.media.filter(
          (img) => img.variant_id === matchingVariant.ProductVariantID
        );
        if (variantImages.length > 0) {
          const mainImg = variantImages.find((img) => img.is_main === 1) || variantImages[0];
          setMainImage(mainImg);
          setThumbnailImages(variantImages.filter((img) => img !== mainImg));
        }
      } else {
        setSelectedVariant(null);
        noMatchingVariantRef.current = Object.keys(updatedAttributes).length > 0;
      }
      updateAvailableAttributeValues(updatedAttributes, product.variants);
    }
  };

  // ✅ Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!token) {
      message.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login");
      return;
    }

    let variantToAdd = selectedVariant;
    if (!variantToAdd && product?.variants?.length > 0) {
      variantToAdd = product.variants[0];
    }

    if (!variantToAdd) {
      message.error("Sản phẩm này hiện không có sẵn!");
      return;
    }

    addToCartMutation.mutate({
      variantId: variantToAdd.ProductVariantID,
      quantity: quantity,
    });
  };

  // ✅ Xử lý toggle yêu thích
  const handleToggleFavorite = () => {
    if (!token || !userId) {
      message.error("Vui lòng đăng nhập để sử dụng tính năng yêu thích!");
      return;
    }

    if (!selectedVariant) {
      message.error("Sản phẩm không có biến thể");
      return;
    }

    const favoriteData = {
      UserID: userId,
      ProductVariantID: selectedVariant.ProductVariantID,
    };

    if (isFavorite) {
      removeFromFavoritesMutation.mutate(favoriteData);
    } else {
      addToFavoritesMutation.mutate(favoriteData);
    }
  };

  // ✅ Xử lý gửi đánh giá
  const handleSubmitReview = () => {
    if (!newReview.rating || !newReview.comment.trim()) {
      message.error("Vui lòng chọn số sao và nhập nội dung đánh giá!");
      return;
    }

    submitReviewMutation.mutate({
      rating: newReview.rating,
      comment: newReview.comment,
    });
  };

  // ✅ Xử lý click thumbnail
  const handleClickThumbnail = (clickedImage) => {
    setMainImage(clickedImage);
  };

  if (isLoading) {
    return (
      <>
        <ClientHeader lightMode={false} />
        <div className="tw-pt-32 tw-min-h-[calc(100vh-128px)] container tw-flex tw-items-center tw-justify-center">
          <div className="spinner-border text-primary tw-w-16 tw-h-16" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <ClientHeader lightMode={false} />
        <div className="tw-pt-32 container tw-text-center tw-py-20">
          <h2 className="tw-text-2xl tw-font-bold">Không tìm thấy sản phẩm</h2>
          <Link to="/products" className="tw-text-[#99CCD0] tw-underline">
            Quay lại cửa hàng
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <ClientHeader lightMode={false} />

      <main className="tw-pt-32 container">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8">
          {/* Ảnh sản phẩm */}
          <div className="tw-col-span-1">
            <div className="tw-relative">
              {/* Ảnh chính */}
              <div className="tw-aspect-square tw-border tw-rounded-xl tw-overflow-hidden tw-mb-4">
                <img
                  src={`http://localhost:8000/storage/${mainImage?.image || product?.Image}`}
                  alt={product?.Name}
                  className="tw-w-full tw-h-full tw-object-contain"
                />
              </div>

              {/* Nút yêu thích */}
              <button
                onClick={handleToggleFavorite}
                disabled={
                  addToFavoritesMutation.isPending ||
                  removeFromFavoritesMutation.isPending
                }
                className="tw-absolute tw-top-4 tw-right-4 tw-w-10 tw-h-10 tw-bg-white tw-rounded-full tw-border-none tw-cursor-pointer tw-shadow-md hover:tw-shadow-lg tw-transition-all tw-flex tw-items-center tw-justify-center disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
              >
                <i
                  className={`fa-heart tw-text-lg ${
                    isFavorite
                      ? "fas tw-text-red-500"
                      : "far tw-text-gray-400 hover:tw-text-red-500"
                  } tw-transition-colors`}
                ></i>
              </button>
            </div>

            {/* Ảnh con */}
            <div className="tw-grid tw-grid-cols-4 tw-gap-3">
              {thumbnailImages.map((img) => (
                <div
                  key={img.id}
                  className="tw-aspect-square tw-border tw-rounded-lg tw-cursor-pointer tw-overflow-hidden"
                  onClick={() => handleClickThumbnail(img)}
                >
                  <img
                    src={`http://localhost:8000/storage/${img.image}`}
                    alt={`Ảnh phụ ${img.id}`}
                    className="tw-w-full tw-h-full tw-object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="tw-col-span-1">
            {/* Breadcrumb */}
            <div className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-mb-6">
              <Link to="/" className="tw-text-[#9E9E9E] hover:tw-text-[#99CCD0]">
                Trang chủ
              </Link>
              <span className="tw-text-[#9e9e9e]">
                <i className="fa-solid fa-chevron-right"></i>
              </span>
              <Link to="/products" className="tw-text-[#9E9E9E] hover:tw-text-[#99CCD0]">
                Sản phẩm
              </Link>
              <span className="tw-text-[#9e9e9e]">
                <i className="fa-solid fa-chevron-right"></i>
              </span>
              <span className="tw-text-[#1A1C20]">{product.Name}</span>
            </div>

            <h1 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-mb-4">
              {product.Name}
            </h1>

            <div className="tw-flex tw-items-center tw-gap-4 tw-mb-6">
              <p className="tw-m-0 tw-text-2xl tw-font-bold tw-text-[#99CCD0]">
                {formatPrice(
                  selectedVariant ? selectedVariant.Price : product.base_price
                )}
              </p>
            </div>

            <div className="tw-mb-8">
              <p className="tw-font-semibold tw-mb-2">Mô tả:</p>
              <p className="tw-text-gray-700">
                {product.Description || "Sản phẩm chưa có mô tả chi tiết."}
              </p>
            </div>

            {/* Thuộc tính sản phẩm */}
            {product?.variants && product.variants.length > 0 && (
              <div className="tw-mb-8">
                {Array.from(
                  new Set(
                    product.variants.flatMap((v) =>
                      v.attributes.flatMap((a) =>
                        a?.attribute?.AttributeID ? [a.attribute.AttributeID] : []
                      )
                    )
                  )
                ).map((attrId) => {
                  const attribute = product.variants
                    .flatMap((v) => v.attributes)
                    .find((a) => a?.attribute?.AttributeID === attrId)?.attribute;

                  const uniqueValues = [
                    ...new Set(
                      product.variants.flatMap((v) =>
                        v.attributes
                          .filter((a) => a?.attribute?.AttributeID === attrId)
                          .map((a) => a.value)
                      )
                    ),
                  ];

                  return (
                    <div key={attrId} className="tw-mb-5">
                      <p className="tw-font-semibold tw-mb-2">
                        {attribute?.name || "Thuộc tính"}:
                      </p>
                      <div className="tw-flex tw-flex-wrap tw-gap-2">
                        {uniqueValues.map((value, idx) => {
                          const isSelected = selectedAttributes[attrId] === value;
                          const isAvailable =
                            !availableAttributeValues[attrId] ||
                            availableAttributeValues[attrId].includes(value) ||
                            isSelected;

                          return (
                            <button
                              key={idx}
                              type="button"
                              className={`tw-px-4 tw-py-2 tw-border tw-rounded-lg tw-transition ${
                                isSelected
                                  ? "tw-border-[#99CCD0] tw-bg-[#99CCD0] tw-text-white"
                                  : isAvailable
                                  ? "tw-border-gray-300 hover:tw-border-[#99CCD0]"
                                  : "tw-border-gray-300 tw-text-gray-400 tw-cursor-not-allowed"
                              }`}
                              onClick={() =>
                                isAvailable && handleAttributeSelect(attrId, value)
                              }
                              disabled={!isAvailable}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {noMatchingVariantRef.current && (
                  <div className="tw-text-red-500 tw-mt-2">
                    Tổ hợp thuộc tính này không có sẵn
                  </div>
                )}
              </div>
            )}

            {/* Số lượng và nút thêm giỏ */}
            <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-6 tw-mb-8">
              <div className="tw-flex tw-items-center">
                <span className="tw-mr-3 tw-font-medium">Số lượng:</span>
                <div className="tw-flex tw-items-center tw-border tw-rounded-lg">
                  <button
                    className="tw-px-4 tw-py-2 tw-text-lg disabled:tw-opacity-50"
                    onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="tw-px-4 tw-py-2 tw-w-12 tw-text-center">
                    {quantity}
                  </span>
                  <button
                    className="tw-px-4 tw-py-2 tw-text-lg"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className={`tw-px-8 tw-py-3 tw-rounded-lg tw-font-medium tw-transition ${
                  (!selectedVariant && !product?.variants?.length) ||
                  addToCartMutation.isPending
                    ? "tw-bg-gray-400 tw-cursor-not-allowed"
                    : "tw-bg-[#99CCD0] hover:tw-bg-[#88bbbf] tw-text-white"
                }`}
                onClick={handleAddToCart}
                disabled={
                  (!selectedVariant && !product?.variants?.length) ||
                  addToCartMutation.isPending
                }
              >
                {addToCartMutation.isPending ? (
                  <span className="tw-flex tw-items-center">
                    <i className="fas fa-spinner fa-spin tw-mr-2"></i>
                    Đang thêm...
                  </span>
                ) : (
                  "Thêm vào giỏ hàng"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Đánh giá sản phẩm */}
        <section className="tw-mt-16 tw-mb-12">
          <h2 className="tw-text-2xl tw-font-bold tw-mb-6">Đánh giá sản phẩm</h2>

          {product.reviews?.length > 0 ? (
            <div className="tw-space-y-6">
              {product.reviews.map((review, index) => (
                <div key={index} className="tw-border-b tw-pb-6">
                  <div className="tw-flex tw-justify-between tw-items-start">
                    <div>
                      <h4 className="tw-font-semibold">{review.user?.Name || "Khách hàng"}</h4>
                      <div className="tw-flex tw-items-center tw-mt-1">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${
                              i < review.rating
                                ? "tw-text-yellow-400"
                                : "tw-text-gray-300"
                            }`}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <span className="tw-text-gray-500 tw-text-sm">
                      {new Date(review.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="tw-mt-3 tw-text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="tw-text-center tw-py-8 tw-border tw-rounded-lg">
              <p className="tw-text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
          )}

          {/* Form đánh giá */}
          {token && (
            <div className="tw-mt-12 tw-border tw-rounded-xl tw-p-6">
              <h3 className="tw-text-xl tw-font-semibold tw-mb-4">
                Viết đánh giá của bạn
              </h3>

              <div className="tw-mb-4">
                <p className="tw-font-medium tw-mb-2">Đánh giá của bạn:</p>
                <div className="tw-flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`tw-text-2xl tw-mr-1 ${
                        star <= newReview.rating
                          ? "fas fa-star tw-text-yellow-400"
                          : "far fa-star tw-text-gray-300"
                      }`}
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                    ></button>
                  ))}
                </div>
              </div>

              <div className="tw-mb-4">
                <label
                  htmlFor="review-comment"
                  className="tw-font-medium tw-block tw-mb-2"
                >
                  Nhận xét
                </label>
                <textarea
                  id="review-comment"
                  rows="4"
                  className="tw-w-full tw-border tw-rounded-lg tw-p-3 focus:tw-outline-none focus:tw-border-[#99CCD0]"
                  placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                ></textarea>
              </div>

              <button
                className="tw-bg-[#99CCD0] hover:tw-bg-[#88bbbf] tw-text-white tw-font-medium tw-px-6 tw-py-2 tw-rounded-lg"
                onClick={handleSubmitReview}
                disabled={submitReviewMutation.isPending}
              >
                {submitReviewMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin tw-mr-2"></i>
                ) : null}
                Gửi đánh giá
              </button>
            </div>
          )}
        </section>

        {/* Sản phẩm liên quan */}
        <section className="tw-mb-16">
          <h2 className="tw-text-2xl tw-font-bold tw-mb-8 tw-text-center">
            Sản phẩm liên quan
          </h2>

          {isLoadingRelated ? (
            <div className="tw-flex tw-justify-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : relatedProducts && relatedProducts.length > 0 ? (
            <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-6">
              {relatedProducts
                .filter((item) => item.ProductID !== parseInt(id))
                .slice(0, 4)
                .map((product) => (
                  <ProductItem key={product.ProductID} product={product} />
                ))}
            </div>
          ) : (
            <div className="tw-text-center">
              <p className="tw-text-gray-500">Không có sản phẩm liên quan.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default ProductDetail;