-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2026 at 05:35 PM
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
-- Database: `project_crud2`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Makanan'),
(2, 'Minuman');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int(3) NOT NULL,
  `id_parent` int(3) DEFAULT NULL,
  `name` varchar(30) NOT NULL,
  `url` varchar(50) DEFAULT NULL,
  `icon` varchar(30) NOT NULL,
  `sort_order` int(3) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `id_parent`, `name`, `url`, `icon`, `sort_order`, `is_active`) VALUES
(1, NULL, 'Dashboard', '/admin', 'bx bx-grid-alt', 1, 1),
(2, NULL, 'User Management', NULL, 'bx bx-group', 2, 1),
(3, 2, 'Users', '/admin/users', 'bx bx-user', 1, 1),
(4, 2, 'Roles', '/admin/roles', 'bx bx-shield', 2, 1),
(5, NULL, 'Menus', '/admin/menus', 'bx bx-list-ul', 3, 1),
(6, NULL, 'Categories', '/admin/categories', 'bx bx-purchase-tag', 4, 1),
(7, NULL, 'Products', '/admin/products', 'bx bx-package', 5, 1),
(8, NULL, 'Transactions', '/admin/transactions', 'bx bx-box', 6, 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(3) NOT NULL,
  `order_number` varchar(60) NOT NULL,
  `customer_name` varchar(45) NOT NULL,
  `payment_method` int(45) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `tax` decimal(12,2) NOT NULL,
  `discount` decimal(12,2) NOT NULL,
  `total_bill` decimal(12,2) NOT NULL,
  `cash_received` decimal(12,2) NOT NULL,
  `cash_change` decimal(12,2) NOT NULL,
  `payment_status` enum('SUCCESS','PENDING','','') NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(3) NOT NULL,
  `order_id` int(50) NOT NULL,
  `product_id` int(45) NOT NULL,
  `product_name` varchar(45) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `quantity` int(4) NOT NULL,
  `total_price` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(3) NOT NULL,
  `category_id` int(3) NOT NULL,
  `name` varchar(30) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `qty` int(3) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `unit` varchar(15) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `image`, `qty`, `price`, `unit`, `description`, `is_active`) VALUES
(1, 1, 'Ayam', 'assets/uploads/products/1779971485_fotoArfaN.jpg', 3, 10000, 'pcs', '', 1),
(2, 2, 'Granita', 'https://tse2.mm.bing.net/th/id/OIP.ij_3f_mcNWt054cKb_0C6wHaHa?pid=Api&P=0&h=180', 3, 2000, 'pcs', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(3) NOT NULL,
  `name` varchar(30) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `is_active`, `description`) VALUES
