-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 24, 2025 lúc 05:07 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `datn`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attributes`
--

CREATE TABLE `attributes` (
  `AttributeID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `attributes`
--

INSERT INTO `attributes` (`AttributeID`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Màu sắc', '2025-07-01 15:43:13', '2025-07-01 15:43:13'),
(2, 'Kích thước', '2025-07-01 15:43:13', '2025-07-01 15:43:13');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `carts`
--

CREATE TABLE `carts` (
  `CartID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'active',
  `Create_at` datetime DEFAULT NULL,
  `Update_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `CartItemID` int(11) NOT NULL,
  `CartID` int(11) DEFAULT NULL,
  `ProductVariantID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Create_at` datetime DEFAULT NULL,
  `Update_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `CategoryID` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Image` varchar(255) NOT NULL,
  `Create_at` datetime DEFAULT NULL,
  `Update_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`CategoryID`, `Name`, `Description`, `Image`, `Create_at`, `Update_at`) VALUES
(1, 'Bàn ăn cao cấp', 'Các loại bàn ăn chất lượng cao, thiết kế hiện đại.', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(2, 'Ghế', 'Các loại ghế ăn, ghế sofa, ghế gỗ tự nhiên', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(3, 'Sofa', 'Sofa da, sofa vải, sofa gỗ', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(4, 'Tủ bếp', 'Tủ bếp hiện đại, tủ bếp gỗ', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(5, 'Tủ giày', 'Tủ giày gỗ, tủ giày thông minh', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(6, 'Tủ quần áo', 'Tủ quần áo gỗ, tủ quần áo nhiều ngăn', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(7, 'Kệ tivi', 'Kệ tivi phòng khách', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(8, 'Giường ngủ', 'Giường ngủ gỗ tự nhiên, giường ngủ hiện đại', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(9, 'Nệm', 'Nệm cao su, nệm lò xo, nệm mousse', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(10, 'Combo bàn ăn', 'Combo bàn ăn và ghế', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(11, 'Combo sofa', 'Combo sofa phòng khách', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(12, 'Gương - Ngủ', 'Gương phòng ngủ, gương trang trí', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(13, 'Thảm lông', 'Các loại thảm.', '', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favorite_products`
--

CREATE TABLE `favorite_products` (
  `FavoriteProductID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `ProductVariantID` int(11) DEFAULT NULL,
  `Create_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

CREATE TABLE `messages` (
  `MessageID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Message` text NOT NULL,
  `Image` varchar(255) NOT NULL,
  `Create_at` date NOT NULL DEFAULT current_timestamp(),
  `FromUser` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(4, '2025_05_29_154550_create_personal_access_tokens_table', 1),
(5, '0001_01_01_000002_create_jobs_table', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `news`
--

INSERT INTO `news` (`id`, `title`, `slug`, `content`, `image`, `author_id`, `status`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'Thiết kế nội thất hiện đại cho căn hộ nhỏ', 'thiet-ke-noi-that-hien-dai-cho-can-ho-nho', 'Nội dung bài viết về thiết kế nội thất hiện đại cho căn hộ nhỏ...', '/images/img_1.jpg', 1, 'published', '2025-07-08 10:00:00', '2025-07-22 16:32:48', '2025-07-22 17:47:35'),
(2, 'Xu hướng màu sắc nội thất năm 2025', 'xu-huong-mau-sac-noi-that-nam-2025', 'Nội dung bài viết về xu hướng màu sắc nội thất năm 2025...', '/images/img_2.jpg', 1, 'published', '2025-07-08 11:00:00', '2025-07-22 16:32:48', '2025-07-22 17:47:46'),
(3, 'Bí quyết chọn sofa phù hợp cho phòng khách', 'bi-quyet-chon-sofa-phu-hop-cho-phong-khach', 'Nội dung bài viết về bí quyết chọn sofa phù hợp...', '/images/img_3.jpg', 1, 'published', '2025-07-08 12:00:00', '2025-07-22 16:32:48', '2025-07-22 17:47:49'),
(4, 'Tối ưu hóa không gian với nội thất thông minh', 'toi-uu-hoa-khong-gian-voi-noi-that-thong-minh', 'Nội dung bài viết về tối ưu hóa không gian...', '/images/img_4.jpg', 1, 'published', '2025-07-08 13:00:00', '2025-07-22 16:32:48', '2025-07-22 17:48:01'),
(5, 'Phong cách Scandinavian trong thiết kế nội thất', 'phong-cach-scandinavian-trong-thiet-ke-noi-that', 'Nội dung bài viết về phong cách Scandinavian...', '/images/img_5.jpg', 1, 'published', '2025-07-08 14:00:00', '2025-07-22 16:32:48', '2025-07-22 17:48:04');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `NotificationID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Message` text NOT NULL,
  `IsRead` tinyint(4) NOT NULL DEFAULT 0,
  `Create_at` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderdetail`
--

CREATE TABLE `orderdetail` (
  `OrderDetailID` int(11) NOT NULL,
  `OrderID` int(11) DEFAULT NULL,
  `ProductVariantID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Unit_price` decimal(10,0) DEFAULT NULL,
  `Subtotal` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orderdetail`
--

INSERT INTO `orderdetail` (`OrderDetailID`, `OrderID`, `ProductVariantID`, `Quantity`, `Unit_price`, `Subtotal`) VALUES
(1, NULL, NULL, NULL, NULL, NULL),
(2, NULL, NULL, NULL, NULL, NULL),
(3, 5, 5, 2, 6000000, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `OrderID` int(11) NOT NULL,
  `InvoiceCode` varchar(50) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `VoucherID` int(11) DEFAULT NULL,
  `PaymentID` int(11) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `Total_amount` decimal(10,0) DEFAULT NULL,
  `Receiver_name` varchar(255) DEFAULT NULL,
  `Receiver_phone` varchar(255) DEFAULT NULL,
  `Shipping_address` text DEFAULT NULL,
  `Create_at` datetime DEFAULT NULL,
  `Update_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`OrderID`, `InvoiceCode`, `UserID`, `VoucherID`, `PaymentID`, `Status`, `Total_amount`, `Receiver_name`, `Receiver_phone`, `Shipping_address`, `Create_at`, `Update_at`) VALUES
(1, NULL, NULL, NULL, NULL, 'completed', 15000000, 'Nguyen Van B', '0987654321', '456 Đường XYZ', '2025-07-01 18:34:13', '2025-07-05 17:24:18'),
(2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-01 18:35:53', '2025-07-01 18:35:53'),
(3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-01 18:40:05', '2025-07-01 18:40:05'),
(4, NULL, NULL, NULL, NULL, NULL, 11500000, NULL, NULL, NULL, '2025-07-01 18:41:39', '2025-07-01 18:41:39'),
(5, NULL, 1, 2, 2, 'pending', 12000000, 'Nguyen Van A', '0123456789', '123 Đường ABC', '2025-07-05 17:22:46', '2025-07-05 17:22:46');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('blackrabitxx@gmail.com', 'pBRWO6CKb7CaX6cI6o4nvzkkUjU9cLFqwfncPvzpCOU5gpO8B4jdOmVo37FG', '2025-07-12 11:11:27');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_gateway`
--

CREATE TABLE `payment_gateway` (
  `PaymentID` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_gateway`
--

INSERT INTO `payment_gateway` (`PaymentID`, `Name`) VALUES
(2, 'COD'),
(3, 'Ví điện tử Momo'),
(4, 'Thẻ tín dụng/ghi nợ'),
(5, 'Thanh toán khi nhận hàng'),
(6, 'Ví điện tử ZaloPay');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 14, 'auth_token', '7992bcc9bfe8a0a746334fb85a14c0cba3136ca58ff54524c30c9dd901e2e39d', '[\"*\"]', NULL, NULL, '2025-07-07 08:43:33', '2025-07-07 08:43:33'),
(2, 'App\\Models\\User', 14, 'auth_token', '6183cc3393071d2d735fffb91c502a62974e6731685e3203d4d27150dd7f81b7', '[\"*\"]', NULL, NULL, '2025-07-11 09:17:51', '2025-07-11 09:17:51'),
(3, 'App\\Models\\User', 1, 'auth_token', 'db6d35aa0af2d9be26d247b9ada04e4e94a4fe5d3839a099228ab9b8d550936e', '[\"*\"]', NULL, NULL, '2025-07-13 03:06:25', '2025-07-13 03:06:25'),
(4, 'App\\Models\\User', 23, 'auth_token', '56e8bbde86bd99d23b1360f19b1ad128517de98b824d9afa21a385374ea022ff', '[\"*\"]', NULL, NULL, '2025-07-13 04:17:54', '2025-07-13 04:17:54'),
(5, 'App\\Models\\User', 24, 'auth_token', '74df7f18a40326b28f2556aa476ec6c82a970576c948568b85148e96b1a6ad63', '[\"*\"]', NULL, NULL, '2025-07-13 04:18:44', '2025-07-13 04:18:44'),
(6, 'App\\Models\\User', 1, 'auth_token', '3a534acc3abcf9e534dac55d7edeba570f4271828173d555faa4cbbc81cdd137', '[\"*\"]', NULL, NULL, '2025-07-13 06:21:04', '2025-07-13 06:21:04'),
(7, 'App\\Models\\User', 1, 'auth_token', 'd56b5c36a75e33233ac5ea042affcf9b8d9c955fb613ddcb3584c161c2753023', '[\"*\"]', NULL, NULL, '2025-07-13 06:34:27', '2025-07-13 06:34:27'),
(8, 'App\\Models\\User', 1, 'auth_token', 'ccb16a59b83625892dbf5ac5d8b556526c5cb96bf8fba831681676d2d769cd4a', '[\"*\"]', NULL, NULL, '2025-07-13 06:40:52', '2025-07-13 06:40:52'),
(9, 'App\\Models\\User', 1, 'auth_token', 'bb0fc3bedebaa26d173c706921ef183daad7503ea6b878c02111ddd9a417ff25', '[\"*\"]', NULL, NULL, '2025-07-13 06:43:57', '2025-07-13 06:43:57'),
(10, 'App\\Models\\User', 1, 'auth_token', '190a4c87dddf4605c99f7282860d1af78537a5f6d81b2f2856d409dc24980e47', '[\"*\"]', NULL, NULL, '2025-07-13 06:46:04', '2025-07-13 06:46:04'),
(11, 'App\\Models\\User', 1, 'auth_token', 'ab01720e4f155baf8b0245b8e393e44283e32d253d0e6ed3619960e8eac3faac', '[\"*\"]', NULL, NULL, '2025-07-13 06:50:26', '2025-07-13 06:50:26'),
(12, 'App\\Models\\User', 24, 'auth_token', '6dd00a04f38a9f947cf67c665ccf95efedf51c1e29c2a05893905edcaf2b5abc', '[\"*\"]', NULL, NULL, '2025-07-13 07:09:37', '2025-07-13 07:09:37'),
(13, 'App\\Models\\User', 1, 'auth_token', '1a8bc95bdf20a5c915022d280019f9baead06790be2761dda456fc3719f0c5ff', '[\"*\"]', NULL, NULL, '2025-07-13 07:09:49', '2025-07-13 07:09:49'),
(14, 'App\\Models\\User', 26, 'auth_token', '104f0dd7128a7192d1d5ace846214977fefac155e3f0608860428d4c8f7b66a3', '[\"*\"]', NULL, NULL, '2025-07-13 07:28:32', '2025-07-13 07:28:32'),
(15, 'App\\Models\\User', 1, 'auth_token', 'f51d06e73da86a2771dd236bdd85c2cbe1c95b4757c608fca8bc012ac6aa7769', '[\"*\"]', NULL, NULL, '2025-07-13 07:29:15', '2025-07-13 07:29:15'),
(16, 'App\\Models\\User', 26, 'auth_token', '68dfec399a642342ce2792c8afa6a58133a7e35d4f710f04283e8c47bd8e38b9', '[\"*\"]', NULL, NULL, '2025-07-14 08:52:07', '2025-07-14 08:52:07'),
(17, 'App\\Models\\User', 1, 'auth_token', '983830f28007b6d571f2554ca554c4af71147d1fb53d869772158f09131a0a09', '[\"*\"]', NULL, NULL, '2025-07-15 07:10:49', '2025-07-15 07:10:49'),
(18, 'App\\Models\\User', 1, 'auth_token', '36172f52321cef19da447fa5200861b7d8aeb10af5c151bf158d7e2a4fed52d5', '[\"*\"]', NULL, NULL, '2025-07-23 07:19:05', '2025-07-23 07:19:05');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL,
  `CategoryID` int(11) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Image` text DEFAULT NULL,
  `base_price` decimal(20,0) NOT NULL,
  `Status` tinyint(1) DEFAULT NULL,
  `Create_at` datetime DEFAULT NULL,
  `Update_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`ProductID`, `CategoryID`, `Name`, `Description`, `Image`, `base_price`, `Status`, `Create_at`, `Update_at`) VALUES
(1, 1, 'Sofa gỗ cao su cập nhật', 'Mô tả mới', 'Ban-an-Go-Cao-Su-MOHO-OSLO01.png', 6000000, 1, '2025-07-01 22:42:19', '2025-07-11 16:59:03'),
(2, 1, 'Bàn ăn Gỗ MOHO GRENAA01', 'Bàn ăn gỗ tự nhiên, phong cách Bắc Âu', 'Ban-an-Go-MOHO-GRENAA01.png', 4200000, 1, '2025-07-01 22:42:19', '2025-07-01 22:42:19'),
(3, 2, 'Ghế ăn Gỗ Cao Su Tự Nhiên Milan01', 'Ghế ăn gỗ cao su tự nhiên, kiểu dáng Milan', 'Ghe-an-Go-Cao-Su-Tu-Nhien-milan01.png', 900000, 1, '2025-07-01 22:42:19', '2025-07-01 22:42:19'),
(4, 3, 'Sofa Da RIGA 2m', 'Sofa da cao cấp, dài 2m, phù hợp phòng khách hiện đại', 'Ghe-Sofa-Da-RIGA-2m.png', 7500000, 1, '2025-07-01 22:42:19', '2025-07-01 22:42:19'),
(5, 4, 'Tủ bếp Kitchen Premium Narvik01', 'Tủ bếp gỗ cao cấp, thiết kế hiện đại', 'Kitchen-Premium-Narvik01.png', 12000000, 1, '2025-07-01 22:42:19', '2025-07-01 22:42:19'),
(6, 1, 'Sofa gỗ cao su', 'Sofa đẹp', NULL, 5000000, 1, '2025-07-05 15:34:44', '2025-07-05 15:34:44'),
(7, 1, 'Sofa gỗ cao su', 'Sofa đẹp', NULL, 5000000, 1, '2025-07-05 15:36:27', '2025-07-05 15:36:27'),
(8, 1, 'Sofa gỗ cao su', 'Sofa đẹp', NULL, 5000000, 1, '2025-07-05 15:38:32', '2025-07-05 15:38:32'),
(9, 1, 'Sofa gỗ cao su', 'Sofa đẹp', NULL, 5000000, 1, '2025-07-05 15:39:15', '2025-07-05 15:39:15'),
(10, 1, 'Sofa gỗ cao su', 'Sofa đẹp', NULL, 5000000, 1, '2025-07-05 15:46:42', '2025-07-05 15:46:42'),
(11, 1, 'Sofa gỗ cao su', 'Sofa đẹp', NULL, 5000000, 1, '2025-07-05 15:47:53', '2025-07-05 15:47:53'),
(12, 1, 'Sofa gỗ cao su', 'Sofa đẹp', NULL, 5000000, 1, '2025-07-05 15:51:37', '2025-07-05 15:51:37'),
(13, 1, 'Sofa gỗ cao su', 'Sofa đẹp', NULL, 5000000, 1, '2025-07-05 15:53:50', '2025-07-05 15:53:50'),
(14, 1, 'Sofa gỗ cao su', 'Sofa đẹp', NULL, 5000000, 1, '2025-07-05 15:54:19', '2025-07-05 15:54:19'),
(15, 1, 'Sofa gỗ cao su', 'Sofa đẹp', NULL, 5000000, 1, '2025-07-05 17:03:30', '2025-07-05 17:03:30'),
(16, 1, 'Sofa gỗ cao su', 'Sofa đẹp', NULL, 5000000, 1, '2025-07-11 16:57:16', '2025-07-11 16:57:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productvariants`
--

CREATE TABLE `productvariants` (
  `ProductVariantID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Sku` varchar(255) NOT NULL,
  `Price` int(20) NOT NULL,
  `Stock` int(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `Update_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `productvariants`
--

INSERT INTO `productvariants` (`ProductVariantID`, `ProductID`, `Sku`, `Price`, `Stock`, `created_at`, `Update_at`) VALUES
(3, 2, '20001', 4300000, 8, '2025-07-01 22:42:30', '2025-07-01 22:42:30'),
(4, 2, '20002', 4400000, 6, '2025-07-01 22:42:30', '2025-07-01 22:42:30'),
(5, 3, '30001', 950000, 15, '2025-07-01 22:42:30', '2025-07-01 22:42:30'),
(6, 3, '30002', 970000, 10, '2025-07-01 22:42:30', '2025-07-01 22:42:30'),
(7, 4, '40001', 7600000, 4, '2025-07-01 22:42:30', '2025-07-01 22:42:30'),
(8, 4, '40002', 7700000, 3, '2025-07-01 22:42:30', '2025-07-01 22:42:30'),
(9, 5, '50001', 12100000, 2, '2025-07-01 22:42:30', '2025-07-01 22:42:30'),
(10, 5, '50002', 12200000, 1, '2025-07-01 22:42:30', '2025-07-01 22:42:30'),
(11, 10, 'SKU-686948e23c737', 5000000, 10, '2025-07-05 22:46:42', '2025-07-05 15:46:42'),
(12, 11, 'SKU-68694929e17cd', 5000000, 10, '2025-07-05 22:47:53', '2025-07-05 15:47:53'),
(13, 12, 'SKU-68694a09c9a83', 5000000, 10, '2025-07-05 22:51:37', '2025-07-05 15:51:37'),
(14, 13, 'SKU-68694a8e75e43', 5000000, 10, '2025-07-05 22:53:50', '2025-07-05 15:53:50'),
(15, 14, 'SKU-68694aabcbd84', 5000000, 10, '2025-07-05 22:54:19', '2025-07-05 15:54:19'),
(17, 15, 'SKU-68695ae2e9d4d', 5000000, 10, '2025-07-06 00:03:30', '2025-07-05 17:03:30'),
(18, 16, 'SKU-6871426cdcd80', 5000000, 10, '2025-07-11 23:57:16', '2025-07-11 16:57:16'),
(19, 1, 'SKU-687142d72f68f', 6000000, 15, '2025-07-11 23:59:03', '2025-07-11 16:59:03');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `review`
--

CREATE TABLE `review` (
  `ReviewID` int(11) NOT NULL,
  `OrderDetailID` int(11) DEFAULT NULL,
  `ProductVariantID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `Star_rating` int(11) DEFAULT NULL,
  `Comment` text DEFAULT NULL,
  `Image` varchar(255) NOT NULL,
  `Create_at` datetime DEFAULT NULL,
  `Status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('15bcyycLjhrB2UiRlaILtFPWpcmhe3H9rhoVM92e', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT0ZBSktyMnhHZ2FpclNJTUEyakpCRk9QdDBQcU5ZbEFzNzY1QW1DMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Nzg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cy9waG9uZy1jYWNoLXNjYW5kaW5hdmlhbi10cm9uZy10aGlldC1rZS1ub2ktdGhhdCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753207443),
('1wF8bd8bS3uPFsHjdnNxYEDBcrjEhZtMa2SzCXEG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZmk3TE5ET1hIZmRFc0JON2d3cXAzbmtmaXpDTGZiV0YwYm1LZWxibyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Nzg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cy9waG9uZy1jYWNoLXNjYW5kaW5hdmlhbi10cm9uZy10aGlldC1rZS1ub2ktdGhhdCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753207655),
('4dJye6Q3U8svcz7pwpHBdu0BvRw9qUJfgXR3s13K', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUlFQWURhU0xLaXlTV0RrTjhabmVaSU5kU0ZoMjU2Nlc5b1hobWJRaSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753206224),
('4F0tguM8MxqsJcm62IACFvJILQR2bvgjngXB7R9E', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRG4wYWRVT0RXYnRmTVptZm1mRlB3SloxVDJRbGRmelJXamRRVHEyNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753283786),
('4p6Ic9s40OK7YSbzj08KaQzdZ5jWhRPJqnqTAxXZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidnA0blZyVlVES3dRMUg0TXFINkVCMWxldGxEZm5xN2Z6aFRBREMzMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753283436),
('4UkPaJrUHltEVT8SfQ77xEL3H5BE4534ZWlzau2g', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ2JXc3hvSkFWTHFOMDJvNGF4Nlkzc1VDRWd0eEFXT3Y1c3R5QTlVbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NzY6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cy90b2ktdXUtaG9hLWtob25nLWdpYW4tdm9pLW5vaS10aGF0LXRob25nLW1pbmgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1753205370),
('4wwSQJ3QrhhN57SwhEtYC5Vu3xUkSq2AScA68E3E', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZGtFRGtTVkNkekdFeWRTYXRaeGhFWkM4TmE4ZjJVNVR4blJCVHpuZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753283852),
('6trQ0Fvv9Q53Gq47cjHNFPVX3YIA8k9nGDnDeOmy', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNGJOaEZxR0sxNmxXblNGZ3FGOFhTQUlQZUo5SzBtOXdyYmEzTUFHTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753280881),
('7r5ut7ZCiZDXEclpNxvHFPgoFezyEFiJ91mqvqMB', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU3p1VEVENWVjcWF1RlowZnNnbFFuSXdXbEF0QnA1V1huNE8zb0VvcyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753368315),
('8H1H77syHfJqvs4tPjhtMm1Fyo8PH7ZViwJBPsR7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ1I2M3NvUjQ1Qjh2cGtzakx1UVhlWm9yTzR6Y29SS2JSbmNPR0tzYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753206712),
('8stQCka3SRsIdfql16t2bpfpx2VGMmp2KVNGkurj', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieXZubjV3cHlKbFNNZTB2T2tXQlJ2YU1sMlFUMGpnb0N2S1BJMEVFQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753206397),
('AUSMBvmgSyl50g10HkEeMPYbqGoMwDVimqvTCVMf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVkVIcDJLYWFmZ3dFb3hQQU13dmFoNjVxeVhTdXJNbHVxMkhMeXJWeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753368319),
('BYRNOz2zeIdwLnyL7rGt8s23RnCfqrkBxSp1f3UP', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieGxrOGc2TU16Ynh2aUhWZDQ1cVV3bGlma1BhbzNEd0J5YWo2alB6ZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753203679),
('cdJGpgo53OTunqFbnAFzAk1Ev1R8v0hfOLM3lh6Z', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMjlIWDRpaEZ3aFZxQ3FkVTlLTml0SjlXbkJtRHdQb0puUTJIeE5IdCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753280315),
('cKT3yesrSAxMj8oUJkY4nqPes8NTdxaE8MTyzN5e', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidFc1MUc5Vm1ETktWV2tmMngxdkVBZlVjd3lLNHFkeVhxOTVKSzc3ZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753285034),
('d8YkoqMf2OJSN2KLhFIXKAJF1zzRrpF2xRD5izMh', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQnBDbHZqQXlSMDVXT1VMaFNmY0JLVWJGZGtKRDY2U0NKY3JXVnp5diI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753285180),
('Ea3pSCkTiCe8pgV2dzLb5hfCTfJ3WcRG3fP1jPdB', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVjBhS0NRV2o1RGFySkdrNnRXY1NZbUFva0FHS3MyNlJJaHpHQjIwViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753207439),
('Eit9cACewnCVwjAg4mT59ujz6E6fbR6XIGKzO962', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNVNKT2dIanBOYk9KTTZaSWVXY2ZnY2JnaHh2a1M0RGtrQXNiNGpzVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753207670),
('ep9yREog00etwdGjNhD6sBmCOPGZcuN3Alx1LvwH', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiamNmR3Q1RkFGek5FZ2ZmRWZOcms1Uzc5NVB2bWlEbUlPdW5JU2VBNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753206493),
('EUZm99Fap9B2Ij8EThdpS0YrvSdDovTHgvhDSHBG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRnUyMTJZZFNhYTliNTJWOVFzdW5FOVMzTGdLY2JnUFFyZ2R0OExrdyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753368345),
('F2klLLQHgly00yu9Jhf4WPRO0t1m2gC9RaWMBT26', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTmNlQmFCRUVSOU55UXAxdlgyTGJxcTllVk1kRDVaV3NudnpxTnNVVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753283596),
('FRKzXh5v9KEwOiFzi10l9Uyt5vqrttr7IidAJpwF', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVkc3d29PZ00zMmQ5ZWpSYkVRSXUwNkN1VnNkS0M2djhrYXRqZmdKSiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753207504),
('HRlYhLBsG1W10dJeuu7uCo7i6gc5PmlKH5tY98fA', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOUdJd0RSZUNmYlpJNVZKTDN6YzA5MDhDT3FBd2lBalpHbkZIa3F4ZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753283997),
('itQlVwWpN9GOOKOqoe8iGE52JiExt0ULQRMYO4LV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOEdvSzZJWDMwUHJ5enBtYTdRRVExZjhUMURvQldoaHE4Qmdxc0N0VCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753283568),
('kBoslPqofK4Dvf2nqaiUTjtR7N6vUWixqDLJ6NAp', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMVNMSllwalV6RjVaclRHOHkzUVFldmw1cURLNGFPWTZYcUU4bWZ4NyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753200486),
('Kk7yuaxRL6mjGPK1jtwmvL79f6X8fXu5cD1VR6Ql', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSGR1cU9FdzFQV09nZTdCbFZoMUFIWkZIbUI0MWJYcGVIMEtsTk1zViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cy9iaS1xdXlldC1jaG9uLXNvZmEtcGh1LWhvcC1jaG8tcGhvbmcta2hhY2giO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1753205384),
('l8jgNOWGu1UwOr0NCQGUz4DWgvVbi0QPJflRLqS1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT1ZlZHhlQ21Jc2xPQVM0NGRoNHZMU0lVbjBVbUlKVUVHVDRPbDVNMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753205057),
('M5fqslGQ6RYTDIpifDb8KyaR9acEnn1FitcQjWNk', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSktOQlR6VEJXU2lrdVh5cFBqeTBlZThSY3NxOVdOODNEZlhoZ09zaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cy9iaS1xdXlldC1jaG9uLXNvZmEtcGh1LWhvcC1jaG8tcGhvbmcta2hhY2giO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1753206715),
('MV50Q50HaFlPTPtGpLvMT7XZVxRMKQyyB6zAvLq2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMlBzNW9Dc0NpRTlsZ1NTYkh2ODBlR3hTaDloUGhwRHQ5RDU3WVlHOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753207446),
('N6jtgXd5gGVgKN3ilMufoszfPTDia4zTMfKFraSq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWlMxeGVkaE9UVWFqalk0TE5yVk5zVU13U2hqNzhDcWNrWlFLM295VyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753200501),
('ngxMwhOAH1sd4A3fxl3vzWB8Wy1LRy34wXf8WKIA', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSGJNYTFmaWZTUTJ0SllxeUIxWm9aeFFFbmFLTUlOUU9oRUlzeFhKRSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753280327),
('Oqj5GjCZ3sNWgNRUHZeVXB9g6MEoDG6OsHpXOQPb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVEVpaUdna2gwdmg5WEpTYmQ1djc0NmNTeVVVSGNLUnZFY2xUSFptZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Nzg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cy9waG9uZy1jYWNoLXNjYW5kaW5hdmlhbi10cm9uZy10aGlldC1rZS1ub2ktdGhhdCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753206228),
('P3sKRwuuVJKffU358fYHDne8bqMa3idUvFzuEfpK', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidWdrYk13Rm5UNnFwUWE1RkpHSU1XbUVTWkN2cUFIZko1TEV3WGE5MiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Nzg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cy9waG9uZy1jYWNoLXNjYW5kaW5hdmlhbi10cm9uZy10aGlldC1rZS1ub2ktdGhhdCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753205408),
('PClDcc1TWamnNg0gCdDG8eRexk2LtLxIl9vpeu7E', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoielI3Z01WcVJXT01hdUw0dDFzQW5BQk52YjRraFh3U090WEZXN2pHWCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753280393),
('QdNwkQoI3EB762Q08iNoDU6qz0fGRSGq8GxyrF7U', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV1BCT0hMWHYwbzdCZTlBeW10WUhBR3lhcjlMb08yS3RIN0tuWnRFRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753280066),
('qkIohzFDGJH79zpwuSSCuHsekPAKmGgjak5AzCdS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicDRhNExFNDNXamZSTERONW1Oc045cTRSMm9uMU1USU9VV0ZXcUVTcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753207635),
('rjvDQZfqwadB0toPP9D8vDJeCS5kqaYjn9Wav2sh', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMW9JRTE3SVJEN0dKQnNjbnNHaEZtUUNobWE4YnZlY21OR3VxQzVOQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753280084),
('s8V8GsNUciN8N8SyPVzzYxn1bOm88LihPUxkRKEs', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiazVVZG11NXNKRWIzcG1vSUVkQlpPd0s1c1hUcW9ubWVwODdlR1pnNCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NzY6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cy90b2ktdXUtaG9hLWtob25nLWdpYW4tdm9pLW5vaS10aGF0LXRob25nLW1pbmgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1753205361),
('sG6RhgIcyahm9NbAhOpAXclKz14ceSZydfSMY6xA', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY2h5a0xnZTh3M2xOY3lDZWJUMW5DU0x0UWVJaFJMeVFQWklBTWlESiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753206236),
('SPFYmp4Kz1pWCS9tsqq6Il0JjFAezt5ash4nn48h', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYzhiQ1dXV1dvb2Q5azFWaTZXaWY2SkFUU3cyS0ZkV2tiQ2lxam0zNyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753205404),
('T1zjJG29Gr1HSFImxnn6j31xnrJ8NgDYsSk2oyBw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRExJZVV2a1lHbTVCSlhLY0t3OVJYZUdhQUVDQ0d3aXpRYk81MjVLbSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Nzg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cy9waG9uZy1jYWNoLXNjYW5kaW5hdmlhbi10cm9uZy10aGlldC1rZS1ub2ktdGhhdCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753206699),
('TDsQoymlF5Qg80bzQhLSeocaqJAgTP5cTAoW9yZq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYjFjMm5FaXdsZTU3R1lVNHpIaUhucVJlUGdpdUlleEc4aWVBcWFVMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753279922),
('U3U785O8m0t1uOj6vf37Eyo6141nbjutSefJoVOB', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaTU3eGJFVDdIM1dOZ3UwUmk0a0JhSXFKMkt5S2NOREZCQm9MTGNXcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753280345),
('uB1PyZGW61zRsmr5KDdj9ASkSKHsEj19ur4pqYR1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRzF4RnVocXVEMGcwRHF1alRMb1VsZmY4em9XMlZSYlBHdHhMV2dzaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753279767),
('UDhj9QmOiJbcuVrc10gATQ8FXFzaRdIijUoEvRgW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia09ZNzlydHJjdTdSME1WNVZGdVZ4MW9tNnV2WWlRSVc1ZjB5QzZDYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753200743),
('v7RkLgoKDFYFsUetK1k2pjeHcBpOVap918hxff8M', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNERYYmRKbTNDcERJRjRqbXZBRzNTM1FkMEFjdXBWMUVyekxVclB1RyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Nzg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cy9waG9uZy1jYWNoLXNjYW5kaW5hdmlhbi10cm9uZy10aGlldC1rZS1ub2ktdGhhdCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753205052),
('VcAFjoqlRQC79086HvE3jjpBdb8EHScWW5mdXX1n', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieFNrdExuWUtualBnV2pJa1JZZjZaNmZLemx0NTlQVnMyNnJwaTZrciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753280273),
('vkl9PPxTjC0v80FnEhVz4TNPEuvvClvV2JKzVaJ7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN1pMYmlpcXMwbTJZOTU4aUxVQkZIb1NobGJSQk9pdVNod2llYlVpSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Nzg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cy9waG9uZy1jYWNoLXNjYW5kaW5hdmlhbi10cm9uZy10aGlldC1rZS1ub2ktdGhhdCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753206496),
('WAfQObHYDXV1BUL19yrQJJUNA39LlnYEzX1xYvQ1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSzlOMmpWZHZiQktuNmxJR0l4a09ST2RiNXFpYkc0RDJFcVpKOWtrSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753279140),
('XogrMbICo3IMELQ3lbT2BpvDjRKmTiFn18ksV7Qv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaTVyVG1vWDl6UjZ2SEhLc09wWUhxNmVHVjEzNVY3eTBzQldyYzVFeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753203653),
('xQ7b2CYS4h86cGLjYnoozK09I45zWtmm3JAU8eJy', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibG1YWjh2TEpqZGRxMThIRE1CNmRZYTE3UXc5bk9wcmo2MElSa3hSTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753203645),
('xQZQlj5PjcbYCnaXjp7QHqsz7eLMBFQOSApRC7Gy', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia2dRaDlLaE1DOTNBcnAxbGNTUjRCUmx4alNLb1A1NjZ5MHFMN29vUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NzY6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cy90b2ktdXUtaG9hLWtob25nLWdpYW4tdm9pLW5vaS10aGF0LXRob25nLW1pbmgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1753205058),
('xtlODySKYQskVAJQ4UzirNSSX5IWnDBK4XxOOpVE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSThQUjJ1TUN3VThrSW4wNkNZanUzcFRhcjJZNzZ1dW1zelFFY3VRRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753285349),
('y6ritg67JEGgpy3TpjelALL3frN5w0fYg6stW6ii', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib1Qwd3pacWRSNzBvUUdqeHdJWk80VVJNVkk4UllXQ016c2ZYUktMYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753205380),
('Y9vENzF3wyvEXN1mdMqLNup5JWcLVPyfhwAayJBI', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOTdaNDVqc2s0eUVtVWhyNnVRU3NkaWxtZjBadDNOYkNIeDVOSHR0OCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753280287),
('YcOlrcnurx0E8pHe6OzG5cwEJ5NT5eJq4OclmPDj', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicW5mRHRFYnVkWnVnaEcwOEE3NEpEUmJldWZ4VTFYSnc2cFhySjRFeSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753205049),
('YLASFh3djRW6kNC7CRWsyVZz3hfZdlX5ZNvhPcQe', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibEZwV3NDSTJtRjY0OFZWSnpLUWtGNXUyeVh3Y1F1NFkzNFN5am13cCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753279979),
('ynMZ5FESsBGLQxy54e20eqIvPNByFpCbu8UKQUnU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHZNRmt6aURmRVFhT1VVRlZiVG9tbVpleDBkbXkwdWJTSGNWc1RheSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753284105),
('yPVesDlgY0TPB2jwP8ztzKQYVZt6PUpk78MFFWSu', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSmk0a2NFRGxRbDE1Y0lZZlltQ2ZLSlpiZGlDYmdyMFBHUm84UFhaZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753281284);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `Role` varchar(255) DEFAULT NULL,
  `Fullname` varchar(255) DEFAULT NULL,
  `Phone` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Status` tinyint(1) DEFAULT NULL,
  `Created_at` datetime DEFAULT NULL,
  `Updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`UserID`, `Username`, `Password`, `remember_token`, `Email`, `email_verified_at`, `Role`, `Fullname`, `Phone`, `Address`, `Status`, `Created_at`, `Updated_at`) VALUES
(1, 'chauchau', '$2y$12$Ywmq1ViGmO2r/YTJdkmm1uBqUZIzfoHPPoR0aCm0StR65ON8R6w4y', NULL, 'blackrabitxx@gmail.com', '2025-07-13 17:06:12', '1', 'Châu nè', NULL, NULL, NULL, '2025-06-06 14:55:57', '2025-06-06 14:55:57'),
(2, NULL, NULL, NULL, NULL, NULL, NULL, 'Nguyen Van L', '0123456789', NULL, NULL, NULL, NULL),
(14, 'nguyenvanchien', '$2y$12$L5VNH3JnJtJSY1T6vke9Fe8XGNY/IRF0ygGjUxP2dOK3tlfAfzkpe', NULL, 'chauttc01@gmail.com', '2025-07-07 15:38:04', NULL, 'Nguyen Van A', NULL, NULL, NULL, NULL, NULL),
(17, 'nguyenvanfy', '$2y$12$cod1X9/hB0FD85CYiOHcquekn7F0j2aKDB4601d7es9ulw7r3rD.e', NULL, 'nguyenvanfy@example.com', NULL, NULL, 'Nguyễn Văn F', '0123456789', 'Hà Nội', 1, NULL, NULL),
(18, 'nguyenvanchau', '$2y$12$.uAFAM2gwbuPOZsBP4hnVeLgK8q7FEEtK4RHcQjs13DnDFTelsWyW', NULL, 'chauttcps38292@fpt.edu.vn', '2025-07-12 14:49:27', NULL, 'Nguyen Van Chau', NULL, NULL, NULL, NULL, NULL),
(25, 'linh123456', '$2y$12$ni.2cUEGahjjRpPXshw6feQacB3ZOj8.wIoWh06Pb9aZcOCBF5KCu', NULL, 'linh@gmail.com', NULL, NULL, 'linh', '12345678', 'hà lội', 1, NULL, NULL),
(26, 'chau123', '$2y$12$9TT6ammCpIFSvsZHisHmBubS425J3XScAFHNz0v53.y.sh6DS8jqy', NULL, 'blambxx@gmail.com', '2025-07-13 14:28:20', NULL, 'chau', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `variant_attributes`
--

CREATE TABLE `variant_attributes` (
  `VariantAttributeID` int(11) NOT NULL,
  `ProductVariantID` int(11) NOT NULL,
  `AttributeID` int(11) NOT NULL,
  `value` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `variant_attributes`
--

INSERT INTO `variant_attributes` (`VariantAttributeID`, `ProductVariantID`, `AttributeID`, `value`, `created_at`, `updated_at`) VALUES
(9, 3, 1, 'Trắng', '2025-07-01 15:43:13', '2025-07-01 15:43:13'),
(10, 3, 2, '1m6', '2025-07-01 15:43:13', '2025-07-01 15:43:13'),
(11, 4, 1, 'Nâu', '2025-07-01 15:43:13', '2025-07-01 15:43:13'),
(12, 4, 2, '1m8', '2025-07-01 15:43:13', '2025-07-01 15:43:13'),
(13, 5, 1, 'Tự Nhiên', '2025-07-01 15:43:13', '2025-07-01 15:43:13'),
(14, 6, 1, 'Nâu', '2025-07-01 15:43:13', '2025-07-01 15:43:13'),
(15, 7, 1, 'Kem', '2025-07-01 15:43:13', '2025-07-01 15:43:13'),
(16, 8, 1, 'Xám', '2025-07-01 15:43:13', '2025-07-01 15:43:13'),
(17, 9, 2, '2m4', '2025-07-01 15:43:13', '2025-07-01 15:43:13'),
(18, 10, 2, '3m', '2025-07-01 15:43:13', '2025-07-01 15:43:13'),
(19, 15, 1, 'Đỏ', '2025-07-05 08:54:19', '2025-07-05 08:54:19'),
(20, 15, 2, 'XL', '2025-07-05 08:54:19', '2025-07-05 08:54:19'),
(23, 17, 1, 'Đỏ', '2025-07-05 10:03:30', '2025-07-05 10:03:30'),
(24, 17, 2, 'XL', '2025-07-05 10:03:30', '2025-07-05 10:03:30'),
(25, 18, 1, 'Đỏ', '2025-07-11 09:57:16', '2025-07-11 09:57:16'),
(26, 18, 2, 'XL', '2025-07-11 09:57:16', '2025-07-11 09:57:16'),
(27, 19, 1, 'Đỏ', '2025-07-11 09:59:03', '2025-07-11 09:59:03'),
(28, 19, 2, 'XL', '2025-07-11 09:59:03', '2025-07-11 09:59:03');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `voucher`
--

CREATE TABLE `voucher` (
  `VoucherID` int(11) NOT NULL,
  `Code` varchar(255) DEFAULT NULL,
  `Value` decimal(10,0) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Update_at` datetime DEFAULT NULL,
  `Create_at` datetime DEFAULT NULL,
  `Status` tinyint(1) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Expiry_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `voucher`
--

INSERT INTO `voucher` (`VoucherID`, `Code`, `Value`, `Quantity`, `Update_at`, `Create_at`, `Status`, `Description`, `Expiry_date`) VALUES
(1, 'SALE20', 200000, 20, '2025-07-03 22:59:41', '2025-07-03 22:59:41', 1, 'Giảm 200k cho đơn từ 2 triệu', '2025-12-31'),
(2, 'FREESHIP', 0, 100, '2025-07-03 22:59:41', '2025-07-03 22:59:41', 1, 'Miễn phí vận chuyển toàn quốc', '2025-12-31'),
(3, 'SUMMER20', 200000, 30, '2025-07-03 22:59:41', '2025-07-03 22:59:41', 1, 'Giảm 200k cho đơn từ 2 triệu', '2025-08-31');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`AttributeID`);

--
-- Chỉ mục cho bảng `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`CartID`),
  ADD KEY `UserID` (`UserID`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`CartItemID`),
  ADD KEY `CartID` (`CartID`),
  ADD KEY `ProductVariantID` (`ProductVariantID`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Chỉ mục cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Chỉ mục cho bảng `favorite_products`
--
ALTER TABLE `favorite_products`
  ADD PRIMARY KEY (`FavoriteProductID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `ProductID` (`ProductVariantID`);

--
-- Chỉ mục cho bảng `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Chỉ mục cho bảng `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`MessageID`),
  ADD KEY `UserID` (`UserID`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `author_id` (`author_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`NotificationID`),
  ADD KEY `UserID` (`UserID`);

--
-- Chỉ mục cho bảng `orderdetail`
--
ALTER TABLE `orderdetail`
  ADD PRIMARY KEY (`OrderDetailID`),
  ADD KEY `OrderID` (`OrderID`),
  ADD KEY `ProductID` (`ProductVariantID`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderID`),
  ADD UNIQUE KEY `InvoiceCode` (`InvoiceCode`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `VoucherID` (`VoucherID`),
  ADD KEY `PaymentID` (`PaymentID`);

--
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `payment_gateway`
--
ALTER TABLE `payment_gateway`
  ADD PRIMARY KEY (`PaymentID`);

--
-- Chỉ mục cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- Chỉ mục cho bảng `productvariants`
--
ALTER TABLE `productvariants`
  ADD PRIMARY KEY (`ProductVariantID`);

--
-- Chỉ mục cho bảng `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`ReviewID`),
  ADD KEY `OrderDetailID` (`OrderDetailID`),
  ADD KEY `ProductID` (`ProductVariantID`),
  ADD KEY `UserID` (`UserID`);

--
-- Chỉ mục cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- Chỉ mục cho bảng `variant_attributes`
--
ALTER TABLE `variant_attributes`
  ADD PRIMARY KEY (`VariantAttributeID`),
  ADD KEY `ProductVariantID` (`ProductVariantID`),
  ADD KEY `AttributeID` (`AttributeID`);

--
-- Chỉ mục cho bảng `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`VoucherID`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `attributes`
--
ALTER TABLE `attributes`
  MODIFY `AttributeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `carts`
--
ALTER TABLE `carts`
  MODIFY `CartID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `CartItemID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `favorite_products`
--
ALTER TABLE `favorite_products`
  MODIFY `FavoriteProductID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `messages`
--
ALTER TABLE `messages`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `NotificationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orderdetail`
--
ALTER TABLE `orderdetail`
  MODIFY `OrderDetailID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `payment_gateway`
--
ALTER TABLE `payment_gateway`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `productvariants`
--
ALTER TABLE `productvariants`
  MODIFY `ProductVariantID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `review`
--
ALTER TABLE `review`
  MODIFY `ReviewID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `variant_attributes`
--
ALTER TABLE `variant_attributes`
  MODIFY `VariantAttributeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT cho bảng `voucher`
--
ALTER TABLE `voucher`
  MODIFY `VoucherID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`CartID`) REFERENCES `carts` (`CartID`),
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`ProductVariantID`) REFERENCES `productvariants` (`ProductVariantID`);

--
-- Các ràng buộc cho bảng `favorite_products`
--
ALTER TABLE `favorite_products`
  ADD CONSTRAINT `favorite_products_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `favorite_products_ibfk_2` FOREIGN KEY (`ProductVariantID`) REFERENCES `productvariants` (`ProductVariantID`);

--
-- Các ràng buộc cho bảng `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Các ràng buộc cho bảng `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `news_author_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users` (`UserID`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Các ràng buộc cho bảng `orderdetail`
--
ALTER TABLE `orderdetail`
  ADD CONSTRAINT `orderdetail_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`),
  ADD CONSTRAINT `orderdetail_ibfk_2` FOREIGN KEY (`ProductVariantID`) REFERENCES `productvariants` (`ProductVariantID`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`VoucherID`) REFERENCES `voucher` (`VoucherID`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`PaymentID`) REFERENCES `payment_gateway` (`PaymentID`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`);

--
-- Các ràng buộc cho bảng `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`OrderDetailID`) REFERENCES `orderdetail` (`OrderDetailID`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`ProductVariantID`) REFERENCES `productvariants` (`ProductVariantID`),
  ADD CONSTRAINT `review_ibfk_3` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Các ràng buộc cho bảng `variant_attributes`
--
ALTER TABLE `variant_attributes`
  ADD CONSTRAINT `variant_attributes_ibfk_1` FOREIGN KEY (`ProductVariantID`) REFERENCES `productvariants` (`ProductVariantID`) ON DELETE CASCADE,
  ADD CONSTRAINT `variant_attributes_ibfk_2` FOREIGN KEY (`AttributeID`) REFERENCES `attributes` (`AttributeID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
