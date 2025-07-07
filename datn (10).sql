-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 07, 2025 lúc 03:13 PM
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
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `CartID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
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
(4, '2025_05_29_154550_create_personal_access_tokens_table', 1);

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
(1, 1, 'Sofa gỗ cao su cập nhật', 'Mô tả mới', 'Ban-an-Go-Cao-Su-MOHO-OSLO01.png', 6000000, 1, '2025-07-01 22:42:19', '2025-07-05 15:55:11'),
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
(15, 1, 'Sofa gỗ cao su', 'Sofa đẹp', NULL, 5000000, 1, '2025-07-05 17:03:30', '2025-07-05 17:03:30');

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
(16, 1, 'SKU-68694adfdd64a', 6000000, 15, '2025-07-05 22:55:11', '2025-07-05 15:55:11'),
(17, 15, 'SKU-68695ae2e9d4d', 5000000, 10, '2025-07-06 00:03:30', '2025-07-05 17:03:30');

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
('35VCNEAQThNfxX5N7smbQDcurX6ExNTIreELGtkn', NULL, '127.0.0.1', 'PostmanRuntime/7.39.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY29PWDZtamdvRkNYejJnS0hQS2RQODlVdDZlelZlWTh5WXV3WjZiQSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1751735920),
('CaOBolc9HesXAVVRyoXg7IwAMSfy5DDB0ruypqJp', NULL, '127.0.0.1', 'PostmanRuntime/7.39.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU0pteElUcHo1dGVXQ2p0eDR0QXZ2TEhHN0hYdUFxSElzeU5JUkM4NCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1751561336),
('DeRRorD41k792wupwsnDMKXhvFG9X57LBIP2s7JK', NULL, '127.0.0.1', 'PostmanRuntime/7.39.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUTN1a0g1UGNmcjRvc3M3MkIxazJMYnZKa1RQOWIyd25xNldMekphOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1751394431);

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
(1, NULL, '$2y$12$.0Bkaw2FQkVYTZC5kbr9X.hvgY4XrChnk9WDElV8ap4EveR4yU63C', NULL, 'blackrabitxx@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-06 14:55:57', '2025-06-06 14:55:57'),
(2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
(21, 16, 1, 'Đỏ', '2025-07-05 08:55:11', '2025-07-05 08:55:11'),
(22, 16, 2, 'XL', '2025-07-05 08:55:11', '2025-07-05 08:55:11'),
(23, 17, 1, 'Đỏ', '2025-07-05 10:03:30', '2025-07-05 10:03:30'),
(24, 17, 2, 'XL', '2025-07-05 10:03:30', '2025-07-05 10:03:30');

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
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`CartID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `ProductID` (`ProductVariantID`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Chỉ mục cho bảng `favorite_products`
--
ALTER TABLE `favorite_products`
  ADD PRIMARY KEY (`FavoriteProductID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `ProductID` (`ProductVariantID`);

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
-- AUTO_INCREMENT cho bảng `cart`
--
ALTER TABLE `cart`
  MODIFY `CartID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `favorite_products`
--
ALTER TABLE `favorite_products`
  MODIFY `FavoriteProductID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `messages`
--
ALTER TABLE `messages`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `productvariants`
--
ALTER TABLE `productvariants`
  MODIFY `ProductVariantID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `review`
--
ALTER TABLE `review`
  MODIFY `ReviewID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `variant_attributes`
--
ALTER TABLE `variant_attributes`
  MODIFY `VariantAttributeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `voucher`
--
ALTER TABLE `voucher`
  MODIFY `VoucherID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`ProductVariantID`) REFERENCES `productvariants` (`ProductVariantID`);

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