(1, 'Admin', 1, 'Admin is Fire'),
(2, 'User', 1, 'User is People'),
(4, 'Ayam', 1, NULL),
(5, 'arfy', 1, NULL),
(6, 'User 300', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(3) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role_id` int(3) NOT NULL DEFAULT 2
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role_id`) VALUES
(1, 'Arfan', 'arfan@gmail.com', '123', 1),
(2, 'Cuak', 'cuak@gmail.com', '123', 1),
(3, 'Uhuyhuy', 'uhuy@gmail.com', '123', 2),
(5, 'User 1', 'user1@mail.com', '123456', 2),
(6, 'User 2', 'user2@mail.com', '123456', 2),
(7, 'User 3', 'user3@mail.com', '123456', 2),
(8, 'User 4', 'user4@mail.com', '123456', 2),
(9, 'User 5', 'user5@mail.com', '123456', 2),
(10, 'User 6', 'user6@mail.com', '123456', 2),
(11, 'User 7', 'user7@mail.com', '123456', 2),
(12, 'User 8', 'user8@mail.com', '123456', 2),
(13, 'User 9', 'user9@mail.com', '123456', 2),
(14, 'User 10', 'user10@mail.com', '123456', 2),
(15, 'User 11', 'user11@mail.com', '123456', 2),
(16, 'User 12', 'user12@mail.com', '123456', 2),
(17, 'User 13', 'user13@mail.com', '123456', 2),
(18, 'User 14', 'user14@mail.com', '123456', 2),
(19, 'User 15', 'user15@mail.com', '123456', 2),
(20, 'User 16', 'user16@mail.com', '123456', 2),
(21, 'User 17', 'user17@mail.com', '123456', 2),
(22, 'User 18', 'user18@mail.com', '123456', 2),
(23, 'User 19', 'user19@mail.com', '123456', 2),
(24, 'User 20', 'user20@mail.com', '123456', 2),
(25, 'User 21', 'user21@mail.com', '123456', 2),
(26, 'User 22', 'user22@mail.com', '123456', 2),
(27, 'User 23', 'user23@mail.com', '123456', 2),
(28, 'User 24', 'user24@mail.com', '123456', 2),
(29, 'User 25', 'user25@mail.com', '123456', 2),
(30, 'User 26', 'user26@mail.com', '123456', 2),
(31, 'User 27', 'user27@mail.com', '123456', 2),
(32, 'User 28', 'user28@mail.com', '123456', 2),
(33, 'User 29', 'user29@mail.com', '123456', 2),
(34, 'User 30', 'user30@mail.com', '123456', 2),
(35, 'User 31', 'user31@mail.com', '123456', 2),
(36, 'User 32', 'user32@mail.com', '123456', 2),
(37, 'User 33', 'user33@mail.com', '123456', 2),
(38, 'User 34', 'user34@mail.com', '123456', 2),
(39, 'User 35', 'user35@mail.com', '123456', 2),
(40, 'User 36', 'user36@mail.com', '123456', 2),
(41, 'User 37', 'user37@mail.com', '123456', 2),
(42, 'User 38', 'user38@mail.com', '123456', 2),
(43, 'User 39', 'user39@mail.com', '123456', 2),
(44, 'User 40', 'user40@mail.com', '123456', 2),
(45, 'User 41', 'user41@mail.com', '123456', 2),
(46, 'User 42', 'user42@mail.com', '123456', 2),
(47, 'User 43', 'user43@mail.com', '123456', 2),
(48, 'User 44', 'user44@mail.com', '123456', 2),
(49, 'User 45', 'user45@mail.com', '123456', 2),
(50, 'User 46', 'user46@mail.com', '123456', 2),
(51, 'User 47', 'user47@mail.com', '123456', 2),
(52, 'User 48', 'user48@mail.com', '123456', 2),
(53, 'User 49', 'user49@mail.com', '123456', 2),
(54, 'User 50', 'user50@mail.com', '123456', 2),
(55, 'User 51', 'user51@mail.com', '123456', 2),
(56, 'User 52', 'user52@mail.com', '123456', 2),
(57, 'User 53', 'user53@mail.com', '123456', 2),
(58, 'User 54', 'user54@mail.com', '123456', 2),
(59, 'User 55', 'user55@mail.com', '123456', 2),
(60, 'User 56', 'user56@mail.com', '123456', 2),
(61, 'User 57', 'user57@mail.com', '123456', 2),
(62, 'User 58', 'user58@mail.com', '123456', 2),
(63, 'User 59', 'user59@mail.com', '123456', 2),
(64, 'User 60', 'user60@mail.com', '123456', 2),
(65, 'User 61', 'user61@mail.com', '123456', 2),
(66, 'User 62', 'user62@mail.com', '123456', 2),
(67, 'User 63', 'user63@mail.com', '123456', 2),
(68, 'User 64', 'user64@mail.com', '123456', 2),
(69, 'User 65', 'user65@mail.com', '123456', 2),
(70, 'User 66', 'user66@mail.com', '123456', 2),
(71, 'User 67', 'user67@mail.com', '123456', 2),
(72, 'User 68', 'user68@mail.com', '123456', 2),
(73, 'User 69', 'user69@mail.com', '123456', 2),
(74, 'User 70', 'user70@mail.com', '123456', 2),
(75, 'User 71', 'user71@mail.com', '123456', 2),
(76, 'User 72', 'user72@mail.com', '123456', 2),
(77, 'User 73', 'user73@mail.com', '123456', 2),
(78, 'User 74', 'user74@mail.com', '123456', 2),
(79, 'User 75', 'user75@mail.com', '123456', 2),
(80, 'User 76', 'user76@mail.com', '123456', 2),
(81, 'User 77', 'user77@mail.com', '123456', 2),
(82, 'User 78', 'user78@mail.com', '123456', 2),
(83, 'User 79', 'user79@mail.com', '123456', 2),
(84, 'User 80', 'user80@mail.com', '123456', 2),
(85, 'User 81', 'user81@mail.com', '123456', 2),
(86, 'User 82', 'user82@mail.com', '123456', 2),
(87, 'User 83', 'user83@mail.com', '123456', 2),
(88, 'User 84', 'user84@mail.com', '123456', 2),
(89, 'User 85', 'user85@mail.com', '123456', 2),
(90, 'User 86', 'user86@mail.com', '123456', 2),
(91, 'User 87', 'user87@mail.com', '123456', 2),
(92, 'User 88', 'user88@mail.com', '123456', 2),
(93, 'User 89', 'user89@mail.com', '123456', 2),
(94, 'User 90', 'user90@mail.com', '123456', 2),
(95, 'User 91', 'user91@mail.com', '123456', 2),
(96, 'User 92', 'user92@mail.com', '123456', 2),
(97, 'User 93', 'user93@mail.com', '123456', 2),
(98, 'User 94', 'user94@mail.com', '123456', 2),
(99, 'User 95', 'user95@mail.com', '123456', 2),
(100, 'User 96', 'user96@mail.com', '123456', 2),
(101, 'User 97', 'user97@mail.com', '123456', 2),
(102, 'User 98', 'user98@mail.com', '123456', 2),
(103, 'User 99', 'user99@mail.com', '123456', 2),
(104, 'User 100', 'user100@mail.com', '123456', 2),
(105, 'User 101', 'user101@mail.com', '123456', 2),
(106, 'User 102', 'user102@mail.com', '123456', 2),
(107, 'User 103', 'user103@mail.com', '123456', 2),
(108, 'User 104', 'user104@mail.com', '123456', 2),
(109, 'User 105', 'user105@mail.com', '123456', 2),
(110, 'User 106', 'user106@mail.com', '123456', 2),
(111, 'User 107', 'user107@mail.com', '123456', 2),
(112, 'User 108', 'user108@mail.com', '123456', 2),
(113, 'User 109', 'user109@mail.com', '123456', 2),
(114, 'User 110', 'user110@mail.com', '123456', 2),
(115, 'User 111', 'user111@mail.com', '123456', 2),
(116, 'User 112', 'user112@mail.com', '123456', 2),
(117, 'User 113', 'user113@mail.com', '123456', 2),
(118, 'User 114', 'user114@mail.com', '123456', 2),
(119, 'User 115', 'user115@mail.com', '123456', 2),
(120, 'User 116', 'user116@mail.com', '123456', 2),
(121, 'User 117', 'user117@mail.com', '123456', 2),
(122, 'User 118', 'user118@mail.com', '123456', 2),
(123, 'User 119', 'user119@mail.com', '123456', 2),
(124, 'User 120', 'user120@mail.com', '123456', 2),
(125, 'User 121', 'user121@mail.com', '123456', 2),
(126, 'User 122', 'user122@mail.com', '123456', 2),
(127, 'User 123', 'user123@mail.com', '123456', 2),
(128, 'User 124', 'user124@mail.com', '123456', 2),
(129, 'User 125', 'user125@mail.com', '123456', 2),
(130, 'User 126', 'user126@mail.com', '123456', 2),
(131, 'User 127', 'user127@mail.com', '123456', 2),
(132, 'User 128', 'user128@mail.com', '123456', 2),
(133, 'User 129', 'user129@mail.com', '123456', 2),
(134, 'User 130', 'user130@mail.com', '123456', 2),
(135, 'User 131', 'user131@mail.com', '123456', 2),
(136, 'User 132', 'user132@mail.com', '123456', 2),
(137, 'User 133', 'user133@mail.com', '123456', 2),
(138, 'User 134', 'user134@mail.com', '123456', 2),
(139, 'User 135', 'user135@mail.com', '123456', 2),
(140, 'User 136', 'user136@mail.com', '123456', 2),
(141, 'User 137', 'user137@mail.com', '123456', 2),
(142, 'User 138', 'user138@mail.com', '123456', 2),
(143, 'User 139', 'user139@mail.com', '123456', 2),
(144, 'User 140', 'user140@mail.com', '123456', 2),
(145, 'User 141', 'user141@mail.com', '123456', 2),
(146, 'User 142', 'user142@mail.com', '123456', 2),
(147, 'User 143', 'user143@mail.com', '123456', 2),
(148, 'User 144', 'user144@mail.com', '123456', 2),
(149, 'User 145', 'user145@mail.com', '123456', 2),
(150, 'User 146', 'user146@mail.com', '123456', 2),
(151, 'User 147', 'user147@mail.com', '123456', 2),
(152, 'User 148', 'user148@mail.com', '123456', 2),
(153, 'User 149', 'user149@mail.com', '123456', 2),
(154, 'User 150', 'user150@mail.com', '123456', 2),
(155, 'User 151', 'user151@mail.com', '123456', 2),
(156, 'User 152', 'user152@mail.com', '123456', 2),
(157, 'User 153', 'user153@mail.com', '123456', 2),
(158, 'User 154', 'user154@mail.com', '123456', 2),
(159, 'User 155', 'user155@mail.com', '123456', 2),
(160, 'User 156', 'user156@mail.com', '123456', 2),
(161, 'User 157', 'user157@mail.com', '123456', 2),
(162, 'User 158', 'user158@mail.com', '123456', 2),
(163, 'User 159', 'user159@mail.com', '123456', 2),
(164, 'User 160', 'user160@mail.com', '123456', 2),
(165, 'User 161', 'user161@mail.com', '123456', 2),
(166, 'User 162', 'user162@mail.com', '123456', 2),
(167, 'User 163', 'user163@mail.com', '123456', 2),
(168, 'User 164', 'user164@mail.com', '123456', 2),
(169, 'User 165', 'user165@mail.com', '123456', 2),
(170, 'User 166', 'user166@mail.com', '123456', 2),
(171, 'User 167', 'user167@mail.com', '123456', 2),
(172, 'User 168', 'user168@mail.com', '123456', 2),
(173, 'User 169', 'user169@mail.com', '123456', 2),
(174, 'User 170', 'user170@mail.com', '123456', 2),
(175, 'User 171', 'user171@mail.com', '123456', 2),
(176, 'User 172', 'user172@mail.com', '123456', 2),
(177, 'User 173', 'user173@mail.com', '123456', 2),
(178, 'User 174', 'user174@mail.com', '123456', 2),
(179, 'User 175', 'user175@mail.com', '123456', 2),
(180, 'User 176', 'user176@mail.com', '123456', 2),
(181, 'User 177', 'user177@mail.com', '123456', 2),
(182, 'User 178', 'user178@mail.com', '123456', 2),
(183, 'User 179', 'user179@mail.com', '123456', 2),
(184, 'User 180', 'user180@mail.com', '123456', 2),
(185, 'User 181', 'user181@mail.com', '123456', 2),
(186, 'User 182', 'user182@mail.com', '123456', 2),
(187, 'User 183', 'user183@mail.com', '123456', 2),
(188, 'User 184', 'user184@mail.com', '123456', 2),
(189, 'User 185', 'user185@mail.com', '123456', 2),
(190, 'User 186', 'user186@mail.com', '123456', 2),
(191, 'User 187', 'user187@mail.com', '123456', 2),
(192, 'User 188', 'user188@mail.com', '123456', 2),
(193, 'User 189', 'user189@mail.com', '123456', 2),
(194, 'User 190', 'user190@mail.com', '123456', 2),
(195, 'User 191', 'user191@mail.com', '123456', 2),
(196, 'User 192', 'user192@mail.com', '123456', 2),
(197, 'User 193', 'user193@mail.com', '123456', 2),
(198, 'User 194', 'user194@mail.com', '123456', 2),
(199, 'User 195', 'user195@mail.com', '123456', 2),
(200, 'User 196', 'user196@mail.com', '123456', 2),
(201, 'User 197', 'user197@mail.com', '123456', 2),
(202, 'User 198', 'user198@mail.com', '123456', 2),
(203, 'User 199', 'user199@mail.com', '123456', 2),
(204, 'User 200', 'user200@mail.com', '123456', 2),
(205, 'User 201', 'user201@mail.com', '123456', 2),
(206, 'User 202', 'user202@mail.com', '123456', 2),
(207, 'User 203', 'user203@mail.com', '123456', 2),
(208, 'User 204', 'user204@mail.com', '123456', 2),
(209, 'User 205', 'user205@mail.com', '123456', 2),
(210, 'User 206', 'user206@mail.com', '123456', 2),
(211, 'User 207', 'user207@mail.com', '123456', 2),
(212, 'User 208', 'user208@mail.com', '123456', 2),
(213, 'User 209', 'user209@mail.com', '123456', 2),
(214, 'User 210', 'user210@mail.com', '123456', 2),
(215, 'User 211', 'user211@mail.com', '123456', 2),
(216, 'User 212', 'user212@mail.com', '123456', 2),
(217, 'User 213', 'user213@mail.com', '123456', 2),
(218, 'User 214', 'user214@mail.com', '123456', 2),
(219, 'User 215', 'user215@mail.com', '123456', 2),
(220, 'User 216', 'user216@mail.com', '123456', 2),
(221, 'User 217', 'user217@mail.com', '123456', 2),
(222, 'User 218', 'user218@mail.com', '123456', 2),
(223, 'User 219', 'user219@mail.com', '123456', 2),
(224, 'User 220', 'user220@mail.com', '123456', 2),
(225, 'User 221', 'user221@mail.com', '123456', 2),
(226, 'User 222', 'user222@mail.com', '123456', 2),
(227, 'User 223', 'user223@mail.com', '123456', 2),
(228, 'User 224', 'user224@mail.com', '123456', 2),
(229, 'User 225', 'user225@mail.com', '123456', 2),
(230, 'User 226', 'user226@mail.com', '123456', 2),
(231, 'User 227', 'user227@mail.com', '123456', 2),
(232, 'User 228', 'user228@mail.com', '123456', 2),
(233, 'User 229', 'user229@mail.com', '123456', 2),
(234, 'User 230', 'user230@mail.com', '123456', 2),
(235, 'User 231', 'user231@mail.com', '123456', 2),
(236, 'User 232', 'user232@mail.com', '123456', 2),
(237, 'User 233', 'user233@mail.com', '123456', 2),
(238, 'User 234', 'user234@mail.com', '123456', 2),
(239, 'User 235', 'user235@mail.com', '123456', 2),
(240, 'User 236', 'user236@mail.com', '123456', 2),
(241, 'User 237', 'user237@mail.com', '123456', 2),
(242, 'User 238', 'user238@mail.com', '123456', 2),
(243, 'User 239', 'user239@mail.com', '123456', 2),
(244, 'User 240', 'user240@mail.com', '123456', 2),
(245, 'User 241', 'user241@mail.com', '123456', 2),
(246, 'User 242', 'user242@mail.com', '123456', 2),
(247, 'User 243', 'user243@mail.com', '123456', 2),
(248, 'User 244', 'user244@mail.com', '123456', 2),
(249, 'User 245', 'user245@mail.com', '123456', 2),
(250, 'User 246', 'user246@mail.com', '123456', 2),
(251, 'User 247', 'user247@mail.com', '123456', 2),
(252, 'User 248', 'user248@mail.com', '123456', 2),
(253, 'User 249', 'user249@mail.com', '123456', 2),
(254, 'User 250', 'user250@mail.com', '123456', 2),
(255, 'User 251', 'user251@mail.com', '123456', 2),
(256, 'User 252', 'user252@mail.com', '123456', 2),
(257, 'User 253', 'user253@mail.com', '123456', 2),
(258, 'User 254', 'user254@mail.com', '123456', 2),
(259, 'User 255', 'user255@mail.com', '123456', 2),
(260, 'User 256', 'user256@mail.com', '123456', 2),
(261, 'User 257', 'user257@mail.com', '123456', 2),
(262, 'User 258', 'user258@mail.com', '123456', 2),
(263, 'User 259', 'user259@mail.com', '123456', 2),
(264, 'User 260', 'user260@mail.com', '123456', 2),
(265, 'User 261', 'user261@mail.com', '123456', 2),
(266, 'User 262', 'user262@mail.com', '123456', 2),
(267, 'User 263', 'user263@mail.com', '123456', 2),
(268, 'User 264', 'user264@mail.com', '123456', 2),
(269, 'User 265', 'user265@mail.com', '123456', 2),
(270, 'User 266', 'user266@mail.com', '123456', 2),
(271, 'User 267', 'user267@mail.com', '123456', 2),
(272, 'User 268', 'user268@mail.com', '123456', 2),
(273, 'User 269', 'user269@mail.com', '123456', 2),
(274, 'User 270', 'user270@mail.com', '123456', 2),
(275, 'User 271', 'user271@mail.com', '123456', 2),
(276, 'User 272', 'user272@mail.com', '123456', 2),
(277, 'User 273', 'user273@mail.com', '123456', 2),
(278, 'User 274', 'user274@mail.com', '123456', 2),
(279, 'User 275', 'user275@mail.com', '123456', 2),
(280, 'User 276', 'user276@mail.com', '123456', 2),
(281, 'User 277', 'user277@mail.com', '123456', 2),
(282, 'User 278', 'user278@mail.com', '123456', 2),
(283, 'User 279', 'user279@mail.com', '123456', 2),
(284, 'User 280', 'user280@mail.com', '123456', 2),
(285, 'User 281', 'user281@mail.com', '123456', 2),
(286, 'User 282', 'user282@mail.com', '123456', 2),
(287, 'User 283', 'user283@mail.com', '123456', 2),
(288, 'User 284', 'user284@mail.com', '123456', 2),
(289, 'User 285', 'user285@mail.com', '123456', 2),
(290, 'User 286', 'user286@mail.com', '123456', 2),
(291, 'User 287', 'user287@mail.com', '123456', 2),
(292, 'User 288', 'user288@mail.com', '123456', 2),
(293, 'User 289', 'user289@mail.com', '123456', 2),
(294, 'User 290', 'user290@mail.com', '123456', 2),
(295, 'User 291', 'user291@mail.com', '123456', 2),
(296, 'User 292', 'user292@mail.com', '123456', 2),
(297, 'User 293', 'user293@mail.com', '123456', 2),
(298, 'User 294', 'user294@mail.com', '123456', 2),
(299, 'User 295', 'user295@mail.com', '123456', 2),
(300, 'User 296', 'user296@mail.com', '123456', 2),
(301, 'User 297', 'user297@mail.com', '123456', 2),
(302, 'User 298', 'user298@mail.com', '123456', 2),
(303, 'User 299', 'user299@mail.com', '123456', 2),
(305, 'User 301', 'user300@mail.com', '1234', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_details_ibfk_1` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_role` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=306;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
