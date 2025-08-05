-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 05, 2025 at 05:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `datn`
--

-- --------------------------------------------------------

--
-- Table structure for table `attributes`
--

CREATE TABLE `attributes` (
  `AttributeID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attributes`
--

INSERT INTO `attributes` (`AttributeID`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Màu sắc', '2025-07-01 15:43:13', '2025-07-01 15:43:13'),
(2, 'Kích thước', '2025-07-01 15:43:13', '2025-07-01 15:43:13');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `CartID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'active',
  `Create_at` datetime DEFAULT NULL,
  `Update_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`CartID`, `UserID`, `Status`, `Create_at`, `Update_at`) VALUES
(1, 14, 'active', '2025-07-27 13:31:20', '2025-07-27 13:31:20'),
(2, 1, 'active', '2025-08-03 05:14:03', '2025-08-03 05:14:03'),
(3, 29, 'active', '2025-08-03 05:15:42', '2025-08-03 05:15:42');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `CartItemID` int(11) NOT NULL,
  `CartID` int(11) DEFAULT NULL,
  `ProductVariantID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Create_at` datetime DEFAULT NULL,
  `Update_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`CartItemID`, `CartID`, `ProductVariantID`, `Quantity`, `Create_at`, `Update_at`) VALUES
(1, 1, 19, 3, '2025-07-27 13:31:21', '2025-07-27 07:32:36'),
(2, 1, 3, 2, '2025-07-27 13:31:21', '2025-07-27 07:32:39'),
(3, 1, 18, 3, '2025-07-27 07:27:08', '2025-07-27 14:07:58'),
(4, 1, 9, 1, '2025-07-27 14:08:03', '2025-07-27 14:08:03'),
(5, 2, 18, 1, '2025-08-03 05:14:03', '2025-08-03 05:14:03'),
(35, 3, 11, 2, '2025-08-04 15:05:47', '2025-08-04 15:05:51');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
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
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`CategoryID`, `Name`, `Description`, `Image`, `Create_at`, `Update_at`) VALUES
(1, 'Bàn ăn cao cấp', 'Các loại bàn ăn chất lượng cao, thiết kế hiện đại và cao cấp', 'ban/Ban-an-Go-Tram-Tu-Nhien-MOHO-NYBORG01.png', '2025-07-01 22:40:00', '2025-07-27 07:50:10'),
(2, 'Ghế', 'Các loại ghế ăn, ghế sofa, ghế gỗ tự nhiên', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(3, 'Sofa', 'Sofa da, sofa vải, sofa gỗ', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(4, 'Tủ bếp', 'Tủ bếp hiện đại, tủ bếp gỗ', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(5, 'Tủ giày', 'Tủ giày gỗ, tủ giày thông minh', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(6, 'Tủ quần áo', 'Tủ quần áo gỗ, tủ quần áo nhiều ngăn', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(7, 'Kệ tivi', 'Kệ tivi phòng khách', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(8, 'Giường ngủ', 'Giường ngủ gỗ tự nhiên, giường ngủ hiện đại', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00'),
(9, 'Nệm', 'Nệm cao su, nệm lò xo, nệm mousse', '', '2025-07-01 22:40:00', '2025-07-01 22:40:00');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
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
-- Table structure for table `favorite_products`
--

CREATE TABLE `favorite_products` (
  `FavoriteProductID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `ProductVariantID` int(11) DEFAULT NULL,
  `Create_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorite_products`
--

INSERT INTO `favorite_products` (`FavoriteProductID`, `UserID`, `ProductVariantID`, `Create_at`) VALUES
(75, 1, 14, '2025-08-02 02:03:41'),
(77, 1, 5, '2025-08-02 06:45:28'),
(78, 1, 7, '2025-08-02 06:51:01'),
(79, 1, 3, '2025-08-02 06:59:33'),
(80, 1, 9, '2025-08-02 07:17:30'),
(85, 1, 18, '2025-08-03 03:56:31'),
(86, 1, 20, '2025-08-03 04:15:48'),
(87, 1, 17, '2025-08-03 04:52:09'),
(91, 29, 18, '2025-08-03 07:19:32'),
(110, 29, 20, '2025-08-04 15:06:54'),
(111, 29, 14, '2025-08-05 02:28:15');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
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
-- Table structure for table `job_batches`
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
-- Table structure for table `messages`
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
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(4, '2025_05_29_154550_create_personal_access_tokens_table', 1),
(5, '0001_01_01_000002_create_jobs_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `news`
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
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `slug`, `content`, `image`, `author_id`, `status`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'Thiết kế nội thất hiện đại cho căn hộ nhỏ', 'thiet-ke-noi-that-hien-dai-cho-can-ho-nho', 'Nội dung bài viết về thiết kế nội thất hiện đại cho căn hộ nhỏ...', '/images/img_1.jpg', 1, 'published', '2025-07-08 10:00:00', '2025-07-22 16:32:48', '2025-07-22 17:47:35'),
(2, 'Xu hướng màu sắc nội thất năm 2025', 'xu-huong-mau-sac-noi-that-nam-2025', 'Nội dung bài viết về xu hướng màu sắc nội thất năm 2025...', '/images/img_2.jpg', 1, 'published', '2025-07-08 11:00:00', '2025-07-22 16:32:48', '2025-07-22 17:47:46'),
(3, 'Bí quyết chọn sofa phù hợp cho phòng khách', 'bi-quyet-chon-sofa-phu-hop-cho-phong-khach', 'Nội dung bài viết về bí quyết chọn sofa phù hợp...', '/images/img_3.jpg', 1, 'published', '2025-07-08 12:00:00', '2025-07-22 16:32:48', '2025-07-22 17:47:49'),
(4, 'Tối ưu hóa không gian với nội thất thông minh', 'toi-uu-hoa-khong-gian-voi-noi-that-thong-minh', 'Nội dung bài viết về tối ưu hóa không gian...', '/images/img_4.jpg', 1, 'published', '2025-07-08 13:00:00', '2025-07-22 16:32:48', '2025-07-22 17:48:01'),
(5, 'Phong cách Scandinavian trong thiết kế nội thất', 'phong-cach-scandinavian-trong-thiet-ke-noi-that', 'Nội dung bài viết về phong cách Scandinavian nè', '/images/img_5.jpg', 1, 'published', '2025-07-08 00:00:00', '2025-07-22 16:32:48', '2025-08-04 07:07:39');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
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
-- Table structure for table `orderdetail`
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
-- Dumping data for table `orderdetail`
--

INSERT INTO `orderdetail` (`OrderDetailID`, `OrderID`, `ProductVariantID`, `Quantity`, `Unit_price`, `Subtotal`) VALUES
(1, NULL, NULL, NULL, NULL, NULL),
(2, NULL, NULL, NULL, NULL, NULL),
(3, 5, 5, 2, 6000000, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
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
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`OrderID`, `InvoiceCode`, `UserID`, `VoucherID`, `PaymentID`, `Status`, `Total_amount`, `Receiver_name`, `Receiver_phone`, `Shipping_address`, `Create_at`, `Update_at`) VALUES
(1, NULL, NULL, NULL, NULL, 'completed', 15000000, 'Nguyen Van B', '0987654321', '456 Đường XYZ', '2025-07-01 18:34:13', '2025-07-05 17:24:18'),
(2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-01 18:35:53', '2025-07-01 18:35:53'),
(3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-01 18:40:05', '2025-07-01 18:40:05'),
(4, NULL, NULL, NULL, NULL, NULL, 11500000, NULL, NULL, NULL, '2025-07-01 18:41:39', '2025-07-01 18:41:39'),
(5, NULL, 1, 2, 2, 'pending', 12000000, 'Nguyen Van A', '0123456789', '123 Đường ABC', '2025-07-05 17:22:46', '2025-07-05 17:22:46'),
(10, NULL, 29, NULL, 2, NULL, 15200000, 'k', '0987654321', 'hcm', '2025-08-04 12:27:41', '2025-08-04 12:27:41'),
(11, NULL, 29, NULL, 2, NULL, 15200000, 'k', '0987654321', 'hcm', '2025-08-04 12:35:32', '2025-08-04 12:35:32'),
(12, NULL, 29, NULL, 2, NULL, 15200000, 'k', '0987654321', 'hcm', '2025-08-04 12:37:04', '2025-08-04 12:37:04'),
(13, NULL, 29, NULL, 2, NULL, 15200000, 'k', '0987654321', 'hcm', '2025-08-04 12:42:30', '2025-08-04 12:42:30'),
(14, NULL, 29, NULL, 2, NULL, 15200000, 'kk', '0987654321', 'hcm', '2025-08-04 12:51:54', '2025-08-04 12:51:54'),
(15, NULL, 29, NULL, 2, NULL, 34900000, 'hcm', '0987654321', 'hcm', '2025-08-04 13:37:13', '2025-08-04 13:37:13'),
(16, NULL, 29, NULL, 2, NULL, 34900000, 'h', '0987654321', 'hcm', '2025-08-04 13:39:07', '2025-08-04 13:39:07'),
(17, NULL, 29, NULL, 2, NULL, 34900000, 'hcm', '0987654321', 'kkr', '2025-08-04 13:40:02', '2025-08-04 13:40:02'),
(18, NULL, 29, NULL, 2, NULL, 34900000, 'kkk', '0987654321', 'ada', '2025-08-04 13:44:56', '2025-08-04 13:44:56'),
(19, NULL, 29, NULL, 2, NULL, 34900000, 'kk', '0987654321', 'fgfg', '2025-08-04 13:55:56', '2025-08-04 13:55:56'),
(20, NULL, 29, NULL, 2, NULL, 34900000, 'kk', '0987654321', 'hcm', '2025-08-04 13:56:35', '2025-08-04 13:56:35'),
(21, NULL, 29, NULL, 2, NULL, 24900000, 'kiệt', '0987654321', 'ok', '2025-08-04 14:14:05', '2025-08-04 14:14:05'),
(22, NULL, 29, NULL, 2, NULL, 30100000, 'gfgfs', '0987654321', 'faddsf', '2025-08-04 14:57:20', '2025-08-04 14:57:20'),
(23, NULL, 29, NULL, 2, 'pending', 10000000, 'kiệt', '0987654321', 'vườn lài', '2025-08-04 15:06:09', '2025-08-04 15:09:40');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('blackrabitxx@gmail.com', 'pBRWO6CKb7CaX6cI6o4nvzkkUjU9cLFqwfncPvzpCOU5gpO8B4jdOmVo37FG', '2025-07-12 11:11:27'),
('kiettdps41124@gmail.com', 'UtsPUWkTC93eDQWDTtxvW0FSptuqw3sbWwoH5HNRD8DRJEtXw0YxrLuuXkvzrtn3', '2025-07-29 01:14:30');

-- --------------------------------------------------------

--
-- Table structure for table `payment_gateway`
--

CREATE TABLE `payment_gateway` (
  `PaymentID` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_gateway`
--

INSERT INTO `payment_gateway` (`PaymentID`, `Name`) VALUES
(2, 'COD'),
(3, 'Ví điện tử Momo'),
(4, 'Thẻ tín dụng/ghi nợ'),
(5, 'Thanh toán khi nhận hàng'),
(6, 'Ví điện tử ZaloPay'),
(7, 'Thanh toán khi nhận hàng (COD)'),
(8, 'Chuyển khoản ngân hàng'),
(9, 'Thanh toán qua ví điện tử');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
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
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(23, 'App\\Models\\User', 1, 'auth_token', '188fa630767a98b98f089047c3e2ffcff773174bac95370866d1a132a50ea012', '[\"*\"]', NULL, NULL, '2025-07-24 09:13:16', '2025-07-24 09:13:16'),
(24, 'App\\Models\\User', 1, 'auth_token', 'f23f77a10a8414926772c6c5529045e4c113a7563a74024aa9dbfb768bfe3633', '[\"*\"]', NULL, NULL, '2025-07-24 09:23:26', '2025-07-24 09:23:26'),
(25, 'App\\Models\\User', 1, 'auth_token', 'fdf872474ee6fb37ef3070d244ec5971c147391d480ddcb1fad5d6ed4b601766', '[\"*\"]', NULL, NULL, '2025-07-25 11:13:16', '2025-07-25 11:13:16'),
(26, 'App\\Models\\User', 1, 'auth_token', 'e9a83e4f73e4cdf19a72c206f2bb9de3156f59e56fb2b6910779a24daa09d1e1', '[\"*\"]', NULL, NULL, '2025-07-25 11:14:03', '2025-07-25 11:14:03'),
(27, 'App\\Models\\User', 1, 'auth_token', '2aca26e75fea15da65d2cb90ba4a63e51a021857fa3bca41f347767f17fb015c', '[\"*\"]', NULL, NULL, '2025-07-26 08:51:14', '2025-07-26 08:51:14'),
(28, 'App\\Models\\User', 1, 'auth_token', '6bbe593a7342678978e8e0f8ed0163c6136f5bd8aff74147bc3634432228a48c', '[\"*\"]', NULL, NULL, '2025-07-26 22:48:35', '2025-07-26 22:48:35'),
(29, 'App\\Models\\User', 1, 'auth_token', '8c81e699082f39f8560ea0953d6aad8a3a3d05342de0f53437b3efb0c2fcd9d8', '[\"*\"]', NULL, NULL, '2025-07-26 22:48:39', '2025-07-26 22:48:39'),
(30, 'App\\Models\\User', 1, 'auth_token', '9c7f766f9238314b22a6a5417ec6cff33d1ecde5fd9f0c90ed34b2559918abd9', '[\"*\"]', NULL, NULL, '2025-07-26 22:48:55', '2025-07-26 22:48:55'),
(31, 'App\\Models\\User', 1, 'auth_token', 'f70e1e2468295da0733d30c2684a12bffa25f71e33c224395afb6a9b585eb4ab', '[\"*\"]', NULL, NULL, '2025-07-26 22:54:45', '2025-07-26 22:54:45'),
(32, 'App\\Models\\User', 14, 'auth_token', 'b1328680054147d48c15fa8c556f3557a39257baffad995595e2ba3e5400c231', '[\"*\"]', NULL, NULL, '2025-07-26 22:58:29', '2025-07-26 22:58:29'),
(33, 'App\\Models\\User', 14, 'auth_token', 'a2e95fadf1f7c018ce54cf44ae5b6a010e350f48db760a8bf20b9afbc76b0b75', '[\"*\"]', NULL, NULL, '2025-07-26 23:03:04', '2025-07-26 23:03:04'),
(34, 'App\\Models\\User', 14, 'auth_token', '59a0e8e909bf821b62b948681c23e9d029a2c2efe8e42f7b4fc5de8996e1de37', '[\"*\"]', NULL, NULL, '2025-07-26 23:03:07', '2025-07-26 23:03:07'),
(35, 'App\\Models\\User', 1, 'auth_token', '756866838295ff6475c9c9b8fd7a1bd63124a01159bb881b741909ed545f3d75', '[\"*\"]', NULL, NULL, '2025-07-26 23:11:21', '2025-07-26 23:11:21'),
(36, 'App\\Models\\User', 1, 'auth_token', '5c40d44abe8cf88bb5a0b11a24e55116445a4cf1cdfcfd22cc8dd4c194a0153b', '[\"*\"]', NULL, NULL, '2025-07-26 23:11:23', '2025-07-26 23:11:23'),
(37, 'App\\Models\\User', 14, 'auth_token', 'e62936e61ec94a4c915ac6e3cea87480e71c1b62ef593f6269e43100f7a0ea4a', '[\"*\"]', NULL, NULL, '2025-07-26 23:12:56', '2025-07-26 23:12:56'),
(38, 'App\\Models\\User', 14, 'auth_token', 'e19fee43b79c6606e22ef214abffccac54346d432bc1d9380e134bb3349ee17b', '[\"*\"]', NULL, NULL, '2025-07-26 23:14:28', '2025-07-26 23:14:28'),
(39, 'App\\Models\\User', 14, 'auth_token', '6e420249db26268ea7abbb43388392905bff1e0998842b9af748c443b33e43c4', '[\"*\"]', NULL, NULL, '2025-07-26 23:15:47', '2025-07-26 23:15:47'),
(40, 'App\\Models\\User', 1, 'auth_token', '76a8cfa4c35f05b6159aa83e743f245761c38c24117afad49515ea1250a18aee', '[\"*\"]', NULL, NULL, '2025-07-26 23:15:59', '2025-07-26 23:15:59'),
(41, 'App\\Models\\User', 14, 'auth_token', 'b81280faa1305bbce6efb9e1efccfc91482bccce40df11930414cfa39353e97d', '[\"*\"]', '2025-07-27 00:33:05', NULL, '2025-07-26 23:26:20', '2025-07-27 00:33:05'),
(42, 'App\\Models\\User', 1, 'auth_token', 'daf6a90530d28a7df2b23d359563216cb711fdeb625fd02ac4733740734bd1cd', '[\"*\"]', NULL, NULL, '2025-07-27 00:35:59', '2025-07-27 00:35:59'),
(43, 'App\\Models\\User', 14, 'auth_token', 'e14ce4db7824bbae10f52648c1f70180768abe21436aa3f8d0b1d869fdb9a158', '[\"*\"]', '2025-07-27 07:08:08', NULL, '2025-07-27 07:01:06', '2025-07-27 07:08:08'),
(44, 'App\\Models\\User', 1, 'auth_token', 'aef9890a8f9ca1b722539fb68721b9743c9d11ff18452100174ccec3fea46726', '[\"*\"]', NULL, NULL, '2025-07-27 07:08:27', '2025-07-27 07:08:27'),
(45, 'App\\Models\\User', 1, 'auth_token', 'd41c5627b9711f3397b5984e99f08ab2e3cbec64fcf07126e56c8b816adb1bee', '[\"*\"]', '2025-07-27 07:18:46', NULL, '2025-07-27 07:10:07', '2025-07-27 07:18:46'),
(46, 'App\\Models\\User', 1, 'auth_token', 'cdc89dbc5750570f809586db327465ac57e2606a488d860bb15854f3e73626b8', '[\"*\"]', NULL, NULL, '2025-07-27 07:18:57', '2025-07-27 07:18:57'),
(47, 'App\\Models\\User', 1, 'auth_token', 'f712c1a89a910c873afd2b8e7285638053d6b383cb96d4aff0dc6dbaf155751b', '[\"*\"]', NULL, NULL, '2025-07-27 07:54:41', '2025-07-27 07:54:41'),
(48, 'App\\Models\\User', 1, 'auth_token', 'dae6b55e857b725140457a81e79d5f3a794d9c461da4adfed7ef277fb4e58990', '[\"*\"]', NULL, NULL, '2025-07-27 07:54:41', '2025-07-27 07:54:41'),
(49, 'App\\Models\\User', 1, 'auth_token', 'e447fff98473ff9d3e9118a55a24ec266cd30f9a6bee490377f0dcccb78902d1', '[\"*\"]', NULL, NULL, '2025-07-27 07:54:42', '2025-07-27 07:54:42'),
(50, 'App\\Models\\User', 1, 'auth_token', '80b57709766ed864d26bb985760f577d49907f8639946eb5e50e76562cc71656', '[\"*\"]', NULL, NULL, '2025-07-27 07:54:42', '2025-07-27 07:54:42'),
(51, 'App\\Models\\User', 1, 'auth_token', '4a741d59d37171f4ead6645290588e8cadefb35d855be60554b0de4340276f93', '[\"*\"]', NULL, NULL, '2025-07-27 07:54:42', '2025-07-27 07:54:42'),
(52, 'App\\Models\\User', 1, 'auth_token', 'f78e3c87d33fac6a096d4711fff8c71ee0c85dd1af0a0d87d3fee62c150f8449', '[\"*\"]', NULL, NULL, '2025-07-27 07:54:43', '2025-07-27 07:54:43'),
(53, 'App\\Models\\User', 1, 'auth_token', 'cea7a740f60dde77ddc1849f16b430e4b41ce17d09e3dbcd781b8a3761e3bfb4', '[\"*\"]', NULL, NULL, '2025-07-29 10:43:25', '2025-07-29 10:43:25'),
(54, 'App\\Models\\User', 1, 'auth_token', '0108da030c52892768d0876e5167055fff93bc695daa90b707710af540f9b919', '[\"*\"]', '2025-07-31 19:59:23', NULL, '2025-07-29 11:17:18', '2025-07-31 19:59:23'),
(55, 'App\\Models\\User', 1, 'auth_token', 'cd7ec0f3956e54d878db77b87c7ac8786e600b4c017e6f189107b13e2f136bb3', '[\"*\"]', '2025-07-31 20:14:50', NULL, '2025-07-31 19:59:28', '2025-07-31 20:14:50'),
(56, 'App\\Models\\User', 1, 'auth_token', 'b00dd5515edf38dadd427508acb547050a96787a7baacaa836cbd9d77952f0f6', '[\"*\"]', '2025-07-31 20:18:37', NULL, '2025-07-31 20:14:53', '2025-07-31 20:18:37'),
(57, 'App\\Models\\User', 28, 'auth_token', '4b1ff6d1944a9136895e01c1b1a2369d727d5ebf51390c91e9a09debc54159da', '[\"*\"]', '2025-07-31 20:22:45', NULL, '2025-07-31 20:21:30', '2025-07-31 20:22:45'),
(58, 'App\\Models\\User', 1, 'auth_token', '3b0f256a9d3b90cab3b3e28edc19cf77e39fd0441e6369ce0279c915993ce97d', '[\"*\"]', NULL, NULL, '2025-07-31 20:30:51', '2025-07-31 20:30:51'),
(59, 'App\\Models\\User', 1, 'auth_token', 'ce7e9908d3237ae8d5619aa76225c9322e2b59ef4642caa9f12313eac3d93759', '[\"*\"]', '2025-07-31 20:34:54', NULL, '2025-07-31 20:34:44', '2025-07-31 20:34:54'),
(60, 'App\\Models\\User', 1, 'auth_token', 'b44e28f6985f255ed3377d446bfa4a033f534d51c0996c02bd1e4b415c4ceef5', '[\"*\"]', NULL, NULL, '2025-07-31 20:35:04', '2025-07-31 20:35:04'),
(61, 'App\\Models\\User', 1, 'auth_token', '1d3984db5da5414b44a5e9c6236a3a28f66e42b3d22ff6240efbad80ae750e8e', '[\"*\"]', NULL, NULL, '2025-07-31 20:37:19', '2025-07-31 20:37:19'),
(62, 'App\\Models\\User', 1, 'auth_token', '88ab69ea2945f93266e71070037e34863359e614f4a8d5ba215cd7e0ed5ef487', '[\"*\"]', '2025-07-31 20:39:19', NULL, '2025-07-31 20:37:31', '2025-07-31 20:39:19'),
(63, 'App\\Models\\User', 28, 'auth_token', '99b34218ae12e775d67af1f4181e53d5b0a1c825cf071354f88fca6bf4f6ef93', '[\"*\"]', '2025-07-31 20:39:47', NULL, '2025-07-31 20:39:27', '2025-07-31 20:39:47'),
(64, 'App\\Models\\User', 1, 'auth_token', '63d4f031b749dddddea0978d8ae700b2d7d37f6863484009e2479338c25f6b9d', '[\"*\"]', '2025-07-31 20:47:00', NULL, '2025-07-31 20:39:52', '2025-07-31 20:47:00'),
(65, 'App\\Models\\User', 1, 'auth_token', '583fd4b6305ffb735ac8b6e0eeb792522c33a277014da625268e05fe764942b1', '[\"*\"]', NULL, NULL, '2025-07-31 20:47:05', '2025-07-31 20:47:05'),
(66, 'App\\Models\\User', 1, 'auth_token', 'd90254eab55919abee0260927587810174d23c8a63226324cfb329c69a35f1e2', '[\"*\"]', NULL, NULL, '2025-07-31 20:48:28', '2025-07-31 20:48:28'),
(67, 'App\\Models\\User', 1, 'auth_token', '04ee6ab947978a16b48c168c2c95a1afc1b40593fc5a7eea807a242cf87f86d1', '[\"*\"]', NULL, NULL, '2025-07-31 20:48:50', '2025-07-31 20:48:50'),
(68, 'App\\Models\\User', 1, 'auth_token', 'ea29895ad4a5a2251a83f17aaeba221b458ca418117723e905541284e4cb263d', '[\"*\"]', '2025-08-01 08:59:40', NULL, '2025-07-31 20:49:08', '2025-08-01 08:59:40'),
(69, 'App\\Models\\User', 28, 'auth_token', '082461beb744b148b113cafcd2906cc9013cee858eb17188b4b153ac172f30e6', '[\"*\"]', '2025-07-31 20:50:47', NULL, '2025-07-31 20:49:50', '2025-07-31 20:50:47'),
(70, 'App\\Models\\User', 28, 'auth_token', '55d273222c3d6e903ea727f5f4eb2d1213c3be30a8d96ed1ae81ee9f9c6d3d5d', '[\"*\"]', '2025-07-31 20:50:54', NULL, '2025-07-31 20:50:53', '2025-07-31 20:50:54'),
(71, 'App\\Models\\User', 1, 'auth_token', '107334b00b8097fd274a3341f48718e52939a27fc4e14a9b6cc1f5f95cce86a3', '[\"*\"]', '2025-07-31 20:51:55', NULL, '2025-07-31 20:51:04', '2025-07-31 20:51:55'),
(72, 'App\\Models\\User', 28, 'auth_token', 'fdec1ee0812324a3e3b1cb754866add6dbdb2abdc12c91d99867b7374937126c', '[\"*\"]', '2025-07-31 20:54:28', NULL, '2025-07-31 20:52:00', '2025-07-31 20:54:28'),
(73, 'App\\Models\\User', 28, 'auth_token', '011fb973346d506fad6db65ee493a097d1c54e0ce59de9dd59db6dafe3213e94', '[\"*\"]', '2025-07-31 20:54:39', NULL, '2025-07-31 20:54:34', '2025-07-31 20:54:39'),
(74, 'App\\Models\\User', 1, 'auth_token', '28a33c83b34bea8988ce165731cd29a8b39106142504499fe1c8cf9079698012', '[\"*\"]', '2025-08-01 01:42:42', NULL, '2025-07-31 20:56:12', '2025-08-01 01:42:42'),
(75, 'App\\Models\\User', 1, 'auth_token', '70da32fca535f2ec230db352fc553758f4dae24d55d30e9652afa611f4aea8da', '[\"*\"]', '2025-08-01 02:05:08', NULL, '2025-08-01 01:42:47', '2025-08-01 02:05:08'),
(76, 'App\\Models\\User', 1, 'auth_token', '6040ef0538fd0f1775ba6bb2fed0a1cd5715f268963307be83884be542b725ce', '[\"*\"]', '2025-08-01 02:17:33', NULL, '2025-08-01 02:17:06', '2025-08-01 02:17:33'),
(77, 'App\\Models\\User', 1, 'auth_token', 'b857358b205553ebf8cc9c3f4b84b91d8e0fb17565b9be1c3c1ebbba95d1eede', '[\"*\"]', '2025-08-01 06:15:57', NULL, '2025-08-01 02:39:03', '2025-08-01 06:15:57'),
(78, 'App\\Models\\User', 1, 'auth_token', '38428cd2e283334d2c4b06f3ecd5a770eafea43b4f87dd9e58b814fe2ebcdf90', '[\"*\"]', '2025-08-01 10:13:57', NULL, '2025-08-01 06:16:01', '2025-08-01 10:13:57'),
(79, 'App\\Models\\User', 1, 'auth_token', '8b6584bcbf3b45785323f41951685835dd5124a552634f557e10e47135599e2c', '[\"*\"]', '2025-08-01 10:26:24', NULL, '2025-08-01 10:15:50', '2025-08-01 10:26:24'),
(80, 'App\\Models\\User', 1, 'auth_token', 'de39c17d2789ffa0a0ed199af17f5250db7016a0569b45b62692f045c9a8c438', '[\"*\"]', NULL, NULL, '2025-08-01 10:26:28', '2025-08-01 10:26:28'),
(81, 'App\\Models\\User', 1, 'auth_token', 'bc780748b874d129812636411e80970c47a9700b916e77c23201d9f065e6a733', '[\"*\"]', '2025-08-01 10:26:52', NULL, '2025-08-01 10:26:47', '2025-08-01 10:26:52'),
(82, 'App\\Models\\User', 1, 'auth_token', '28a5a014c218da012108bde6d1544e34aa7f86f21dad8193ff9515a7761f5ea5', '[\"*\"]', '2025-08-01 10:30:31', NULL, '2025-08-01 10:30:27', '2025-08-01 10:30:31'),
(83, 'App\\Models\\User', 1, 'auth_token', '218d6d20eeb406fbdf0aba3764150462d8c66cc125d22660b419c79d3e842459', '[\"*\"]', NULL, NULL, '2025-08-01 11:04:22', '2025-08-01 11:04:22'),
(84, 'App\\Models\\User', 1, 'auth_token', '10f19422b84721e532db0497a7f88af0a343acffe9d8af233d0b5941c54c4f27', '[\"*\"]', NULL, NULL, '2025-08-01 11:16:57', '2025-08-01 11:16:57'),
(85, 'App\\Models\\User', 1, 'auth_token', '526a98876172bdeb6a88816b4264e5cf5be637a2c0d04b8421f7c21e02d356b0', '[\"*\"]', NULL, NULL, '2025-08-01 11:20:18', '2025-08-01 11:20:18'),
(86, 'App\\Models\\User', 1, 'auth_token', '576edad465c172c6641bbc5887249ee5e3711a469f5ce2b4d52f7504ea57b91a', '[\"*\"]', NULL, NULL, '2025-08-01 11:21:53', '2025-08-01 11:21:53'),
(87, 'App\\Models\\User', 1, 'auth_token', '9d472f38778f9bcbba4edc94f85f8905ddd76f092199e99aaf4dab3bc0cf6624', '[\"*\"]', NULL, NULL, '2025-08-01 11:21:58', '2025-08-01 11:21:58'),
(88, 'App\\Models\\User', 1, 'auth_token', '3633fe8024529d6e831e7db01d9374695e17ddb8544fc7b302e404243631242c', '[\"*\"]', NULL, NULL, '2025-08-01 11:22:06', '2025-08-01 11:22:06'),
(89, 'App\\Models\\User', 1, 'auth_token', '1744bbcac0ded727fd64783dba6e23103a3ee7c52bc8b45efcb9484bef1743aa', '[\"*\"]', NULL, NULL, '2025-08-01 11:27:55', '2025-08-01 11:27:55'),
(90, 'App\\Models\\User', 1, 'auth_token', '5241de5e6cbc68b2e4719b1f91c5d07b6eae7356e391e80e3496c3b209226ceb', '[\"*\"]', NULL, NULL, '2025-08-01 19:00:21', '2025-08-01 19:00:21'),
(91, 'App\\Models\\User', 1, 'auth_token', '57556bf45442453e7012818acd379c10f7c990e1bbbc3ba46381553de3be03b5', '[\"*\"]', NULL, NULL, '2025-08-01 19:03:18', '2025-08-01 19:03:18'),
(92, 'App\\Models\\User', 1, 'auth_token', '467ca790eb161b21b85c12ad2395a890cde1b05805f9f936fbd0d3634cefe1c4', '[\"*\"]', NULL, NULL, '2025-08-01 19:19:53', '2025-08-01 19:19:53'),
(93, 'App\\Models\\User', 1, 'auth_token', 'ea31060405c37786052559a52308065a04aa5c01fce909ce76a6b813b84da9cb', '[\"*\"]', NULL, NULL, '2025-08-01 23:45:25', '2025-08-01 23:45:25'),
(94, 'App\\Models\\User', 1, 'auth_token', '61ed00359b4ea41317694428b4049cac9872c14f5daf344bede8c1f54268a63f', '[\"*\"]', NULL, NULL, '2025-08-01 23:50:58', '2025-08-01 23:50:58'),
(95, 'App\\Models\\User', 1, 'auth_token', 'ab451a18f22ebfc6d7bbd78c5d71b416f480518590879a3996342c6b3a5b93ae', '[\"*\"]', NULL, NULL, '2025-08-01 23:59:39', '2025-08-01 23:59:39'),
(96, 'App\\Models\\User', 29, 'auth_token', '0327aa1315aa5ddd0ba5c05b5a1feaa2ac4c368829699e3f1ae6f384b87c4aa3', '[\"*\"]', NULL, NULL, '2025-08-02 00:13:24', '2025-08-02 00:13:24'),
(97, 'App\\Models\\User', 29, 'auth_token', 'b1fb79de556b801dec7cfd40ccb2b6c4f55e8b35bd6108b3ac399d5bee2b48c7', '[\"*\"]', NULL, NULL, '2025-08-02 00:13:30', '2025-08-02 00:13:30'),
(98, 'App\\Models\\User', 1, 'auth_token', '70902f1c137671cada46f443d4f2bb31f9be839aab375d8e44a19e87e47412d6', '[\"*\"]', NULL, NULL, '2025-08-02 00:13:47', '2025-08-02 00:13:47'),
(99, 'App\\Models\\User', 1, 'auth_token', 'c1394447714dc8c5d9f4f7cf7c36270a56f1de8f4ca8b5b0ba359fd82df428ec', '[\"*\"]', NULL, NULL, '2025-08-02 00:16:45', '2025-08-02 00:16:45'),
(100, 'App\\Models\\User', 29, 'auth_token', '42941f6e39fb6768a5f0f7d4cde7391bdacc1fb128b14bba9ca315b523d6a913', '[\"*\"]', NULL, NULL, '2025-08-02 17:16:02', '2025-08-02 17:16:02'),
(101, 'App\\Models\\User', 29, 'auth_token', '56ec92d0b24d527d3ee082003b12fcc45feec8acef3c954f686f16cfc444b0d1', '[\"*\"]', NULL, NULL, '2025-08-02 17:16:17', '2025-08-02 17:16:17'),
(102, 'App\\Models\\User', 29, 'auth_token', 'c445f1c31eda1ccb60176e0b4452f4ec21a0643be261140e3d06f1d7ae6ab452', '[\"*\"]', NULL, NULL, '2025-08-02 17:17:46', '2025-08-02 17:17:46'),
(103, 'App\\Models\\User', 29, 'auth_token', '5c5fb7639380382d331dbb82c430720e50167f8ce94571676ac24389c3ee07fc', '[\"*\"]', NULL, NULL, '2025-08-02 17:18:03', '2025-08-02 17:18:03'),
(104, 'App\\Models\\User', 29, 'auth_token', '20b6aefe92225f49a03bfde43520e04947b355a2dc360425babd9dac7a8a50f3', '[\"*\"]', '2025-08-02 19:20:47', NULL, '2025-08-02 17:18:15', '2025-08-02 19:20:47'),
(105, 'App\\Models\\User', 29, 'auth_token', 'e4dcd0eff1603e122ede9d2d6b0e7862ae1b6e40af140802f743337aef52fd90', '[\"*\"]', '2025-08-02 19:46:09', NULL, '2025-08-02 19:30:32', '2025-08-02 19:46:09'),
(106, 'App\\Models\\User', 29, 'auth_token', 'a1b27d08c395addbec7e8b7c023f6351957866cbd1975d32bddab7f0d91a46d1', '[\"*\"]', '2025-08-02 20:03:55', NULL, '2025-08-02 20:03:43', '2025-08-02 20:03:55'),
(107, 'App\\Models\\User', 1, 'auth_token', '8691157d9f347001ded661d30e5a4c216f2694dc56c04f4cb9bf8b7b829c1140', '[\"*\"]', '2025-08-02 22:15:30', NULL, '2025-08-02 20:19:32', '2025-08-02 22:15:30'),
(108, 'App\\Models\\User', 29, 'auth_token', '8119cbe86a02dd6dbdd86db4b7511a03afc0b9bc8ed2c6fca44c390ef8f952cc', '[\"*\"]', '2025-08-02 22:19:22', NULL, '2025-08-02 22:15:38', '2025-08-02 22:19:22'),
(109, 'App\\Models\\User', 29, 'auth_token', 'e3003d9f2af3e8e20fc2a4e67807635a5ad4ec5ae18193a51e83d7141caa4108', '[\"*\"]', '2025-08-02 22:20:13', NULL, '2025-08-02 22:19:26', '2025-08-02 22:20:13'),
(110, 'App\\Models\\User', 29, 'auth_token', '1cde38284534bc30955ea561ca3590e56360147ace8fcac60979ad9bd8f85c9b', '[\"*\"]', '2025-08-02 22:20:46', NULL, '2025-08-02 22:20:24', '2025-08-02 22:20:46'),
(111, 'App\\Models\\User', 29, 'auth_token', '69a02542d7d3f81f314ed326bcd3e6b7b40438910a1c6d4c66a4c443a2ac9231', '[\"*\"]', '2025-08-02 23:31:59', NULL, '2025-08-02 22:20:49', '2025-08-02 23:31:59'),
(112, 'App\\Models\\User', 29, 'auth_token', 'a5900cb5770f536fbae68ff130546e86a492f5cd7c96c92897fbe696e5bfcff7', '[\"*\"]', '2025-08-02 23:33:20', NULL, '2025-08-02 23:32:34', '2025-08-02 23:33:20'),
(113, 'App\\Models\\User', 29, 'auth_token', '5b219ce187eaa9b3cc67f3e8b4819b9853f1893396bfe525d20540c9e0c356ff', '[\"*\"]', '2025-08-02 23:33:50', NULL, '2025-08-02 23:33:25', '2025-08-02 23:33:50'),
(114, 'App\\Models\\User', 29, 'auth_token', 'bf316929fdb4b152628c768bdbd5734c4d13fdd827f52c54306d9cb8ea7f735d', '[\"*\"]', '2025-08-03 04:21:04', NULL, '2025-08-02 23:34:12', '2025-08-03 04:21:04'),
(115, 'App\\Models\\User', 29, 'auth_token', 'e548306fe6d0856948803f9dd218fad0fb904b12f7ab0450535c3cccbad3508a', '[\"*\"]', '2025-08-03 04:21:42', NULL, '2025-08-03 04:21:42', '2025-08-03 04:21:42'),
(116, 'App\\Models\\User', 29, 'auth_token', 'bde89f2144976f4429761a6cbb3ed7c0143d3ab3065e11674e5d7fdcbd736868', '[\"*\"]', '2025-08-03 04:26:25', NULL, '2025-08-03 04:23:33', '2025-08-03 04:26:25'),
(117, 'App\\Models\\User', 29, 'auth_token', '2d53e8dee65de63bbef15ebfd513457b0f7121ca3c1bc7e20bead47d7c152297', '[\"*\"]', '2025-08-03 04:26:50', NULL, '2025-08-03 04:26:50', '2025-08-03 04:26:50'),
(118, 'App\\Models\\User', 29, 'auth_token', 'ae303e820cef3019b60147ed30b0074c722a43948d70ae729373f742dbc134fa', '[\"*\"]', '2025-08-03 04:28:16', NULL, '2025-08-03 04:28:15', '2025-08-03 04:28:16'),
(119, 'App\\Models\\User', 29, 'auth_token', 'c57a15af030d427a30c92b2439630628bf57c857900c8a7c36b1a729080bc680', '[\"*\"]', '2025-08-03 04:29:16', NULL, '2025-08-03 04:29:16', '2025-08-03 04:29:16'),
(120, 'App\\Models\\User', 29, 'auth_token', 'eee1d4b306f4e268da321ba185e3732e362bb228e52ff4b6da41e819642823a1', '[\"*\"]', '2025-08-03 04:30:43', NULL, '2025-08-03 04:30:42', '2025-08-03 04:30:43'),
(121, 'App\\Models\\User', 29, 'auth_token', '417687c0a66e30e0fb050aee643c79d94d44d867c2f646a92ddff69d1a221cea', '[\"*\"]', '2025-08-03 04:40:53', NULL, '2025-08-03 04:31:26', '2025-08-03 04:40:53'),
(122, 'App\\Models\\User', 29, 'auth_token', 'ee0b52dc8b18994e2c4bac54bc1105b253a7fb3b3b5b737e1426bbf75116f465', '[\"*\"]', '2025-08-03 04:40:56', NULL, '2025-08-03 04:40:56', '2025-08-03 04:40:56'),
(123, 'App\\Models\\User', 29, 'auth_token', '2f6661856f3ee349a209c8cb7f598b1db30565c2718a5b812d9f36aa2535a78b', '[\"*\"]', '2025-08-03 04:42:52', NULL, '2025-08-03 04:42:52', '2025-08-03 04:42:52'),
(124, 'App\\Models\\User', 29, 'auth_token', '8e9d307c91e72001051fd3c416429a1fbe58337213a07d4f1449cf3fe1f6eb49', '[\"*\"]', '2025-08-03 05:09:37', NULL, '2025-08-03 04:45:50', '2025-08-03 05:09:37'),
(125, 'App\\Models\\User', 29, 'auth_token', 'afb2ec112082b0ed883f208bf9c8c2aaa6143f616407919b3af636cb5f29cae7', '[\"*\"]', '2025-08-03 05:20:13', NULL, '2025-08-03 05:12:38', '2025-08-03 05:20:13'),
(126, 'App\\Models\\User', 29, 'auth_token', '562379a42d092ac4e90ff2d87cf35f79d2c419bfc1201bb89c39f0bd7278e0d7', '[\"*\"]', '2025-08-03 06:03:43', NULL, '2025-08-03 05:20:16', '2025-08-03 06:03:43'),
(127, 'App\\Models\\User', 29, 'auth_token', '4c75c5d89ae645be711f8ff8e6f3501c19744537cf7388142f0afb3e8dfed500', '[\"*\"]', '2025-08-03 09:00:04', NULL, '2025-08-03 06:29:52', '2025-08-03 09:00:04'),
(128, 'App\\Models\\User', 29, 'auth_token', 'df89a65524f74f1ff645da09d51ea0e1005063b54da8ad255bb729048027f29f', '[\"*\"]', '2025-08-03 19:34:08', NULL, '2025-08-03 09:00:07', '2025-08-03 19:34:08'),
(129, 'App\\Models\\User', 29, 'auth_token', 'a1ce347e2e02d204a05d8357059684259693dde693fe8700abd2445892b1374e', '[\"*\"]', '2025-08-03 19:58:01', NULL, '2025-08-03 19:34:11', '2025-08-03 19:58:01'),
(130, 'App\\Models\\User', 29, 'auth_token', '0d5d48c627bdfc223316e29ca8c7459a5e50dc3c5fc62a15499092e5fd361eb2', '[\"*\"]', '2025-08-04 00:46:11', NULL, '2025-08-03 19:58:04', '2025-08-04 00:46:11'),
(131, 'App\\Models\\User', 29, 'auth_token', '7b5d5eaf49898396826a22adf72fafc42bf22d49b1a20c7eca64cc4f13ce10f2', '[\"*\"]', '2025-08-04 00:50:48', NULL, '2025-08-04 00:46:15', '2025-08-04 00:50:48'),
(132, 'App\\Models\\User', 29, 'auth_token', '6193bfdc25344f3d83425d3a9ee5ed45ceb95ea5de559c03e5eb38ee8ac060fc', '[\"*\"]', '2025-08-04 00:51:00', NULL, '2025-08-04 00:50:59', '2025-08-04 00:51:00'),
(133, 'App\\Models\\User', 29, 'auth_token', 'e9e3fba8c0feb6b04cd0395e25d0d29f57f29c8f0596c27feb15c578743c45e4', '[\"*\"]', '2025-08-04 00:58:00', NULL, '2025-08-04 00:56:14', '2025-08-04 00:58:00'),
(134, 'App\\Models\\User', 29, 'auth_token', '993890a2dd4c62f7394c455a5d4500a053ebe5692509c14bcc592d0541f84142', '[\"*\"]', '2025-08-04 01:05:52', NULL, '2025-08-04 00:58:03', '2025-08-04 01:05:52'),
(135, 'App\\Models\\User', 29, 'auth_token', 'a2aecab4844e589cc51227959a43713871e886fc62094ab5cacf73ed31aa193b', '[\"*\"]', '2025-08-04 01:10:08', NULL, '2025-08-04 01:08:02', '2025-08-04 01:10:08'),
(136, 'App\\Models\\User', 29, 'auth_token', 'd77d016f10f139a7bda3eb919a8e20fc7c055ac04f1481673174fbe3a0622c7c', '[\"*\"]', '2025-08-04 02:01:36', NULL, '2025-08-04 01:10:11', '2025-08-04 02:01:36'),
(137, 'App\\Models\\User', 29, 'auth_token', '5e8258161a9b2b65d3a42f16260710d5c54a66b6a0047d38d349ad3a1846918b', '[\"*\"]', '2025-08-04 07:14:05', NULL, '2025-08-04 02:19:28', '2025-08-04 07:14:05'),
(138, 'App\\Models\\User', 29, 'auth_token', '7b81256898e31c59562b273a3ce938aa8d96ac5b262418c27ce76133c6a62454', '[\"*\"]', NULL, NULL, '2025-08-04 07:22:55', '2025-08-04 07:22:55'),
(139, 'App\\Models\\User', 29, 'auth_token', '872f63020810a73ca91125c2d50e656a0802a3503c9ec6e17e80be19ce113427', '[\"*\"]', NULL, NULL, '2025-08-04 07:45:09', '2025-08-04 07:45:09'),
(140, 'App\\Models\\User', 29, 'auth_token', '4345f24deabff480cc0a96314d298f669a6944a7edac0bcb6be2a9b7befbe920', '[\"*\"]', NULL, NULL, '2025-08-04 07:47:53', '2025-08-04 07:47:53'),
(141, 'App\\Models\\User', 29, 'auth_token', '0ab12798f3ade45079d145fbc891473be19e456b83dcd524cccb6735acb2b126', '[\"*\"]', '2025-08-04 07:57:30', NULL, '2025-08-04 07:50:47', '2025-08-04 07:57:30'),
(142, 'App\\Models\\User', 29, 'auth_token', '926174b1797fd8ad1caac450ce52ca927327df357785c0947ae9ee159726042a', '[\"*\"]', NULL, NULL, '2025-08-04 07:59:22', '2025-08-04 07:59:22'),
(143, 'App\\Models\\User', 29, 'auth_token', '9c1e25abce3ccb619da95d69a627aa33285212bfd9ec25038b7eb97010859990', '[\"*\"]', '2025-08-04 08:06:09', NULL, '2025-08-04 08:00:05', '2025-08-04 08:06:09'),
(144, 'App\\Models\\User', 29, 'auth_token', '8cf1b507ccd1a284efb81d753ac8ceceffb612dddfa2fda58eb90a5d744b5c8d', '[\"*\"]', '2025-08-04 20:01:43', NULL, '2025-08-04 20:01:41', '2025-08-04 20:01:43');

-- --------------------------------------------------------

--
-- Table structure for table `products`
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
-- Dumping data for table `products`
--

INSERT INTO `products` (`ProductID`, `CategoryID`, `Name`, `Description`, `Image`, `base_price`, `Status`, `Create_at`, `Update_at`) VALUES
(1, 1, 'Bàn ăn gỗ tự nhiên', 'Bàn ăn gỗ tự nhiên mang đến vẻ đẹp mộc mạc và bền chắc. Thiết kế tinh tế phù hợp với không gian phòng ăn hiện đại. Dễ lau chùi, đảm bảo an toàn sức khỏe cho gia đình', 'ban/Ban-an-Go-Cao-Su-MOHO-OSLO01.png', 6000000, 1, '2025-07-01 22:42:19', '2025-07-11 16:59:03'),
(2, 1, 'Bàn ăn Gỗ MOHO GRENAA01', 'Bàn ăn gỗ tự nhiên, phong cách Bắc Âu', 'ban/Ban-an-Go-MOHO-GRENAA01.png', 4200000, 1, '2025-07-01 22:42:19', '2025-07-01 22:42:19'),
(3, 2, 'Ghế ăn Gỗ Cao Su Tự Nhiên Milan01', 'Ghế ăn gỗ cao su tự nhiên, kiểu dáng Milan', 'ghe/Ghe-an-Go-Cao-Su-Tu-Nhien-milan01.png', 900000, 1, '2025-07-01 22:42:19', '2025-07-01 22:42:19'),
(4, 3, 'Sofa Da RIGA 2m', 'Sofa da cao cấp, dài 2m, phù hợp phòng khách hiện đại', 'sofa/Ghe-Sofa-Da-RIGA-2m.png', 7500000, 1, '2025-07-01 22:42:19', '2025-07-01 22:42:19'),
(5, 4, 'Tủ bếp Kitchen Premium Narvik01', 'Tủ bếp gỗ cao cấp, thiết kế hiện đại', 'tu-bep/Kitchen-Premium-Narvik01.png', 12000000, 1, '2025-07-01 22:42:19', '2025-07-01 22:42:19'),
(6, 5, 'Tủ giày gỗ tự nhiên', 'Tủ giày làm từ gỗ sồi tự nhiên, bề mặt sơn phủ bóng mờ chống trầy xước. Thiết kế nhỏ gọn với nhiều ngăn tiện lợi, giữ giày dép luôn gọn gàng và sang trọng.', 'tu-giay/tu-giay-cua-la-sach01.png', 5000000, 1, '2025-07-05 15:34:44', '2025-07-05 15:34:44'),
(7, 3, 'Sofa tối giản', 'Kích thước: Dài 200cm x Rộng 82cm x Cao 80cm \r\n\r\nChất liệu:\r\n\r\n- Gỗ cao su tự nhiên\r\n\r\n- Vải sợi tổng hợp \r\n\r\n(*) Tiêu chuẩn California Air Resources Board xuất khẩu Mỹ, đảm bảo gỗ không độc hại, an toàn sức khỏe.\r\n\r\n', 'sofa/Ghe-Sofa-MOHO-HALDEN01.png', 7000000, 1, '2025-07-05 15:36:27', '2025-07-05 15:36:27'),
(8, 6, 'Tủ quần áo 2 cánh có kệ gỗ MDF phủ Melamine', 'Tủ quần áo 2 cánh được làm từ gỗ MDF cao cấp phủ Melamine chống ẩm, chống trầy xước. Thiết kế hiện đại với không gian chứa rộng rãi và nhiều ngăn kệ tiện lợi, giúp sắp xếp quần áo gọn gàng, tối ưu cho phòng ngủ hiện đại', 'tu-quan-ao/tu-quan-ao-ngan-ke01.png', 5000000, 1, '2025-07-05 15:38:32', '2025-07-05 15:38:32'),
(9, 6, 'Tủ quần áo 4 cánh hiện đại', 'Tủ quần áo 4 cánh được làm từ gỗ MDF cao cấp phủ melamine chống ẩm, chống trầy xước. Không gian rộng rãi với nhiều ngăn chứa, phù hợp cho phòng ngủ hiện đại', 'tu-quan-ao/tu-quan-ao-bon-canh02.png', 8000000, 1, '2025-07-05 15:39:15', '2025-07-05 15:39:15'),
(10, 7, 'Kệ tivi phong cách tối giản', 'Kệ tivi sử dụng chất liệu gỗ MDF phủ veneer kết hợp chân sắt sơn tĩnh điện bền chắc. Thiết kế tối giản nhưng tinh tế, giúp không gian thêm gọn gàng và hiện đạ', 'ke-tivi/ke-tivi01.png', 5000000, 1, '2025-07-05 15:46:42', '2025-07-05 15:46:42'),
(11, 8, 'Giường ngủ gỗ tràm tự nhiên', 'Giường ngủ được làm từ gỗ tràm tự nhiên chắc chắn, bề mặt phủ sơn PU chống ẩm và chống mối mọt. Thiết kế đơn giản nhưng tinh tế, mang lại sự ấm cúng và bền bỉ cho không gian phòng ngủ', 'guong-ngu/Giuong-Ngu-Go-Tram01.png', 5000000, 1, '2025-07-05 15:47:53', '2025-07-05 15:47:53'),
(12, 8, 'Giường ngủ gỗ sồi', 'Giường ngủ làm từ gỗ sồi tự nhiên, xử lý chống mối mọt và cong vênh. Bề mặt sơn PU mịn màng, tạo cảm giác ấm cúng và sang trọng cho phòng ngủ.', 'guong-ngu/Giuong-Ngu-Go-cao-su02.png', 5000000, 1, '2025-07-05 15:51:37', '2025-07-05 15:51:37'),
(13, 9, 'Nệm cao su thiên nhiên', 'Nệm làm từ 100% cao su thiên nhiên, đạt chuẩn an toàn sức khỏe, đàn hồi tốt, hỗ trợ nâng đỡ cơ thể. Bề mặt thoáng khí giúp bạn ngủ ngon và êm ái hơn.', 'nem/MOUSSE-ALOEVERA-SLEEP-01.png', 5000000, 1, '2025-07-05 15:53:50', '2025-07-05 15:53:50'),
(17, 2, 'Ghế dài gỗ tự nhiên bọc nệm', 'Ghế dài được làm từ gỗ tự nhiên chắc chắn, bề mặt phủ sơn chống thấm. Phần đệm ngồi bọc vải nỉ cao cấp, tạo cảm giác êm ái và sang trọng, phù hợp cho phòng khách hoặc sảnh chờ.', 'ghe/Ghe-Bang-Dai-Go-Cao-Su-Tu-nhien02.png', 5200000, 1, '2025-08-02 17:43:16', '2025-08-02 17:43:16');

-- --------------------------------------------------------

--
-- Table structure for table `productvariants`
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
-- Dumping data for table `productvariants`
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
(19, 1, 'SKU-687142d72f68f', 6000000, 15, '2025-07-11 23:59:03', '2025-07-11 16:59:03'),
(20, 17, 'VLINE-602-KEM', 5200000, 10, '2025-08-02 18:16:47', '2025-08-02 18:16:47'),
(21, 17, 'VLINE-602-NAU', 5200000, 10, '2025-08-02 18:16:47', '2025-08-02 18:16:47');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `ProductVariantID` int(11) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `is_main` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `ProductVariantID`, `image_url`, `is_main`) VALUES
(1, 21, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_1.jpg', 1),
(2, 21, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_4.jpg', 0),
(3, 21, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_5.jpg', 0),
(4, 21, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_6.jpg', 0),
(5, 21, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_7.jpg', 0),
(6, 20, '/images/vline602/ban_an_go_cao_su_tu_nhien_vline_602_1.jpg', 1),
(7, 20, '/images/vline602/ban_an_go_cao_su_tu_nhien_vline_602_2.jpg', 0),
(8, 20, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_8.jpg', 0),
(9, 20, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_9.jpg', 0),
(10, 20, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_10.jpg', 0),
(11, 20, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_11.jpg', 0),
(12, 20, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_12.jpg', 0),
(13, 20, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_13.jpg', 0),
(14, 20, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_14.jpg', 0),
(15, 20, '/images/vline602/_ban_an_go_cao_su_tu_nhien_vline_602_2_15.jpg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `review`
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
-- Table structure for table `sessions`
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
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('07RxhOJauoJStivfwBeU3VOjgwmshzXH0Hwyf94N', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaUtWN0g0dXRTa1Nud24xa21GR1BHQ1FmR0xrNjYwRGRWamtZVXdtVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753456976),
('0mmXBGTKqh6KY1PZaATD6wPIgXGjzOt4ggVgvLxW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaExRWXdSMlcxc1B0T1liaWtyOG4xN3JXYjVRM3hJOVN6ZXBWaklZSiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753374085),
('0o0X8hkI8liIJajuryIJquXnKJ35Sf8pt6t783k8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRFR5MW1ra0lsVzRjdnNDdzBwVjFFT2JLQ0pJcHRSNXZ0dmpnZWd2TiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753452195),
('0ZlnQlJeUxkpvaocbLhUQPFHi45jRJDNJTz76Pz4', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMnd2bmpycVdQWmRKNFRoc1Zqd0JtZG9PTGtERFIzb3BMaUtYUTE4cCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458182),
('11KRlXpjQXl5ZN70FQBHtVKYg16vsK6rUG25vgcW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidldCQURtQjlJQ3I3SVAwWVZIZVg2TDVQMk0xVVJ0QlVzOTQzeXptYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458453),
('1TedUFE2LFfx7uPSKy3yhZx2OGPvuv91dh69viyE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZkU4bkxuMXhNOTdmcUxlemJkSVZTdU1ETDNUMGJOWlJhaVJPVmR0ciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458259),
('3Gc4oOimm8qvhqEE1v5QczANaPFFRNsKjeJqhDyC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicFZyTnRUQjNRVUFYZG9LbzNhenc2YTJ2cFhZZ1FhNG9HRlVMUUplTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464362),
('3RKlvzIiGtVgl69pSXIkeZf3RNXvexweZuJDCtBS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ0NxMU8wRjFvTHJCSFJIczlJWU50RFhqcnIzN3FHeGpnbW16MlY5VSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753453812),
('4hj0hjvnHBsWhOgb5y84TaixLShggPbT4qtYaRev', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRUc5cnNJYWNLMjUwMFNkeTNrS0Q1Wm5BYWRzR3hHY29ERHp6bHFSaSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458444),
('56IRVL22woP4hpMvyG2vTCDAFMZQ6WXVHAdSH8KR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiekdrelhTU1R2WWQ3Y0F4R1pISVBmREJNMTBsdUtZcnpPUmVCa0xHTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465574),
('5ds9gQtxJ1NmfNWQINfiCTLYXCJYNMkEIqI3uqjl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUFZtVlZKOU85TnZjNGFmNXR2VlFSSEtmMVdBdE1hUDVjYmdCN0IycCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464176),
('5o2tWZG9eITqUBkeAAxqtvBG6escFyjan1sUm6N5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNnhySnJpUkhMNTJDNnVQYjdFeWRaeGcxeVdqNktJMXhtNE8xWEtkOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465219),
('5UwJ7km7gXhdAArX2dBmDxww9n9rFrhcr37f0Qrb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaWgxZUkxOXJCNDEyTW5zT1pzYkpINFFyT0x0QWoyNEtwTk44clNsMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464150),
('6KDesJsrmvZBKiQqHEhftzloqSMtixkpuboQP2yf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUprQVB4aTdNUDNXYVpXSWdMd2xreWdJbHphS1dyQWNleDhQYUFLYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753453828),
('7gO3Fzu6eZ4ePxeyfnx7cv6ZhXK0WWNW8cbTMxYr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOTRlUWJxOVZnOWVuQ3NzMVA0bXBNc1ZZSnFLM0JKN2tXYzZpTUR2RCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464153),
('8OducLZBpHbXEWYKGhCrh4PBA5q7dKuEnBsXeSiM', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMnRwajlQbFlXSGx6R3pORlRUeXNnWGRMSklZc3hDd1Nnc1ZZMjF1aiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465234),
('A5bvTkZN1xjosH3uMqpR9Px1MkJdAib7Tm41j9B8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWFlXSjdPbkp4ZGFxUUkybnIycE9IODF3SjVhRXRWSUxJQ3R5cFhOayI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458426),
('BA0P4Is7brhzsDjxuQ600A5Dr6gNbiwg6NkbWP14', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNkYwVVAyWFYwWFNwbk55aksxWFZKaWliNEN5RWpqd09BcndqaGNtTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458191),
('BaIVxAaBr14ncmBe5dLuJ6lZkuhngpM4bta1K1ry', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieTVpcjZUQmRVaEhCRFIzMjZxaGN4YkROWTNFV09KS3R4Q2tVTGZ2dSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753374207),
('bYdaEMDjs2eoiHHxKsgYa4lafsXGE0aMQ830MSKw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR3Zmc2VoZnZpNHo4U29LMUhlMlRZVFFNMjJGTUUzT1YyT1VNZDRKUSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465791),
('C8X0BHrkcDWbX7CTLsrvxCAImXvuNId5Qd094fGD', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiblBQZm9mQ2EwZ1ZFN1dNbUFQeWhJeldiV1JBemNubGJLQjkyZkRhayI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458197),
('d4qWuuNSgFNoS2CezdXuDe62OdBfodEU42JpST6j', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaGRxWDR6akpEU3lwTTYwbkFDc3FQYmRTaVFLalFpTFpibTlWUVlSRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464155),
('dQ3gqEHKM8Lml0l6SM9SkfrWEhdEBCJ8KZjfQCn9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVGdzbGhVbjNVMzcxeGRObEhSWlNLUDFFZXVnUVNUWUNBNDBueExrSyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458266),
('dSDJ6UYlJRsNGMxSf8S9FIq30Ro4wsPTWhBjzwU6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSHJDNW5oUFh3VmdOQ09YU212ejdGeXVaTkdRQThSeUhaNzVjYXUwZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464914),
('DtJFdzX2JXa74QHEAhYJADyfjMuzPkQgebVASBdC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYUcwWTVsUUtMbXFwYjRaQ1BUVFZsRlFHcldNQnNWVHpaWmZrUkFuaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464573),
('dZZGnA4xvjmDCXMqZoqn93at4IETHVeq1JFnxjqu', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV0p2YUNSYUhDZkliUW54M0xLbWtCZnFIeGZKRVR0SFdDc1dzZGF0UCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458203),
('EluSOOS6cNB82TcY4gq0P8TuMANn3cm3ngSLPNWV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZjNmSHp6amNSOUN5RHdJU1FFVXpOdnJXVTZIMXQ2bzhvOWFhN3pwZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458396),
('fb96DlHYfvs36WUQ7TPZF50x8xlYTshNKAHwKUcX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWFdVUkxqQ1Bvb01wTVdJY3pkUlBCak9GQWpFbm5iNjMxWjhOdWJTRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753455756),
('FBlaAP4rOWZLlTITDSkURes50E4zcbMBKNEIsRCS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV1g3R21SM3ppOTM4cWl4WVVOYmtPNTgyZHJuNlZhdWhWQjVwa2NwTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458262),
('GdlSnaiyqQxtNiPognpPHjnoedda609yjQz5f8PZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidUlOZ29OWUZqZEhKV1pINUlVTkZRdnhhUTMxMFNlRzluNkZYaWV5SSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464928),
('gesb2ktEsDUAX6yC213tqzuJKPVTpvNHehq42Byo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiczZtZWlhUTdMUUM5Z1ptNlFBUUk4NGZZS3ZBRkZ2QXk1a1VkYzVaUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464908),
('gF6gH1Nu8gI56nX337CizW5q49xEuw9XnExX57N9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidEpOWXJ0cWViQjdncGNTSXVxZ25WVDI4QXpDWEMxaDZUYjYwMmttbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458398),
('HdHSNraEzEKr4bzk7gATKT3CUD3tt13KvB4mWBr6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHpMVlZMaEhVT0taNmlEenBxdGl4VEY2QXIyZDBQSHVFNFpJaVZWNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465994),
('HuNM0hrJD8gijxYCdWpJbhcibz7cRCUOthg77m2m', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUnUyT21WTlZZMW5JNERmMGxlMXNIdkpmTmFZOG1LdjU2RkdHRmdIVCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458205),
('IbFXaYGhQUTSHJAr8ywtKy0p3ibZDjiN1jXagIPr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkJVemo2OERsam1iNzlJWTJnWUxMMUpyb2VOZFhJZks5STVaNjZCYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458429),
('jCa8GyhCeMpV9NCmbs64vOpYm4Sn9wPsy3hb3Xqg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicEplSVAxR0duYzZXUnhjbHJYRVR4a1VKSlNhcUs4VWxTZVhUamlPcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753453808),
('jEIk5EMwXrml8rg0ygrB34seE4sDGfE0U2HKTY5R', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSDYyZFJzSk1vcVVzaXlRVDBXSHB5OVVzaHg1T0JDMzVWUURSRkxKcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753466341),
('JIJBM6oKBjr8bgLdRzPPDtyKUgWaI1SjULFwrMMw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMzRGSm5EVzFFUGtpWElpeDZZQ2J6V0pSSXp0d0hxRHB4dGMwQk1EOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464585),
('jRsjhWWAX600b7KDYBpYLUwGH4djLu6DrvjhZdIw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSkZsNzlTaFppR21ZVjhUeVZTdnlZRGdJaEkyVENNQ3F0bU41MEh1OCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465240),
('ke2y40T3q5b6dJg404DojRXzE6TOyKkEAbZhrYPD', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ1BLQThhakY2aG9CcGlwbEpaVDVGdUNxZEpab0JTS01kRGJnUWpnSyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465259),
('kF3UHONnyRp4yTJQsNjX8bbJ4bnA5vgeR2tim60p', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0Q1d0o1MTFkWERZQmtSZm1VaG5BVTZSR2NZbnhJNEdwWW9zT2daRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465197),
('KhT5vH3yvFRLFmkjeqWb3w31uHY4RMig7qEmR1S0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN2JZeGp4VDNTeGk0b0t0RHlSUWs5V1o4Z2h0VmJTaWZUbzZYTDNSYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753453421),
('kjEB70p2lu9oYlkfkTEAvYRogf9Zmw3cHMx9o0J1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMzRGaEJ3WW81dVZYdFpqNUUzS1NZd0Z3OFVQTkFaZGg3Y0JZdmY0UCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753460637),
('KpWAmGoVETzvxN8nP71LA1ZsuV8M8WEB20ykjnUc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMTltdzNHVGU5UG1ya1dZalF3cEhoNUJqTWJUSmo5cEkxRGdsN0pMUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458399),
('MgaO5AtND27eRWA5vFXOqNbqeVmAVg76taQvDMpM', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV0ZkSEl1elBoUThTWHBuaEpMV211R2NVVW5FRnZKQWhtMkNoRENMbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753463893),
('ML0VRXhUcNfouoXMLhpMZ3wUYMCDCOFK5PX1c0mt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicTlJYm5UZm5oZFo1dndNOFNKYzNJc1BncktkOUxHNnhhN1h2b29tUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464358),
('MsKlLmA1ZuzhL4MY1jhIAppNP2LOJtci4jVd8vez', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQWZFR3hkNFlDYmNBcHhnRTFVYThjRVhkRUVUN3RlbzNnZDFrUmlnNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465809),
('N5RHTvBkqv5pPvmyDk2rPVwmCEThuxDQA0ynvLnN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS253Skx4NDdkOXRzMGRiYnczM0gzakE3S2U2S083MTZhVjJCQ2FJbSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458257),
('OFYeBAO0hz9fuICD4eoMwkQ4CElb2HT8f6DL3WWA', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRExNNHJXSFZZOGw5b2wwaGJhNzdqMG9Iek1mYUJMM09tamd4eHlONiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464074),
('ojeXLmVBJRxVaINXKltfqIvGOefNXXgeBvH3K0ON', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZnM2Y3ZTbHFxVjMyUEVJT3FrdUFEU1J6aEtnWURyRWFMWGY2WTgxVCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753456149),
('pFiLmJCR4fuYVGetORxifOs7wvNNFIRLPVkDb6ro', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicDVEWG02Y1prM2Z6Y0FvdmlMSnV6anduRHMwYXpiNUREcmNNSjBKUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753463944),
('pONZc1ISYvzXGz0GTuPCqdTAdajNiiDWO3nvGlWf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVGJTNWZzY0ZiRnVrZ0VJNmFnRE9IMVZwMGR6RXN2SXFycEsxUzRqWCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458505),
('ppvYQuxUqM2Uoa9JgruxHf3O88noPhUy7QXd6Be8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibkZCZDN2WFlPZ2ZEZXM1VWMxRkx5R2swS2pFVnBrNHdxWjUwalpnQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458207),
('prlhNTPO2AXcR9BEnHgfDOUl32mMHcnjguwezLgo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicGl3ZHl0YmQ4OVduZmppU1ZJWlZGVHBKdWRjQVRXbnZnT2Q2SEoyNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753463937),
('PuLzjmmHzSetmOegCIPqN48HJIfstatmMa5Jvfp5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicDBSNXhBelplM2M5VmFSRWFMb2VoY1pBaDIzSGhsd2RqSFc2cmdRVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464239),
('PZyiua1v8stvu57SC5SjnhOHIGNjlZ2brN3ZG0ju', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaFQ5TUVhYk9BZWR2VXBmUDljNTR4Wnd3bXNVcWJtcHNQdEswRTVldyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464302),
('q7SGGJycTPSpEDc4Lkvx5cwY7zokTlDgW1gyXtlt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTW1nTFY1N1BEZzVUTnFqbTc2dWRTeUtub25xUzg4QVJMc0pQM2MxUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464231),
('Q9jPfjEHzYIoaDoEjT12fNvfdwTn8Ld2v0jepzCc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSmRGcmR6eWZzWmxpY04zSHBzYkE1VHBRTm9JVmpvSjVlOUhJY0pkeCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464149),
('QeT6ZdgAiFaSsgIA3bQLfQfXbVUTJBJGhwcL458j', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTW1PbGRzWHdLZHU0U09LZVhjZ0w4OFNxNHA5Y0RMS0tHOFEyeWQyVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753466130),
('Rd7CiDmUZ6GPgHxRc3uAqkzb28ItwvNhtYQsVQIR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZjA3enhKdHdnQ2JFc0g3VDJ3TXFXemllbzdoblhKbTFKVFduallCUSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465762),
('rHaLzEDBoHXdpiIJV8hmM8dMj36oMx59o9AkBEgr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTUhhblBuVFdnVkhuRFhRVWdGRzRvVzRDVlVWMVNkQ050RlNzcTNYayI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465216),
('s2aQNsuJN4xcA1FyEaXE6yC1yVCzGFnSm4ehCuB8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoianQxb0pHSUpQVjF1b1VIUUtvNmZRdHRsTVBLZGVmSWU1NkVDdExlbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458499),
('S8nLs5yZ5Yi9IL3rwuZmhAZm9lRPxr9S9nstUWKS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieXBRUnhSYWUyRFNWd2ppdWUwMDMxSDNHMlFXbTRFSGdDRWhrWGlleSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465794),
('SkDH0EZwuGqvTLl6AsGCOlqwRr8SUVoXhlZtYUpc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVk84VTZEY3VXRTFaSFRNd2pRU2FnQlpWbkh4NG45cVNUYzBEV0Z6NSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465997),
('smWtyNMNtJ5wudYua0VnSyFihaiZOOULN0DkTFJg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNVlZREVUVmVPTXltVHlTVGNzczRFcEJ4NmlQVlZOcHdoMFhoeU9jQSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465889),
('SpWo4XCCSI62phxpzPAfBHC3mmaPB4iPi2WcTeVw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOW1KWXdVUnFyNjJ1WUgySXdxQ1pTT2lKeURmd3MxWXZIMXlQdGs0RSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753457825),
('SSM6qhyCSntusTEb4Z9RhLA4HVUZQxnz8u7TVRJg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRm5mc25ZRGFkdHhWNWkxVHJyT29KSXoyR1pQdEhpMkxzNGZGWjVkZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753373567),
('thQvRPytmWNjDRGTJW9SQFz3uZocDJnhp92ztXzq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVE0xOHE5MnhablF3ZEtBUTR1ell0WWlXQ01iTnhXZHhGMFZXeTJRYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464153),
('TTG3YhHaWccSSsgg7OAcVz5yNHcRq8isaUXVpggB', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWFU0YkZmWFk3ZFR6MHN1bkRqVTc1aGlXeDZwQWlUNzhoUUpPdHpYVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458265),
('uHzdDwCca2aW3c0VQSRAG74xDU83812EGKBjq0of', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVVZqUDlZZTBrUDRBeDlLa3Fpa0tiOWhSdE5XaFF0ZDB5M0dVOGM3NiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464135),
('UsGtW9kmEgZPZWftW4VFg8BEwd42W0qplKABEWc2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVDZkQUtGbERSUWpCWkUzZk43VVNuY3VEbGtuUkRaUmxEMGRXY001YiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753452151),
('USkl6F5RwvKQZ91TVcf9gRETpZrLn7lsztf6X4tl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidVdEU0FJamVsVzdsNzd5RWlwUUdzSzVvNHp4SGJBQlpJOEJmSndUTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753457973),
('vvGt1l9NBVVNNM6AWPgzhmjcOuNeqIHcd3yHWKE7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN0M5b1lRWG9abjBiTmxGNGwxcXNBelRhRFNWQ1poMEtEcEU4Wjc0aiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753373598),
('WbH9Nu2yCUOHPmw6WrpZYniNAm4Ld6eL1NVfX2Gh', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidUdKVjdsM1ZlTTZmdXU3aTlWMU1HemxROVRvUEladUpRSGh6S2ZsZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458200),
('wHxeY6P00xbDuSo70qDZDHJwHtCcS2GW8rpNtHEE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQjZlMUNnQTdmTGl1NGE0VEx4d2M2YTZsODg3Sm4wQW40Q09VUnJkeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465803),
('WjTI3zJyM3gMCoxByX9tUM5GF3JPDeeOnMImvTxd', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYVJ5cmZEVXlXSFJQYjdNekZLblFYNXI5ZHhEbXpYeXJYVlFvRURIeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465253),
('WkxMrBDkrpKSwClhoHb1u1rWNIEsRUAifjW1cWbb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ0dHTHNGbkJmOWR6RUdLN3RTN3NuTW80bXYwUG1peGtyTGt0OUZUUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753462594),
('wRXfIbS9OhAwFGQjZb5yWcKr6UyCG3ylzXc1dUFA', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSnZKWWxvSXVuRWc3bzd1aEwwU1dFb01oWlFwemJVQ3pqekdmUVF0NSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464302),
('WXWphfVDLpZBHtNAk7DS81usTuvOsygNFM8TIUYy', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUW5UVG9rRzVLQ0ZyUG44VVZQeklqdjlNZmVXWHZpM2NIajlYcVF4NiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458251),
('WYCzfClvzTSzCJ0dXB6jCBdky0G0ELBb2g8rbHkk', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS3NjUEZDekxCTEk5Y3VZbmFjNXNVVkNNdjE0SDRZWFRNb3FKVXpvUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458240),
('XAiHrmSwd1hb4zuGnLwmIuVnnv6RRy6ItArBIRL0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicnBKTmpZU2plZ21IRDJBZkdLNGNxVWQza05wdkpJSTRzbE44Sk8yTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464894),
('XBRamniE7mGGzfoShnr9AH7I52YBPYChRure5E5w', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicjM3endFSHBlVGw5OUJDUTY0MWZNMUlaSHpERmZ4dlNLQXdSb3p1eSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465797),
('Xh7DvTvaRnKmRlFYWkeDgcOPaop0pGKKBRqiVFK9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZHRjeE1YUEpZQ2FrM2JKNzRTeEZGSkNpTzNZajJkenhYaFNqdE5XciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753453696),
('xjksVvvtwJNV3ak626AX0IhzZzOBZffQCSxy3y1x', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSHJhSU13M3o4SWtnMFFibUIwY0wxTFVCN2lIamZyRG9OY2o5bEZkVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464586),
('XSTgtNTB2NHes37aD5R3ksA8RBVQiPHASTF524nY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0NxT25CbU0xbHRYSWpDeExUTnVlazRzU3BmV1RRMjV6OVVOd2NITSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465806),
('XXxGYcKXK25oJ7xrfy39hGvE57TbJj3XaybfhZd9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibGpTWUlwTlZiY08wdnVtVktFaE5nMUh2UTZicUdpVGtHRmREMndzaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465225),
('yTVz77X1kTxaj7AXQ7lK7XeEjNyflMiG8UeJlpMB', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoianZTOGlPcXhKeVFFQURFVFR6aW1nVzg4WnJGVzZYZWxIaURJS2M4MCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753462604),
('yxXHpPLAxuJwdeVey8P6Oj8CSEDUWt22FmzYqv0c', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaFIxdmZaTFpwUHliRWRmSTNPNW9nQmJmcFJsSE84UHQ2dEVpUFR3WSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458446),
('Z2w10P2Sjb1ACH4P5UJymHI23TagnEMrwRZUasc3', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid2ZySXdjUUxlSGtFdFlBNnVGVXpzSENVRHJweFBJZEptRGJucXdvRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753458149),
('zcwauvUuP5fbS21hh5UbgfmVmozffjnxuIquAIdf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVnRGOVB4eVdUSVp4cWlDSzc2c1JKU2YzanZxVkV0UjNLeFIxd0V0ciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465249),
('zo70HkrknLHGbTaRH25Ebw2GgLbVcaFSoHhiQho7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid0FsWDUyZjYyNmRHSTFvZDRtYW8xdXRLT0JXdVczT2NRQjltbENCRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753465890),
('zwqaum9WuzVflc3y3q4j44J5hvAEyXjoEKpzcnIM', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicXFFNExCa05VcERqdUR2V2tZSEJhYWxOZ1VzMXhlb2o0SmhMclJoSyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbmV3cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1753464292);

-- --------------------------------------------------------

--
-- Table structure for table `users`
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
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `Username`, `Password`, `remember_token`, `Email`, `email_verified_at`, `Role`, `Fullname`, `Phone`, `Address`, `Status`, `Created_at`, `Updated_at`) VALUES
(1, 'chauchau', '$2y$12$Ywmq1ViGmO2r/YTJdkmm1uBqUZIzfoHPPoR0aCm0StR65ON8R6w4y', NULL, 'nguyenvana@example.com', '2025-07-13 17:06:12', '', 'Nguyễn Văn A', '0987654321', 'Số 123, Đường ABC, TP. HCM', 0, '2025-06-06 14:55:57', '2025-06-06 14:55:57'),
(2, NULL, NULL, NULL, NULL, NULL, NULL, 'Nguyen Van L', '0123456789', NULL, NULL, NULL, NULL),
(14, 'nguyenvanchien', '$2y$12$L5VNH3JnJtJSY1T6vke9Fe8XGNY/IRF0ygGjUxP2dOK3tlfAfzkpe', NULL, 'chauttc01@gmail.com', '2025-07-07 15:38:04', NULL, 'Nguyen Van thanh', NULL, NULL, NULL, NULL, NULL),
(17, 'nguyenvanfy', '$2y$12$cod1X9/hB0FD85CYiOHcquekn7F0j2aKDB4601d7es9ulw7r3rD.e', NULL, 'nguyenvanfy@example.com', NULL, NULL, 'Nguyễn Văn fa', '0123456789', 'Hà Nội', 1, NULL, NULL),
(18, 'nguyenvanchau', '$2y$12$.uAFAM2gwbuPOZsBP4hnVeLgK8q7FEEtK4RHcQjs13DnDFTelsWyW', NULL, 'chauttcps38292@fpt.edu.vn', '2025-07-12 14:49:27', NULL, 'Nguyen Van Chau', NULL, NULL, NULL, NULL, NULL),
(25, 'linh123456', '$2y$12$ni.2cUEGahjjRpPXshw6feQacB3ZOj8.wIoWh06Pb9aZcOCBF5KCu', NULL, 'linh@gmail.com', NULL, NULL, 'linh', '12345678', 'hà lội', 1, NULL, NULL),
(26, 'chau123', '$2y$12$9TT6ammCpIFSvsZHisHmBubS425J3XScAFHNz0v53.y.sh6DS8jqy', NULL, 'blambxx@gmail.com', '2025-07-13 14:28:20', NULL, 'chau', NULL, NULL, NULL, NULL, NULL),
(29, 'kiet2060', '$2y$12$Ixts3Qe4DlzQ/z0jLtlYR.n72Tbp.Omvw0Xi.gvtK7AqPCxgXqZXS', NULL, 'dukiettruong955@gmail.com', '2025-08-02 07:13:22', '1', 'Trương Dũ Kiệt', '0987654321', 'Số 123, Đường ABC, TP. HCM', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `variant_attributes`
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
-- Dumping data for table `variant_attributes`
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
(28, 19, 2, 'XL', '2025-07-11 09:59:03', '2025-07-11 09:59:03'),
(29, 20, 1, 'Kem', '2025-08-02 11:24:48', '2025-08-02 11:24:48'),
(30, 21, 1, 'Nâu', '2025-08-02 11:24:48', '2025-08-02 11:24:48');

-- --------------------------------------------------------

--
-- Table structure for table `voucher`
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
-- Dumping data for table `voucher`
--

INSERT INTO `voucher` (`VoucherID`, `Code`, `Value`, `Quantity`, `Update_at`, `Create_at`, `Status`, `Description`, `Expiry_date`) VALUES
(1, 'SALE20', 200000, 20, '2025-07-03 22:59:41', '2025-07-03 22:59:41', 1, 'Giảm 200k cho đơn từ 2 triệu', '2025-12-31'),
(2, 'FREESHIP', 0, 100, '2025-07-03 22:59:41', '2025-07-03 22:59:41', 1, 'Miễn phí vận chuyển toàn quốc', '2025-12-31'),
(3, 'SUMMER20', 200000, 30, '2025-07-03 22:59:41', '2025-07-03 22:59:41', 1, 'Giảm 200k cho đơn từ 2 triệu', '2025-08-31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`AttributeID`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`CartID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`CartItemID`),
  ADD KEY `CartID` (`CartID`),
  ADD KEY `ProductVariantID` (`ProductVariantID`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `favorite_products`
--
ALTER TABLE `favorite_products`
  ADD PRIMARY KEY (`FavoriteProductID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `ProductID` (`ProductVariantID`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`MessageID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`NotificationID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `orderdetail`
--
ALTER TABLE `orderdetail`
  ADD PRIMARY KEY (`OrderDetailID`),
  ADD KEY `OrderID` (`OrderID`),
  ADD KEY `ProductID` (`ProductVariantID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderID`),
  ADD UNIQUE KEY `InvoiceCode` (`InvoiceCode`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `VoucherID` (`VoucherID`),
  ADD KEY `PaymentID` (`PaymentID`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payment_gateway`
--
ALTER TABLE `payment_gateway`
  ADD PRIMARY KEY (`PaymentID`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- Indexes for table `productvariants`
--
ALTER TABLE `productvariants`
  ADD PRIMARY KEY (`ProductVariantID`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`ReviewID`),
  ADD KEY `OrderDetailID` (`OrderDetailID`),
  ADD KEY `ProductID` (`ProductVariantID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- Indexes for table `variant_attributes`
--
ALTER TABLE `variant_attributes`
  ADD PRIMARY KEY (`VariantAttributeID`),
  ADD KEY `ProductVariantID` (`ProductVariantID`),
  ADD KEY `AttributeID` (`AttributeID`);

--
-- Indexes for table `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`VoucherID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attributes`
--
ALTER TABLE `attributes`
  MODIFY `AttributeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `CartID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `CartItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `favorite_products`
--
ALTER TABLE `favorite_products`
  MODIFY `FavoriteProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `NotificationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderdetail`
--
ALTER TABLE `orderdetail`
  MODIFY `OrderDetailID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `payment_gateway`
--
ALTER TABLE `payment_gateway`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `productvariants`
--
ALTER TABLE `productvariants`
  MODIFY `ProductVariantID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `ReviewID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `variant_attributes`
--
ALTER TABLE `variant_attributes`
  MODIFY `VariantAttributeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `voucher`
--
ALTER TABLE `voucher`
  MODIFY `VoucherID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`CartID`) REFERENCES `carts` (`CartID`),
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`ProductVariantID`) REFERENCES `productvariants` (`ProductVariantID`);

--
-- Constraints for table `favorite_products`
--
ALTER TABLE `favorite_products`
  ADD CONSTRAINT `favorite_products_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `favorite_products_ibfk_2` FOREIGN KEY (`ProductVariantID`) REFERENCES `productvariants` (`ProductVariantID`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `news_author_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users` (`UserID`) ON DELETE SET NULL;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `orderdetail`
--
ALTER TABLE `orderdetail`
  ADD CONSTRAINT `orderdetail_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`),
  ADD CONSTRAINT `orderdetail_ibfk_2` FOREIGN KEY (`ProductVariantID`) REFERENCES `productvariants` (`ProductVariantID`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`VoucherID`) REFERENCES `voucher` (`VoucherID`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`PaymentID`) REFERENCES `payment_gateway` (`PaymentID`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`OrderDetailID`) REFERENCES `orderdetail` (`OrderDetailID`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`ProductVariantID`) REFERENCES `productvariants` (`ProductVariantID`),
  ADD CONSTRAINT `review_ibfk_3` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `variant_attributes`
--
ALTER TABLE `variant_attributes`
  ADD CONSTRAINT `variant_attributes_ibfk_1` FOREIGN KEY (`ProductVariantID`) REFERENCES `productvariants` (`ProductVariantID`) ON DELETE CASCADE,
  ADD CONSTRAINT `variant_attributes_ibfk_2` FOREIGN KEY (`AttributeID`) REFERENCES `attributes` (`AttributeID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
