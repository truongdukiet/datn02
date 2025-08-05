import React, { useState, useEffect, useRef } from "react";
import ClientHeader from "../../../layouts/MainLayout/ClientHeader";
import { Link, useParams, useNavigate } from "react-router-dom";
import { formatPrice } from "../../../utils/formatPrice";
import ProductItem from "../../../components/ProductItem/ProductItem";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/api";
import { getProductImageUrl } from "../../../utils/formatImage";
import { message } from "antd";

const ProductDetail = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [availableAttributeValues, setAvailableAttributeValues] = useState({});
    const [cart, setCart] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

    const noMatchingVariantRef = useRef(false);
    const navigate = useNavigate();
    const { id } = useParams();

    // Load giỏ hàng từ localStorage
    useEffect(() => {
        try {
            const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(storedCart);
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            setCart([]);
        }
    }, []);

    // Lấy thông tin sản phẩm
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
            }
            setReviews(data.reviews || []);
        },
    });

    // Lấy sản phẩm mới nhất (liên quan)
    const { data: latestProducts, isLoading: isLoadingLatest } = useQuery({
        queryKey: ["latestProducts"],
        queryFn: async () => {
            const response = await apiClient.get("/api/products");
            return response.data.data;
        },
    });

    // Cập nhật giá trị thuộc tính khả dụng
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

    // Chọn thuộc tính
    const handleAttributeSelect = (attributeId, value) => {
        const updatedAttributes = { ...selectedAttributes };

        if (selectedAttributes[attributeId] === value) {
            delete updatedAttributes[attributeId];
        } else {
            updatedAttributes[attributeId] = value;
        }
        setSelectedAttributes(updatedAttributes);

        if (product && product.variants) {
            const matchingVariant = product.variants.find((variant) => {
                const allAttributesMatch = Object.entries(updatedAttributes).every(
                    ([attrId, attrValue]) => {
                        return variant.attributes.some(
                            (attr) =>
                                attr?.attribute?.AttributeID == attrId && attr.value === attrValue
                        );
                    }
                );
                return allAttributesMatch;
            });

            if (matchingVariant) {
                setSelectedVariant(matchingVariant);
                noMatchingVariantRef.current = false;
            } else {
                setSelectedVariant(null);
                noMatchingVariantRef.current = Object.keys(updatedAttributes).length > 0;
            }
            updateAvailableAttributeValues(updatedAttributes, product.variants);
        }
    };

    // Thêm vào giỏ hàng
    const handleAddToCart = () => {
        if (!selectedVariant) {
            message.error("Vui lòng chọn phiên bản sản phẩm!");
            return;
        }

        setIsAdding(true);

        try {
            const newCartItem = {
                id: selectedVariant.ProductVariantID,
                productName: product.Name,
                variantName: Object.values(selectedAttributes).join(" / ") || "Default",
                image: selectedVariant.Image || product.Image,
                price: selectedVariant.Price,
                quantity: quantity,
            };

            // Lấy giỏ hàng từ localStorage
            const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

            // Kiểm tra sản phẩm có trong giỏ chưa
            const existingIndex = storedCart.findIndex(
                (item) => item.id === newCartItem.id
            );

            if (existingIndex > -1) {
                storedCart[existingIndex].quantity += quantity;
            } else {
                storedCart.push(newCartItem);
            }

            // Lưu giỏ hàng vào localStorage
            localStorage.setItem("cart", JSON.stringify(storedCart));

            // Trigger update cho các component khác (icon giỏ hàng)
            window.dispatchEvent(new Event("storage"));

            message.success("Đã thêm sản phẩm vào giỏ hàng!");
            navigate("/cart");
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
        } finally {
            setIsAdding(false);
        }
    };

    // Gửi đánh giá
    const handleSubmitReview = () => {
        if (!newReview.rating || !newReview.comment.trim()) {
            message.error("Vui lòng chọn số sao và nhập nội dung đánh giá!");
            return;
        }

        const newReviewItem = {
            rating: newReview.rating,
            comment: newReview.comment,
            user: "Khách hàng ẩn danh",
            date: new Date().toLocaleDateString(),
        };

        const updatedReviews = [...reviews, newReviewItem];
        setReviews(updatedReviews);
        setNewReview({ rating: 0, comment: "" });
        message.success("Gửi đánh giá thành công!");
    };

    if (isLoading)
        return (
            <>
                <ClientHeader lightMode={false} />
                <div className="tw-pt-32 tw-min-h-[calc(100vh-128px)] container tw-text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        );

    if (!product)
        return (
            <div className="tw-pt-32 container tw-text-center">Product not found</div>
        );

    return (
        <>
            <ClientHeader lightMode={false} />

            <main className="tw-pt-32 container">
                <div className="tw-grid tw-grid-cols-2 tw-gap-6">
                    {/* Ảnh sản phẩm */}
                    <div className="tw-col-span-1">
                        <div className="tw-relative tw-pt-[100%]">
                            <img
                                src={`http://localhost:8000${getProductImageUrl(product.Image)}`}
                                alt={product.Name}
                                className="tw-w-full tw-h-full tw-object-cover tw-block tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-bottom-0"
                            />
                        </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="tw-col-span-1">
                        {/* Breadcrumb */}
                        <div className="tw-flex tw-items-center tw-gap-3 tw-uppercase">
                            <Link to="/" className="tw-text-[#9E9E9E] tw-text-sm">
                                Trang chủ
                            </Link>
                            <span className="tw-text-xs tw-text-[#9e9e9e]">
                                <i className="fa-solid fa-chevron-right"></i>
                            </span>
                            <p className="tw-text-[#9E9E9E] tw-text-sm">Sản phẩm</p>
                        </div>

                        <h1 className="tw-mt-6 tw-text-[32px] tw-font-bold">{product.Name}</h1>

                        <div className="tw-flex tw-items-center tw-gap-6 tw-mt-4">
                            <p className="tw-m-0 tw-text-2xl tw-font-bold tw-text-[#99CCD0]">
                                {formatPrice(
                                    selectedVariant ? selectedVariant.Price : product.base_price
                                )}
                            </p>
                        </div>
                        <hr className="tw-my-6" />

                        {/* Mô tả */}
                        <section>
                            <p className="tw-font-semibold">Mô tả:</p>
                            <p>{product.Description || "Không có mô tả"}</p>
                        </section>
                        <hr className="tw-my-6" />

                        {/* Thuộc tính */}
                        {product?.variants && product.variants.length > 0 && (
                            <>
                                {Array.from(
                                    new Set(
                                        product.variants.flatMap((v) =>
                                            v.attributes.flatMap((a) =>
                                                a?.attribute?.AttributeID ? [a.attribute.AttributeID] : []
                                            )
                                        )
                                    )
                                ).map((attrId) => {
                                    const attributeName = product.variants
                                        .find((v) =>
                                            v.attributes.some(
                                                (a) => a?.attribute?.AttributeID === attrId
                                            )
                                        )
                                        ?.attributes.find(
                                            (a) => a?.attribute?.AttributeID === attrId
                                        )?.attribute.name;

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
                                        <section key={attrId} className="tw-mb-6">
                                            <p className="tw-font-semibold">{attributeName}:</p>
                                            <div className="tw-mt-2 tw-flex tw-gap-3">
                                                {uniqueValues.map((value, idx) => {
                                                    const isAvailable =
                                                        !availableAttributeValues[attrId] ||
                                                        availableAttributeValues[attrId].includes(value) ||
                                                        selectedAttributes[attrId] === value;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`tw-cursor-pointer tw-border tw-px-3 tw-py-1 ${
                                                                selectedAttributes[attrId] === value
                                                                    ? "tw-border-[#99CCD0]"
                                                                    : isAvailable
                                                                    ? "tw-border-[#E0E0E0]"
                                                                    : "tw-border-[#E0E0E0] tw-opacity-40 tw-bg-gray-100"
                                                            }`}
                                                            onClick={() => {
                                                                if (isAvailable)
                                                                    handleAttributeSelect(attrId, value);
                                                            }}
                                                        >
                                                            <p className="tw-m-0">{value}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    );
                                })}
                                {noMatchingVariantRef.current && (
                                    <div className="tw-text-red-500">Thuộc tính không tồn tại</div>
                                )}
                                <hr className="tw-my-6" />
                            </>
                        )}

                        {/* Số lượng và thêm giỏ */}
                        <section className="tw-flex tw-items-center">
                            <div className="tw-h-12 tw-border tw-border-[#E0E0E0] tw-flex tw-items-center">
                                {/* Nút giảm */}
                                <div
                                    className="tw-size-6 tw-flex tw-items-center tw-justify-center tw-mx-3 tw-cursor-pointer"
                                    onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                                >
                                    <i className="fa-solid fa-minus"></i>
                                </div>

                                {/* Input số lượng */}
                                <input
                                    type="number"
                                    className="tw-bg-transparent tw-border-none tw-outline-none tw-text-black tw-w-12 tw-text-center"
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val) && val > 0) {
                                            setQuantity(val);
                                        } else {
                                            setQuantity(1);
                                        }
                                    }}
                                />

                                {/* Nút tăng */}
                                <div
                                    className="tw-size-6 tw-flex tw-items-center tw-justify-center tw-mx-3 tw-cursor-pointer"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <i className="fa-solid fa-plus"></i>
                                </div>
                            </div>

                            {/* Nút thêm vào giỏ */}
                            <button
                                className={`tw-text-white tw-font-medium tw-px-4 tw-h-12 tw-uppercase tw-ml-4 tw-cursor-pointer ${
                                    noMatchingVariantRef.current || !selectedVariant
                                        ? "tw-bg-gray-400"
                                        : "tw-bg-[#99CCD0]"
                                }`}
                                onClick={handleAddToCart}
                                disabled={noMatchingVariantRef.current || !selectedVariant || isAdding}
                            >
                                {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                            </button>
                        </section>
                    </div>
                </div>

                {/* Đánh giá */}
                <section className="tw-mt-12">
                    <h2 className="tw-text-2xl tw-font-bold tw-mb-6">Đánh giá sản phẩm</h2>
                    <div className="tw-space-y-4">
                        {reviews.length > 0 ? (
                            reviews.map((r, idx) => (
                                <div
                                    key={idx}
                                    className="tw-border tw-rounded-lg tw-p-4 tw-bg-gray-50 tw-shadow-sm"
                                >
                                    <div className="tw-flex tw-items-center tw-justify-between">
                                        <p className="tw-font-semibold">{r.user}</p>
                                        <span className="tw-text-gray-500 tw-text-sm">{r.date}</span>
                                    </div>
                                    <div className="tw-flex tw-items-center tw-mt-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <i
                                                key={i}
                                                className={`fa-star tw-mr-1 ${
                                                    i < r.rating
                                                        ? "fa-solid tw-text-yellow-400"
                                                        : "fa-regular tw-text-gray-300"
                                                }`}
                                            ></i>
                                        ))}
                                    </div>
                                    <p className="tw-mt-2 tw-text-gray-700">{r.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="tw-text-gray-500">Chưa có đánh giá nào.</p>
                        )}
                    </div>

                    {/* Form thêm đánh giá */}
                    <div className="tw-mt-8 tw-border tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
                        <h3 className="tw-font-semibold tw-text-lg tw-mb-3">
                            Thêm đánh giá của bạn
                        </h3>
                        <div className="tw-flex tw-items-center tw-mb-4">
                            {Array.from({ length: 5 }).map((_, i) => {
                                const ratingValue = i + 1;
                                return (
                                    <i
                                        key={i}
                                        className={`
                                            fa-star tw-text-2xl tw-cursor-pointer tw-mr-2
                                            ${ratingValue <= newReview.rating
                                                ? "fa-solid tw-text-yellow-400"
                                                : "fa-regular tw-text-gray-400"
                                            }
                                        `}
                                        onClick={() =>
                                            setNewReview({ ...newReview, rating: ratingValue })
                                        }
                                    ></i>
                                );
                            })}
                        </div>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) =>
                                setNewReview({ ...newReview, comment: e.target.value })
                            }
                            placeholder="Viết nhận xét của bạn..."
                            className="tw-border tw-rounded tw-w-full tw-px-3 tw-py-2 tw-mb-3 tw-outline-none focus:tw-border-[#99CCD0]"
                            rows="3"
                        />
                        <button
                            onClick={handleSubmitReview}
                            className="tw-bg-[#99CCD0] tw-text-white tw-font-semibold tw-px-5 tw-py-2 tw-rounded hover:tw-bg-[#88b9bd] transition"
                        >
                            Gửi đánh giá
                        </button>
                    </div>
                </section>

                {/* Sản phẩm liên quan */}
                <section className="tw-mb-12 tw-mt-6">
                    <h2 className="tw-text-[32px] tw-font-bold tw-text-center">
                        Sản phẩm liên quan
                    </h2>
                    <div className="tw-mt-8 tw-grid tw-grid-cols-12 tw-gap-6">
                        {isLoadingLatest ? (
                            <div className="tw-col-span-12 tw-text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : latestProducts && latestProducts.length > 0 ? (
                            latestProducts
                                .filter((item) => item.ProductID !== parseInt(id))
                                .slice(0, 4)
                                .map((product) => (
                                    <div key={product.ProductID} className="tw-col-span-3">
                                        <ProductItem product={product} />
                                    </div>
                                ))
                        ) : (
                            <div className="tw-col-span-12 tw-text-center">
                                <p>Không có sản phẩm nào.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default ProductDetail;
