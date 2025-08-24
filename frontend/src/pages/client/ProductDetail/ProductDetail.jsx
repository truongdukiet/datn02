import React, { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { formatPrice } from "../../../utils/formatPrice";
import ProductItem from "../../../components/ProductItem/ProductItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../api/api";
import { message } from "antd";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import { favoriteApi } from "../../../api/favoriteApi";
import axios from "axios";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [availableAttributeValues, setAvailableAttributeValues] = useState({});
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [mainImage, setMainImage] = useState(null);
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [variantAttributes, setVariantAttributes] = useState({});

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

        // Ảnh chính là ảnh của biến thể đầu tiên
        setMainImage({
          image: data.variants[0].Image,
          id: data.variants[0].ProductVariantID,
        });

        // Ảnh nhỏ là ảnh của các biến thể còn lại
        const thumbnails = data.variants
          .slice(1)
          .map((variant) => ({
            image: variant.Image,
            id: variant.ProductVariantID,
          }))
          .filter((img) => !!img.image); // chỉ lấy ảnh có tồn tại
        setThumbnailImages(thumbnails);
      } else {
        setSelectedVariant(null);
        setMainImage({ image: data.Image, id: 0 }); // fallback ảnh sản phẩm chung
        setThumbnailImages([]);
      }
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

  // Lấy thuộc tính từng variant giống admin
  useEffect(() => {
    const fetchAllVariantAttributes = async (variants = []) => {
      const attributesMap = {};
      await Promise.all(
        variants.map(async (variant) => {
          try {
            const res = await axios.get(
              `http://localhost:8000/api/variant-attributes?variant_id=${variant.ProductVariantID}`
            );
            // Lọc đúng variant
            const filtered = (res.data.data || []).filter(
              (attr) => attr.ProductVariantID === variant.ProductVariantID
            );
            attributesMap[variant.ProductVariantID] = filtered;
          } catch {
            attributesMap[variant.ProductVariantID] = [];
          }
        })
      );
      setVariantAttributes(attributesMap);
    };

    if (product?.variants?.length) {
      fetchAllVariantAttributes(product.variants);
    }
  }, [product]);

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

        // Ảnh chính là ảnh của biến thể được chọn
        setMainImage({
          image: matchingVariant.Image,
          id: matchingVariant.ProductVariantID,
        });

        // Ảnh nhỏ là ảnh của các biến thể còn lại (trừ biến thể đang chọn)
        const thumbnails = product.variants
          .filter((v) => v.ProductVariantID !== matchingVariant.ProductVariantID)
          .map((variant) => ({
            image: variant.Image,
            id: variant.ProductVariantID,
          }))
          .filter((img) => !!img.image);
        setThumbnailImages(thumbnails);
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
              <div className="tw-aspect-square tw-border tw-rounded-xl tw-overflow-hidden tw-mb-4 tw-bg-white tw-flex tw-items-center tw-justify-center tw-shadow-sm">
                <img
                  src={`http://localhost:8000/storage/${mainImage?.image || product?.Image}`}
                  alt={product?.Name}
                  className="tw-w-full tw-h-full tw-object-contain tw-transition-all tw-duration-300"
                  style={{ maxHeight: 400 }}
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
            <div className="tw-flex tw-gap-3 tw-mt-2">
              {product.variants
                .filter((v) => v.ProductVariantID !== mainImage?.id && !!v.Image)
                .map((variant) => (
                  <div
                    key={variant.ProductVariantID}
                    className={`tw-aspect-square tw-border tw-rounded-lg tw-cursor-pointer tw-overflow-hidden tw-bg-white tw-shadow-sm ${
                      mainImage?.id === variant.ProductVariantID
                        ? "tw-border-[#99CCD0] tw-ring-2 tw-ring-[#99CCD0]"
                        : "tw-border-gray-200"
                    }`}
                    style={{ width: 80, height: 80 }}
                    onClick={() =>
                      setMainImage({
                        image: variant.Image,
                        id: variant.ProductVariantID,
                      })
                    }
                  >
                    <img
                      src={`http://localhost:8000/storage/${variant.Image}`}
                      alt={`Ảnh phụ ${variant.ProductVariantID}`}
                      className="tw-w-full tw-h-full tw-object-cover tw-transition-all tw-duration-200 hover:tw-scale-105"
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
                {/** Lấy danh sách các thuộc tính theo thứ tự mong muốn, ví dụ: màu trước, size sau */}
                {["color", "size"].map((attrKey, idx) => {
                  // Tìm AttributeID theo tên thuộc tính (giả sử name là 'color' hoặc 'size')
                  const attrObj = Object.values(variantAttributes)
                    .flat()
                    .find((a) => a.name?.toLowerCase() === attrKey);
                  if (!attrObj) return null;
                  const attrId = attrObj.AttributeID;

                  // Lọc variants phù hợp với các thuộc tính đã chọn trước đó
                  let filteredVariants = product.variants;
                  for (let i = 0; i < idx; i++) {
                    const prevAttrKey = ["color", "size"][i];
                    const prevAttrObj = Object.values(variantAttributes)
                      .flat()
                      .find((a) => a.name?.toLowerCase() === prevAttrKey);
                    if (prevAttrObj && selectedAttributes[prevAttrObj.AttributeID]) {
                      filteredVariants = filteredVariants.filter((variant) =>
                        (variantAttributes[variant.ProductVariantID] || []).some(
                          (a) =>
                            a.AttributeID === prevAttrObj.AttributeID &&
                            a.value === selectedAttributes[prevAttrObj.AttributeID]
                        )
                      );
                    }
                  }

                  // Lấy các giá trị duy nhất cho thuộc tính này từ các biến thể đã lọc
                  const uniqueValues = [
                    ...new Set(
                      filteredVariants
                        .flatMap((v) => variantAttributes[v.ProductVariantID] || [])
                        .filter((a) => a.AttributeID === attrId)
                        .map((a) => a.value)
                    ),
                  ];

                  return (
                    <div key={attrId} className="tw-mb-5">
                      <p className="tw-font-semibold tw-mb-2">
                        {attrObj?.name || "Thuộc tính"}:
                      </p>
                      <div className="tw-flex tw-flex-wrap tw-gap-2">
                        {uniqueValues.map((value, idx2) => {
                          const isSelected = selectedAttributes[attrId] === value;
                          // Chỉ cho phép chọn nếu giá trị này có trong filteredVariants
                          const isAvailable = true;

                          return (
                            <button
                              key={idx2}
                              type="button"
                              className={`tw-px-4 tw-py-2 tw-border tw-rounded-lg tw-transition ${
                                isSelected
                                  ? "tw-border-[#99CCD0] tw-bg-[#99CCD0] tw-text-white"
                                  : isAvailable
                                  ? "tw-border-gray-300 hover:tw-border-[#99CCD0]"
                                  : "tw-border-gray-300 tw-text-gray-400 tw-cursor-not-allowed"
                              }`}
                              onClick={() => handleAttributeSelect(attrId, value)}
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

            {/* Chọn biến thể */}
            {/* <div className="tw-mb-8">
              <p className="tw-font-semibold tw-mb-2">Chọn biến thể:</p>
              <div className="tw-flex tw-flex-wrap tw-gap-3">
                {product.variants.map((variant) => {
                  const attrs = (variantAttributes[variant.ProductVariantID] || [])
                    .map((attr) => `${attr.value}`)
                    .join(" | ");
                  const isSelected = selectedVariant?.ProductVariantID === variant.ProductVariantID;

                  return (
                    <button
                      key={variant.ProductVariantID}
                      type="button"
                      className={
                        "tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition tw-border " +
                        (isSelected
                          ? "tw-bg-[#009688] tw-text-white tw-border-[#009688] tw-shadow"
                          : "tw-bg-white tw-text-[#009688] tw-border-gray-300 hover:tw-bg-[#e0f2f1] hover:tw-border-[#009688]")
                      }
                      style={{
                        minWidth: 80,
                        minHeight: 40,
                        outline: isSelected ? "2px solid #009688" : "none",
                      }}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setMainImage({
                          image: variant.Image,
                          id: variant.ProductVariantID,
                        });
                        const newAttrs = {};
                        (variantAttributes[variant.ProductVariantID] || []).forEach(attr => {
                          newAttrs[attr.AttributeID] = attr.value;
                        });
                        setSelectedAttributes(newAttrs);
                      }}
                    >
                      {attrs}
                    </button>
                  );
                })}
              </div>
            </div> */}

            {/* Chọn màu sắc */}
            <div className="tw-mb-5">
              <p className="tw-font-semibold tw-mb-2">Chọn màu sắc:</p>
              <div className="tw-flex tw-flex-wrap tw-gap-2">
                {[...new Set(
                  product.variants
                    .flatMap(v => (variantAttributes[v.ProductVariantID] || []))
                    .filter(attr => {
                      // Sửa lại lấy đúng tên thuộc tính
                      const attrName = attr.attribute?.name?.toLowerCase();
                      console.log("Color attribute:", attr); // Debug
                      return attrName === "màu sắc";
                    })
                    .map(attr => attr.value)
                )].map((color, idx) => {
                  const isSelected = selectedAttributes.color === color;

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={
                        "tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition tw-border " +
                        (isSelected
                          ? "tw-bg-[#009688] tw-text-white tw-border-[#009688] tw-shadow"
                          : "tw-bg-white tw-text-[#009688] tw-border-gray-300 hover:tw-bg-[#e0f2f1] hover:tw-border-[#009688]")
                      }
                      style={{
                        minWidth: 80,
                        minHeight: 40,
                        outline: isSelected ? "2px solid #009688" : "none",
                      }}
                      onClick={() => {
                        setSelectedAttributes({ color });
                        setSelectedVariant(null);
                      }}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chọn kích thước */}
            {selectedAttributes.color && (
              <div className="tw-mb-8">
                <p className="tw-font-semibold tw-mb-2">Chọn kích thước:</p>
                <div className="tw-flex tw-flex-wrap tw-gap-2">
                  {[...new Set(
                    product.variants
                      .filter(variant =>
                        (variantAttributes[variant.ProductVariantID] || []).some(
                          attr => {
                            const attrName = attr.attribute?.name?.toLowerCase();
                            return attrName === "màu sắc" && attr.value === selectedAttributes.color;
                          }
                        )
                      )
                      .flatMap(variant =>
                        (variantAttributes[variant.ProductVariantID] || []).filter(
                          attr => {
                            const attrName = attr.attribute?.name?.toLowerCase();
                            return attrName === "kích thước";
                          }
                        ).map(attr => ({
                          size: attr.value,
                          variantId: variant.ProductVariantID,
                          image: variant.Image
                        }))
                      )
                  )].map((sizeObj, idx) => {
                    const isSelected = selectedVariant?.ProductVariantID === sizeObj.variantId;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={
                          "tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition tw-border " +
                          (isSelected
                            ? "tw-bg-[#009688] tw-text-white tw-border-[#009688] tw-shadow"
                            : "tw-bg-white tw-text-[#009688] tw-border-gray-300 hover:tw-bg-[#e0f2f1] hover:tw-border-[#009688]")
                        }
                        style={{
                          minWidth: 80,
                          minHeight: 40,
                          outline: isSelected ? "2px solid #009688" : "none",
                        }}
                        onClick={() => {
                          setSelectedVariant(
                            product.variants.find(v => v.ProductVariantID === sizeObj.variantId)
                          );
                          setMainImage({
                            image: sizeObj.image,
                            id: sizeObj.variantId,
                          });
                          setSelectedAttributes({ ...selectedAttributes, size: sizeObj.size });
                        }}
                      >
                        {sizeObj.size}
                      </button>
                    );
                  })}
                </div>
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

