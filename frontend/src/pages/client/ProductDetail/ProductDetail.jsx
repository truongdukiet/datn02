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
  const [inputQuantity, setInputQuantity] = useState("1");
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isCheckingStock, setIsCheckingStock] = useState(false);

  const noMatchingVariantRef = useRef(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

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

const { data: cart } = useQuery({
  queryKey: ["cart"],
  queryFn: async () => {
    try {
      const response = await apiClient.get("/api/carts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Lấy mảng cart_items từ response
      return response.data.cart_items || [];
    } catch (error) {
      console.error("Error fetching cart:", error);
      return [];
    }
  },
  enabled: !!token,
});

// Sửa các query khác để đảm bảo không trả về undefined
const { data: product, isLoading } = useQuery({
  queryKey: ["product", id],
  queryFn: async () => {
    try {
      const response = await apiClient.get(`/api/products/detail/${id}`);
      return response.data.data || {}; // Đảm bảo luôn trả về object
    } catch (error) {
      console.error("Error fetching product:", error);
      return {}; // Trả về object rỗng nếu có lỗi
    }
  },
  onSuccess: (data) => {
    if (data?.variants && data.variants.length > 0) {
      // ... (giữ nguyên logic cũ)
    } else if (data) {
      // Xử lý khi có data nhưng không có variants
      setSelectedVariant(null);
      setMainImage({ image: data.Image, id: 0 });
      setThumbnailImages([]);
    }
  },
});

const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery({
  queryKey: ["relatedProducts"],
  queryFn: async () => {
    try {
      const response = await apiClient.get("/api/products");
      return response.data.data || []; // Đảm bảo luôn trả về mảng
    } catch (error) {
      console.error("Error fetching related products:", error);
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  },
});


  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => favoriteApi.getFavorites(userId),
    enabled: !!userId,
    select: (data) => data?.data || [],
  });


  const isFavorite =
    selectedVariant &&
    Array.isArray(favorites) &&
    favorites.some(
      (fav) =>
        fav?.ProductVariantID === selectedVariant?.ProductVariantID ||
        fav?.productVariant?.ProductVariantID === selectedVariant?.ProductVariantID
    );



  const addToCartMutation = useMutation({
    mutationFn: async ({ variantId, quantity }) => {
      setIsCheckingStock(true);
      try {
        const stockCheckResponse = await apiClient.get(`/api/check-stock/${variantId}?quantity=${quantity}`);
        
        if (!stockCheckResponse.data.success) {
          throw new Error(stockCheckResponse.data.message || "Không đủ tồn kho");
        }
        
        const response = await apiClient.post("/api/carts", {
          ProductVariantID: variantId,
          Quantity: quantity,
        });
        return response.data;
      } finally {
        setIsCheckingStock(false);
      }
    },
    onSuccess: (data) => {
      message.success(data.message || "Đã thêm sản phẩm vào giỏ hàng!");
      setQuantity(1);
      setInputQuantity("1");
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng."
      );
    },
  });

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

  useEffect(() => {
    const fetchAllVariantAttributes = async (variants = []) => {
      const attributesMap = {};
      await Promise.all(
        variants.map(async (variant) => {
          try {
            const res = await axios.get(
              `http://localhost:8000/api/variant-attributes?variant_id=${variant.ProductVariantID}`
            );
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

 useEffect(() => {
  if (selectedVariant && cart) {
    const cartItem = cart.find(
      (item) => item.ProductVariantID == selectedVariant.ProductVariantID
    );
    console.log("Cart item found:", cartItem);
    setCartQuantity(cartItem ? cartItem.Quantity : 0);
  } else {
    setCartQuantity(0);
  }
}, [selectedVariant, cart]);

  const getMaxQuantity = () => {
    if (!selectedVariant) return 0;
    const max = selectedVariant.Stock - cartQuantity;
    console.log("Max quantity calculatd:", max);
    return Math.max(0, max);
  };

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

        setMainImage({
          image: matchingVariant.Image,
          id: matchingVariant.ProductVariantID,
        });

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

const handleQuantityInputChange = (e) => {
  const value = e.target.value;
  
  // Chỉ cho phép nhập số
  if (!/^\d*$/.test(value)) return;
  
  // Giới hạn độ dài để tránh nhập số quá lớn
  if (value.length > 2) return; // Giả sử số lượng tối đa là 2 chữ số (99)
  
  setInputQuantity(value);
  
  // Nếu giá trị không rỗng, cập nhật quantity
  if (value !== "") {
    const numValue = parseInt(value, 10);
    const maxQuantity = getMaxQuantity();
    
    // Ép kiểu: không cho phép nhập vượt quá maxQuantity
    if (numValue > maxQuantity) {
      setQuantity(maxQuantity);
      setInputQuantity(maxQuantity.toString());
      message.info(`Bạn chỉ có thể thêm tối đa ${maxQuantity} sản phẩm`);
    } else if (numValue < 1) {
      setQuantity(1);
      setInputQuantity("1");
    } else {
      setQuantity(numValue);
    }
  }
};

  const handleAddToCart = async () => {
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

    if (variantToAdd.Stock <= 0) {
      message.error("Sản phẩm này đã hết hàng!");
      return;
    }

    const maxQuantity = getMaxQuantity();
    if (quantity > maxQuantity) {
      message.error(`Chỉ có thể thêm tối đa ${maxQuantity} sản phẩm vào giỏ hàng!`);
      return;
    }

    if (maxQuantity <= 0) {
      message.error("Không thể thêm sản phẩm vào giỏ hàng. Số lượng trong giỏ đã đạt tối đa.");
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        variantId: variantToAdd.ProductVariantID,
        quantity: quantity,
      });
    } catch (error) {
      if (error.response?.status === 422) {
        const maxAdditional = error.response.data.max_additional;
        message.error(error.response.data.message);
        
        if (maxAdditional > 0) {
          setQuantity(maxAdditional);
          setInputQuantity(maxAdditional.toString());
        } else {
          setQuantity(0);
          setInputQuantity("0");
        }
      } else {
        message.error(
          error.response?.data?.message || 
          error.message || 
          "Có lỗi xảy ra khi thêm vào giỏ hàng."
        );
      }
    }
  };

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

  const handleClickThumbnail = (clickedImage) => {
    setMainImage(clickedImage);
  };

  const handleIncrement = () => {
    const maxQuantity = getMaxQuantity();
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      setInputQuantity(newQuantity.toString());
    } else {
      message.info(`Bạn chỉ có thể thêm tối đa ${maxQuantity} sản phẩm`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setInputQuantity(newQuantity.toString());
    }
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

  const maxQuantity = getMaxQuantity();

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

            {/* Hiển thị tồn kho */}
            {selectedVariant && (
              <div className="tw-mb-4">
                <p className="tw-text-sm tw-text-gray-600">
                  Tồn kho: {selectedVariant.Stock} sản phẩm
                </p>
                {selectedVariant.Stock <= 0 && (
                  <p className="tw-text-red-500 tw-font-medium">Sản phẩm đã hết hàng</p>
                )}
                {maxQuantity <= 0 && selectedVariant.Stock > 0 && (
                  <p className="tw-text-red-500 tw-font-medium">Đã đạt giới hạn số lượng trong giỏ hàng</p>
                )}
              </div>
            )}

            <div className="tw-mb-8">
              <p className="tw-font-semibold tw-mb-2">Mô tả:</p>
              <p className="tw-text-gray-700">
                {product.Description || "Sản phẩm chưa có mô tả chi tiết."}
              </p>
            </div>

            {/* Thuộc tính sản phẩm */}
            {product?.variants && product.variants.length > 0 && (
              <div className="tw-mb-8">
                {["color", "size"].map((attrKey, idx) => {
                  const attrObj = Object.values(variantAttributes)
                    .flat()
                    .find((a) => a.name?.toLowerCase() === attrKey);
                  if (!attrObj) return null;
                  const attrId = attrObj.AttributeID;

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

            {/* Chọn màu sắc */}
            <div className="tw-mb-5">
              <p className="tw-font-semibold tw-mb-2">Chọn màu sắc:</p>
              <div className="tw-flex tw-flex-wrap tw-gap-2">
                {[...new Set(
                  product.variants
                    .flatMap(v => (variantAttributes[v.ProductVariantID] || []))
                    .filter(attr => {
                      const attrName = attr.attribute?.name?.toLowerCase();
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
                          image: variant.Image,
                          stock: variant.Stock
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
                          const variant = product.variants.find(v => v.ProductVariantID === sizeObj.variantId);
                          setSelectedVariant(variant);
                          setMainImage({
                            image: sizeObj.image,
                            id: sizeObj.variantId,
                          });
                          setSelectedAttributes({ ...selectedAttributes, size: sizeObj.size });
                          
                          const maxQty = Math.max(0, variant.Stock - cartQuantity);
                          if (quantity > maxQty) {
                            setQuantity(maxQty);
                            setInputQuantity(maxQty.toString());
                          }
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
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || maxQuantity <= 0}
                  >
                    -
                  </button>
                  <input
                  type="text"
                  className="tw-px-4 tw-py-2 tw-w-12 tw-text-center tw-border-0 focus:tw-outline-none"
                  value={inputQuantity}
                  onChange={handleQuantityInputChange}
                  onBlur={() => {
                    // Khi rời khỏi ô input, đảm bảo giá trị hợp lệ
                    if (inputQuantity === "" || parseInt(inputQuantity, 10) < 1) {
                      setQuantity(1);
                      setInputQuantity("1");
                    } else {
                      const numValue = parseInt(inputQuantity, 10);
                      const maxQuantity = getMaxQuantity();
                      
                      // Ép kiểu: không cho phép vượt quá maxQuantity
                      if (numValue > maxQuantity) {
                        setQuantity(maxQuantity);
                        setInputQuantity(maxQuantity.toString());
                        message.info(`Bạn chỉ có thể thêm tối đa ${maxQuantity} sản phẩm`);
                      }
                    }
                  }}
                  disabled={maxQuantity <= 0}
                  max={maxQuantity} // Thuộc tính HTML max để hỗ trợ ép kiểu
                />
                  <button
                    className="tw-px-4 tw-py-2 tw-text-lg disabled:tw-opacity-50"
                    onClick={handleIncrement}
                    disabled={quantity >= maxQuantity || maxQuantity <= 0}
                  >
                    +
                  </button>
                </div>
                {/* Hiển thị thông tin số lượng tối đa có thể thêm */}
              </div>

              <button
                className={`tw-px-8 tw-py-3 tw-rounded-lg tw-font-medium tw-transition ${
                  (!selectedVariant && !product?.variants?.length) ||
                  addToCartMutation.isPending ||
                  isCheckingStock ||
                  (selectedVariant && selectedVariant.Stock <= 0) ||
                  maxQuantity <= 0 ||
                  quantity <= 0
                    ? "tw-bg-gray-400 tw-cursor-not-allowed"
                    : "tw-bg-[#99CCD0] hover:tw-bg-[#88bbbf] tw-text-white"
                }`}
                onClick={handleAddToCart}
                disabled={
                  (!selectedVariant && !product?.variants?.length) ||
                  addToCartMutation.isPending ||
                  isCheckingStock ||
                  (selectedVariant && selectedVariant.Stock <= 0) ||
                  maxQuantity <= 0 ||
                  quantity <= 0
                }
              >
                {addToCartMutation.isPending || isCheckingStock ? (
                  <span className="tw-flex tw-items-center">
                    <i className="fas fa-spinner fa-spin tw-mr-2"></i>
                    Đang thêm...
                  </span>
                ) : selectedVariant && selectedVariant.Stock <= 0 ? (
                  "Hết hàng"
                ) : maxQuantity <= 0 ? (
                  "Không thể thêm"
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