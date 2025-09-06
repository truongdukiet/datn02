import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/api";
import dayjs from "../../utils/dayjs";

const ProductReviews = ({ productId }) => {
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const navigate = useNavigate();
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

  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/product-reviews?product_id=${productId}`);
      console.log("Reviews data:", response.data.data);
      return response.data.data;
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const response = await apiClient.post("/api/product-reviews", {
        UserID: userId,
        ProductID: productId,
        Star_rating: reviewData.rating,
        Comment: reviewData.comment,
      });
      return response.data;
    },
    onSuccess: () => {
      message.success("Đã gửi đánh giá thành công!");
      setNewReview({ rating: 0, comment: "" });
      queryClient.invalidateQueries(["product-reviews", productId]);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi gửi đánh giá."
      );
    },
  });

  const handleSubmitReview = () => {
    if (!token || !userId) {
      message.error("Vui lòng đăng nhập để gửi đánh giá!");
      navigate("/login");
      return;
    }

    if (!newReview.rating || !newReview.comment.trim()) {
      message.error("Vui lòng chọn số sao và nhập nội dung đánh giá!");
      return;
    }

    submitReviewMutation.mutate({
      rating: newReview.rating,
      comment: newReview.comment,
    });
  };

  return (
    <section className="tw-mb-16">
      <h2 className="tw-text-2xl tw-font-bold tw-mb-8">Đánh giá sản phẩm</h2>

      {token && userId ? (
        <div className="tw-bg-gray-50 tw-p-6 tw-rounded-lg tw-mb-8">
          <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Viết đánh giá của bạn</h3>

          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
              Đánh giá:
            </label>
            <div className="tw-flex tw-gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-transition-all tw-duration-200 hover:tw-scale-110 ${
                    star <= newReview.rating
                      ? "tw-text-yellow-400 tw-drop-shadow-sm"
                      : "tw-text-gray-300 hover:tw-text-yellow-300"
                  }`}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                >
                  <i className="fas fa-star tw-text-lg"></i>
                </button>
              ))}
            </div>
          </div>

          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
              Nội dung đánh giá:
            </label>
            <textarea
              className="tw-w-full tw-p-3 tw-border tw-border-gray-300 tw-rounded-lg tw-resize-none"
              rows="4"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
          </div>

          <button
            className={`tw-px-6 tw-py-2 tw-rounded-lg tw-font-medium tw-transition ${
              submitReviewMutation.isPending
                ? "tw-bg-gray-400 tw-cursor-not-allowed"
                : "tw-bg-[#99CCD0] hover:tw-bg-[#88bbbf] tw-text-white"
            }`}
            onClick={handleSubmitReview}
            disabled={submitReviewMutation.isPending}
          >
            {submitReviewMutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      ) : (
        <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-p-6 tw-rounded-lg tw-mb-8 tw-text-center">
          <div className="tw-mb-4">
            <i className="fas fa-user-circle tw-text-4xl tw-text-blue-400 tw-mb-2"></i>
            <h3 className="tw-text-lg tw-font-semibold tw-text-blue-800 tw-mb-2">
              Đăng nhập để viết đánh giá
            </h3>
            <p className="tw-text-blue-600 tw-mb-4">
              Bạn cần đăng nhập tài khoản để có thể chia sẻ đánh giá về sản phẩm này.
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="tw-px-6 tw-py-2 tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-rounded-lg tw-font-medium tw-transition"
          >
            Đăng nhập ngay
          </button>
        </div>
      )}

      <div>
        <h3 className="tw-text-lg tw-font-semibold tw-mb-4">
          Đánh giá từ khách hàng ({reviews.length})
        </h3>
        
        {isLoadingReviews ? (
          <div className="tw-flex tw-justify-center tw-py-8">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="tw-space-y-4">
            {reviews.map((review) => (
              <div key={review.ReviewID} className="tw-border tw-border-gray-200 tw-rounded-lg tw-p-4">
                <div className="tw-flex tw-items-start tw-gap-4">
                  <div className="tw-flex-shrink-0">
                    <div className="tw-w-10 tw-h-10 tw-bg-[#99CCD0] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-white tw-font-medium tw-text-sm">
                      {(review.user?.Fullname || review.user?.Username || "Khách hàng").charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="tw-flex-1">
                    <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                      <div className="tw-flex tw-items-center tw-gap-3">
                        <span className="tw-font-medium tw-text-gray-900">
                          {review.user?.Fullname || review.user?.Username || "Khách hàng"}
                        </span>
                        <div className="tw-flex tw-gap-1">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star tw-text-sm ${
                                i < review.Star_rating ? "tw-text-yellow-400" : "tw-text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="tw-text-sm tw-text-gray-500">
                        {dayjs(review.Create_at).fromNow()}
                      </span>
                    </div>
                    <p className="tw-text-gray-700 tw-leading-relaxed">{review.Comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="tw-text-center tw-py-8">
            <p className="tw-text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
