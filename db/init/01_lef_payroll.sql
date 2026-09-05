-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 04, 2026 at 12:38 PM
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
-- Database: `lef_payroll`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance_logs`
--

CREATE TABLE `attendance_logs` (
  `id` varchar(50) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `attendance_date` date NOT NULL,
  `clock_in` time DEFAULT NULL,
  `clock_out` time DEFAULT NULL,
  `status` enum('Present','Late','Absent') DEFAULT 'Present',
  `hours_worked` decimal(5,2) DEFAULT 0.00,
  `source` enum('Manual','Hikvision') DEFAULT 'Manual',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_manual` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_logs`
--

INSERT INTO `attendance_logs` (`id`, `employee_id`, `attendance_date`, `clock_in`, `clock_out`, `status`, `hours_worked`, `source`, `created_at`, `is_manual`) VALUES
('12ad7e34-6fb8-11f1-831e-0827a8d840b7', 'LSEMP004', '2026-06-24', '08:13:50', NULL, 'Present', 0.00, 'Hikvision', '2026-06-24 10:33:00', 0),
('12adb674-6fb8-11f1-831e-0827a8d840b7', 'LSEMP006', '2026-06-24', '08:14:22', NULL, 'Present', 0.00, 'Hikvision', '2026-06-24 10:33:00', 0),
('12adef42-6fb8-11f1-831e-0827a8d840b7', 'LSEMP007', '2026-06-24', '08:41:10', NULL, 'Late', 0.00, 'Hikvision', '2026-06-24 10:33:00', 0),
('12ae1eff-6fb8-11f1-831e-0827a8d840b7', 'LSEMP015', '2026-06-24', '09:06:17', NULL, 'Late', 0.00, 'Hikvision', '2026-06-24 10:33:00', 0),
('12ae5955-6fb8-11f1-831e-0827a8d840b7', 'LSEMP016', '2026-06-24', '08:12:27', NULL, 'Present', 0.00, 'Hikvision', '2026-06-24 10:33:00', 0),
('12ae98cd-6fb8-11f1-831e-0827a8d840b7', 'LSEMP021', '2026-06-24', '08:13:43', NULL, 'Present', 0.00, 'Hikvision', '2026-06-24 10:33:00', 0),
('12aed731-6fb8-11f1-831e-0827a8d840b7', 'LSEMP022', '2026-06-24', '08:14:01', NULL, 'Present', 0.00, 'Hikvision', '2026-06-24 10:33:00', 0),
('12af1aad-6fb8-11f1-831e-0827a8d840b7', 'LSEMP024', '2026-06-24', '08:12:14', NULL, 'Present', 0.00, 'Hikvision', '2026-06-24 10:33:00', 0),
('195669b5-7081-11f1-901c-2dc96ab54e68', 'LSEMP004', '2026-06-25', '08:11:02', '15:46:14', 'Present', 7.59, 'Hikvision', '2026-06-25 10:32:00', 0),
('1957e868-7081-11f1-901c-2dc96ab54e68', 'LSEMP006', '2026-06-25', '08:10:51', '14:53:09', 'Present', 6.71, 'Hikvision', '2026-06-25 10:32:00', 0),
('1958ad01-7081-11f1-901c-2dc96ab54e68', 'LSEMP008', '2026-06-25', '08:20:08', NULL, 'Present', 0.00, 'Hikvision', '2026-06-25 10:32:00', 0),
('195907bc-7081-11f1-901c-2dc96ab54e68', 'LSEMP012', '2026-06-25', '08:16:51', '17:04:17', 'Present', 8.79, 'Hikvision', '2026-06-25 10:32:00', 0),
('195a0c3d-7081-11f1-901c-2dc96ab54e68', 'LSEMP016', '2026-06-25', '08:20:14', NULL, 'Present', 0.00, 'Hikvision', '2026-06-25 10:32:00', 0),
('195a6658-7081-11f1-901c-2dc96ab54e68', 'LSEMP018', '2026-06-25', '08:24:54', '13:57:29', 'Present', 5.54, 'Hikvision', '2026-06-25 10:32:00', 0),
('195b077a-7081-11f1-901c-2dc96ab54e68', 'LSEMP021', '2026-06-25', '08:10:55', NULL, 'Present', 0.00, 'Hikvision', '2026-06-25 10:32:00', 0),
('195bb8e4-7081-11f1-901c-2dc96ab54e68', 'LSEMP022', '2026-06-25', '05:45:40', '16:23:18', 'Present', 10.63, 'Hikvision', '2026-06-25 10:32:00', 0),
('195cb5eb-7081-11f1-901c-2dc96ab54e68', 'LSEMP024', '2026-06-25', '08:00:06', NULL, 'Present', 0.00, 'Hikvision', '2026-06-25 10:32:00', 0),
('30e650e3-70a9-11f1-901c-2dc96ab54e68', 'LSEMP103', '2026-06-25', '15:17:59', NULL, 'Late', 0.00, 'Hikvision', '2026-06-25 15:19:00', 0),
('44607ad4-7466-11f1-8151-00155da0f77f', 'LSEMP100', '2026-06-30', '05:38:07', NULL, 'Present', 0.00, 'Hikvision', '2026-06-30 09:30:00', 0),
('4461fe0b-7466-11f1-8151-00155da0f77f', 'LSEMP023', '2026-06-30', '08:00:54', NULL, 'Present', 0.00, 'Hikvision', '2026-06-30 09:30:00', 0),
('4464e629-7466-11f1-8151-00155da0f77f', 'LSEMP101', '2026-06-30', '08:00:58', NULL, 'Present', 0.00, 'Hikvision', '2026-06-30 09:30:00', 0),
('4465e90c-7466-11f1-8151-00155da0f77f', 'LSEMP022', '2026-06-30', '08:08:33', NULL, 'Present', 0.00, 'Hikvision', '2026-06-30 09:30:00', 0),
('44671549-7466-11f1-8151-00155da0f77f', 'LSEMP006', '2026-06-30', '08:08:38', NULL, 'Present', 0.00, 'Hikvision', '2026-06-30 09:30:00', 0),
('4468047a-7466-11f1-8151-00155da0f77f', 'LSEMP021', '2026-06-30', '08:08:42', NULL, 'Present', 0.00, 'Hikvision', '2026-06-30 09:30:00', 0),
('446959e3-7466-11f1-8151-00155da0f77f', 'LSEMP005', '2026-06-30', '08:19:07', NULL, 'Present', 0.00, 'Hikvision', '2026-06-30 09:30:00', 0),
('446abd80-7466-11f1-8151-00155da0f77f', 'LSEMP024', '2026-06-30', '08:34:24', NULL, 'Late', 0.00, 'Hikvision', '2026-06-30 09:30:00', 0),
('446c7b64-7466-11f1-8151-00155da0f77f', 'LSEMP015', '2026-06-30', '08:41:46', NULL, 'Late', 0.00, 'Hikvision', '2026-06-30 09:30:00', 0),
('446e2167-7466-11f1-8151-00155da0f77f', 'LSEMP103', '2026-06-30', '08:49:07', NULL, 'Late', 0.00, 'Hikvision', '2026-06-30 09:30:00', 0),
('4470d413-7466-11f1-8151-00155da0f77f', 'LSEMP007', '2026-06-30', '08:56:07', NULL, 'Late', 0.00, 'Hikvision', '2026-06-30 09:30:00', 0),
('73222451-6fba-11f1-831e-0827a8d840b7', 'LSEMP005', '2026-06-24', '10:41:02', NULL, 'Late', 0.00, 'Hikvision', '2026-06-24 10:50:01', 0),
('7327ac49-6fba-11f1-831e-0827a8d840b7', 'LSEMP023', '2026-06-24', '10:20:12', NULL, 'Late', 0.00, 'Hikvision', '2026-06-24 10:50:01', 0),
('795b8e2f-7083-11f1-901c-2dc96ab54e68', 'LSEMP100', '2026-06-25', '05:27:58', NULL, 'Present', 0.00, 'Hikvision', '2026-06-25 10:49:00', 0),
('795c3d4a-7083-11f1-901c-2dc96ab54e68', 'LSEMP005', '2026-06-25', '06:43:57', NULL, 'Present', 0.00, 'Hikvision', '2026-06-25 10:49:00', 0),
('795d4307-7083-11f1-901c-2dc96ab54e68', 'LSEMP101', '2026-06-25', '07:28:32', NULL, 'Present', 0.00, 'Hikvision', '2026-06-25 10:49:00', 0),
('795e8a12-7083-11f1-901c-2dc96ab54e68', 'LSEMP023', '2026-06-25', '07:54:08', NULL, 'Present', 0.00, 'Hikvision', '2026-06-25 10:49:00', 0),
('7cd4d550-746f-11f1-8151-00155da0f77f', 'LSEMP008', '2026-06-30', '10:35:50', NULL, 'Late', 0.00, 'Hikvision', '2026-06-30 10:36:00', 0),
('a0404516-8fe7-11f1-821b-97d04d116cec', 'LSEMP015', '2026-08-04', '09:32:28', NULL, 'Late', 0.00, 'Hikvision', '2026-08-04 09:34:01', 0),
('a87b47e7-7184-11f1-901c-2dc96ab54e68', 'LSEMP006', '2026-06-26', '08:17:35', NULL, 'Present', 0.00, 'Hikvision', '2026-06-26 17:30:00', 0),
('a87d6382-7184-11f1-901c-2dc96ab54e68', 'LSEMP003', '2026-06-26', '08:23:24', NULL, 'Present', 0.00, 'Hikvision', '2026-06-26 17:30:00', 0),
('a87ebb07-7184-11f1-901c-2dc96ab54e68', 'LSEMP016', '2026-06-26', '08:41:46', '17:23:59', 'Late', 8.70, 'Hikvision', '2026-06-26 17:30:00', 0),
('a882b70a-7184-11f1-901c-2dc96ab54e68', 'LSEMP007', '2026-06-26', '08:49:33', '16:15:02', 'Late', 7.42, 'Hikvision', '2026-06-26 17:30:00', 0),
('a8849bce-7184-11f1-901c-2dc96ab54e68', 'LSEMP015', '2026-06-26', '08:56:01', NULL, 'Late', 0.00, 'Hikvision', '2026-06-26 17:30:00', 0),
('a885c365-7184-11f1-901c-2dc96ab54e68', 'LSEMP005', '2026-06-26', '09:32:12', '16:12:22', 'Late', 6.67, 'Hikvision', '2026-06-26 17:30:00', 0),
('ATT-1782300269021', 'LSEMP003', '2026-06-24', '07:41:00', '12:00:00', 'Present', 4.32, 'Manual', '2026-06-24 11:24:29', 0),
('c9c3f695-8fe6-11f1-821b-97d04d116cec', 'LSEMP100', '2026-08-03', '05:36:24', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9c553bc-8fe6-11f1-821b-97d04d116cec', 'LSEMP101', '2026-08-03', '07:45:43', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9c66c71-8fe6-11f1-821b-97d04d116cec', 'LSEMP004', '2026-08-03', '07:58:51', '17:22:11', 'Present', 9.39, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9c7bba5-8fe6-11f1-821b-97d04d116cec', 'LSEMP006', '2026-08-03', '07:59:03', '17:19:18', 'Present', 9.34, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9c9065e-8fe6-11f1-821b-97d04d116cec', 'LSEMP023', '2026-08-03', '07:59:23', '17:12:12', 'Present', 9.21, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9ca0c2c-8fe6-11f1-821b-97d04d116cec', 'LSEMP007', '2026-08-03', '07:59:29', '17:35:11', 'Present', 9.60, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9cb258b-8fe6-11f1-821b-97d04d116cec', 'LSEMP021', '2026-08-03', '07:59:35', '17:19:13', 'Present', 9.33, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9ce22ea-8fe6-11f1-821b-97d04d116cec', 'LSEMP103', '2026-08-03', '08:03:47', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9d0d5cc-8fe6-11f1-821b-97d04d116cec', 'LSEMP008', '2026-08-03', '08:07:25', '17:35:56', 'Present', 9.48, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9d2cd67-8fe6-11f1-821b-97d04d116cec', 'LSEMP005', '2026-08-03', '08:17:51', '17:03:11', 'Present', 8.76, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9d56fdd-8fe6-11f1-821b-97d04d116cec', 'LSEMP024', '2026-08-03', '08:18:23', '17:05:32', 'Present', 8.79, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9d7d0fc-8fe6-11f1-821b-97d04d116cec', 'LSEMP022', '2026-08-03', '08:20:34', '17:05:05', 'Present', 8.74, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9da1a70-8fe6-11f1-821b-97d04d116cec', 'LSEMP016', '2026-08-03', '08:34:26', '17:17:50', 'Late', 8.72, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9dc0c16-8fe6-11f1-821b-97d04d116cec', 'LSEMP015', '2026-08-03', '09:34:38', '17:53:56', 'Late', 8.32, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9de2aa9-8fe6-11f1-821b-97d04d116cec', 'LSEMP003', '2026-08-03', '10:17:13', NULL, 'Late', 0.00, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9fb74ba-8fe6-11f1-821b-97d04d116cec', 'LSEMP100', '2026-08-04', '05:34:37', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9fd553d-8fe6-11f1-821b-97d04d116cec', 'LSEMP101', '2026-08-04', '07:14:24', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:01', 0),
('c9feffe2-8fe6-11f1-821b-97d04d116cec', 'LSEMP023', '2026-08-04', '07:43:38', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:01', 0),
('ca00b3c0-8fe6-11f1-821b-97d04d116cec', 'LSEMP022', '2026-08-04', '07:43:43', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:01', 0),
('ca027fff-8fe6-11f1-821b-97d04d116cec', 'LSEMP004', '2026-08-04', '07:43:49', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:01', 0),
('ca0486c2-8fe6-11f1-821b-97d04d116cec', 'LSEMP006', '2026-08-04', '07:43:54', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:01', 0),
('ca071a98-8fe6-11f1-821b-97d04d116cec', 'LSEMP008', '2026-08-04', '07:59:33', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:01', 0),
('ca095f7b-8fe6-11f1-821b-97d04d116cec', 'LSEMP024', '2026-08-04', '08:03:25', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:02', 0),
('ca0bec34-8fe6-11f1-821b-97d04d116cec', 'LSEMP016', '2026-08-04', '08:03:57', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:02', 0),
('ca0e11dc-8fe6-11f1-821b-97d04d116cec', 'LSEMP103', '2026-08-04', '08:09:10', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:02', 0),
('ca1032d4-8fe6-11f1-821b-97d04d116cec', 'LSEMP007', '2026-08-04', '08:09:20', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:02', 0),
('ca125ffd-8fe6-11f1-821b-97d04d116cec', 'LSEMP005', '2026-08-04', '08:09:24', NULL, 'Present', 0.00, 'Hikvision', '2026-08-04 09:28:02', 0),
('cdaa58c1-7138-11f1-901c-2dc96ab54e68', 'LSEMP100', '2026-06-26', '05:18:50', NULL, 'Present', 0.00, 'Hikvision', '2026-06-26 08:27:01', 0),
('cdae3e9c-7138-11f1-901c-2dc96ab54e68', 'LSEMP023', '2026-06-26', '08:01:52', '17:25:21', 'Present', 9.39, 'Hikvision', '2026-06-26 08:27:01', 0),
('cdb0b031-7138-11f1-901c-2dc96ab54e68', 'LSEMP024', '2026-06-26', '08:01:59', '17:25:32', 'Present', 9.39, 'Hikvision', '2026-06-26 08:27:01', 0),
('cdb3023a-7138-11f1-901c-2dc96ab54e68', 'LSEMP008', '2026-06-26', '08:03:40', NULL, 'Present', 0.00, 'Hikvision', '2026-06-26 08:27:01', 0),
('cdb66127-7138-11f1-901c-2dc96ab54e68', 'LSEMP103', '2026-06-26', '08:08:22', NULL, 'Present', 0.00, 'Hikvision', '2026-06-26 08:27:01', 0),
('cdbbdd88-7138-11f1-901c-2dc96ab54e68', 'LSEMP022', '2026-06-26', '08:14:39', '17:25:28', 'Present', 9.18, 'Hikvision', '2026-06-26 08:27:01', 0),
('cdbe36b7-7138-11f1-901c-2dc96ab54e68', 'LSEMP004', '2026-06-26', '08:15:00', NULL, 'Present', 0.00, 'Hikvision', '2026-06-26 08:27:01', 0),
('cdc0dcb5-7138-11f1-901c-2dc96ab54e68', 'LSEMP021', '2026-06-26', '08:15:05', '17:25:37', 'Present', 9.18, 'Hikvision', '2026-06-26 08:27:01', 0),
('daf259f5-746b-11f1-8151-00155da0f77f', 'LSEMP016', '2026-06-30', '10:09:37', NULL, 'Late', 0.00, 'Hikvision', '2026-06-30 10:10:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `biometric_logs`
--

CREATE TABLE `biometric_logs` (
  `id` bigint(20) NOT NULL,
  `serial_no` bigint(20) DEFAULT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `employee_name` varchar(150) DEFAULT NULL,
  `event_type` varchar(100) DEFAULT NULL,
  `event_time` datetime DEFAULT NULL,
  `source` varchar(50) DEFAULT 'hikvision',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `biometric_logs`
--

INSERT INTO `biometric_logs` (`id`, `serial_no`, `employee_id`, `employee_name`, `event_type`, `event_time`, `source`, `created_at`) VALUES
(1, 292, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-06-24 08:12:14', 'hikvision', '2026-06-24 10:32:29'),
(2, 295, 'LSEMP016', 'Loedina Benyah', 'faceOrFpOrCardOrPw', '2026-06-24 08:12:27', 'hikvision', '2026-06-24 10:32:29'),
(3, 298, 'LSEMP021', 'Moragn Kpabitey', 'faceOrFpOrCardOrPw', '2026-06-24 08:13:43', 'hikvision', '2026-06-24 10:32:29'),
(4, 301, 'LSEMP004', 'Yayera Amedzro', 'faceOrFpOrCardOrPw', '2026-06-24 08:13:50', 'hikvision', '2026-06-24 10:32:29'),
(5, 304, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-06-24 08:14:01', 'hikvision', '2026-06-24 10:32:29'),
(6, 307, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-06-24 08:14:22', 'hikvision', '2026-06-24 10:32:29'),
(7, 313, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-06-24 08:41:10', 'hikvision', '2026-06-24 10:32:29'),
(8, 317, 'LSEMP015', 'Laila Klutse', 'faceOrFpOrCardOrPw', '2026-06-24 09:06:17', 'hikvision', '2026-06-24 10:32:29'),
(241, 325, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-06-24 10:20:12', 'hikvision', '2026-06-24 10:50:01'),
(243, 328, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-06-24 10:41:02', 'hikvision', '2026-06-24 10:50:01'),
(1351, 379, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-06-25 08:00:06', 'hikvision', '2026-06-25 10:31:00'),
(1352, 382, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-06-25 08:10:37', 'hikvision', '2026-06-25 10:31:00'),
(1353, 385, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-06-25 08:10:51', 'hikvision', '2026-06-25 10:31:00'),
(1354, 387, 'LSEMP021', 'Morgan Kpabitey', 'faceOrFpOrCardOrPw', '2026-06-25 08:10:55', 'hikvision', '2026-06-25 10:31:00'),
(1355, 389, 'LSEMP004', 'Yayera Amedzro', 'faceOrFpOrCardOrPw', '2026-06-25 08:11:02', 'hikvision', '2026-06-25 10:31:00'),
(1356, 392, 'LSEMP012', 'Samuel Quarshie', 'faceOrFpOrCardOrPw', '2026-06-25 08:16:51', 'hikvision', '2026-06-25 10:31:00'),
(1357, 395, 'LSEMP008', 'Pearl Baah', 'faceOrFpOrCardOrPw', '2026-06-25 08:20:08', 'hikvision', '2026-06-25 10:31:00'),
(1358, 398, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-06-25 08:20:14', 'hikvision', '2026-06-25 10:31:00'),
(1359, 405, 'LSEMP018', 'Mr Doe', 'faceOrFpOrCardOrPw', '2026-06-25 08:24:54', 'hikvision', '2026-06-25 10:31:00'),
(1360, 366, 'LSEMP100', 'C. Hannah', 'faceOrFpOrCardOrPw', '2026-06-25 05:27:58', 'hikvision', '2026-06-25 10:49:00'),
(1361, 370, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-06-25 06:43:57', 'hikvision', '2026-06-25 10:49:00'),
(1362, 373, 'LSEMP101', 'C. Esther', 'faceOrFpOrCardOrPw', '2026-06-25 07:28:32', 'hikvision', '2026-06-25 10:49:00'),
(1363, 376, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-06-25 07:54:08', 'hikvision', '2026-06-25 10:49:00'),
(1364, 430, 'LSEMP022', 'Goldilocks Ejere', 'fpAndPw', '2026-06-25 05:45:40', 'hikvision', '2026-06-25 13:46:00'),
(1365, 437, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-06-25 05:54:09', 'hikvision', '2026-06-25 13:55:00'),
(1366, 441, 'LSEMP018', 'Mr Doe', 'faceOrFpOrCardOrPw', '2026-06-25 13:57:29', 'hikvision', '2026-06-25 13:58:00'),
(1367, 444, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-06-25 14:19:24', 'hikvision', '2026-06-25 14:20:00'),
(1368, 447, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-06-25 14:53:09', 'hikvision', '2026-06-25 14:54:00'),
(1369, 450, 'LSEMP103', 'Bismark D', 'faceOrFpOrCardOrPw', '2026-06-25 15:17:59', 'hikvision', '2026-06-25 15:19:00'),
(1370, 453, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-06-25 15:26:24', 'hikvision', '2026-06-25 15:27:00'),
(1371, 456, 'LSEMP004', 'Yayera Amedzro', 'faceOrFpOrCardOrPw', '2026-06-25 15:46:14', 'hikvision', '2026-06-25 15:47:00'),
(1372, 462, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-06-25 16:23:04', 'hikvision', '2026-06-25 17:43:00'),
(1373, 465, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-06-25 16:23:18', 'hikvision', '2026-06-25 17:43:00'),
(1374, 471, 'LSEMP012', 'Samuel Quarshie', 'faceOrFpOrCardOrPw', '2026-06-25 17:04:17', 'hikvision', '2026-06-25 17:43:00'),
(1375, 506, 'LSEMP100', 'C. Hannah', 'faceOrFpOrCardOrPw', '2026-06-26 05:18:50', 'hikvision', '2026-06-26 08:27:01'),
(1376, 512, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-06-26 08:01:52', 'hikvision', '2026-06-26 08:27:01'),
(1377, 515, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-06-26 08:01:59', 'hikvision', '2026-06-26 08:27:01'),
(1378, 518, 'LSEMP008', 'Pearl Baah', 'faceOrFpOrCardOrPw', '2026-06-26 08:03:40', 'hikvision', '2026-06-26 08:27:01'),
(1379, 521, 'LSEMP103', 'Bismark D', 'faceOrFpOrCardOrPw', '2026-06-26 08:08:22', 'hikvision', '2026-06-26 08:27:01'),
(1380, 524, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-06-26 08:14:39', 'hikvision', '2026-06-26 08:27:01'),
(1381, 527, 'LSEMP004', 'Yayera Amedzro', 'faceOrFpOrCardOrPw', '2026-06-26 08:15:00', 'hikvision', '2026-06-26 08:27:01'),
(1382, 529, 'LSEMP021', 'Morgan Kpabitey', 'faceOrFpOrCardOrPw', '2026-06-26 08:15:05', 'hikvision', '2026-06-26 08:27:01'),
(1383, 531, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-06-26 08:17:35', 'hikvision', '2026-06-26 17:30:00'),
(1384, 534, 'LSEMP003', 'Francis Dogbey', 'faceOrFpOrCardOrPw', '2026-06-26 08:23:24', 'hikvision', '2026-06-26 17:30:00'),
(1385, 539, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-06-26 08:41:46', 'hikvision', '2026-06-26 17:30:00'),
(1386, 544, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-06-26 08:41:55', 'hikvision', '2026-06-26 17:30:00'),
(1387, 550, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-06-26 08:49:33', 'hikvision', '2026-06-26 17:30:00'),
(1388, 553, 'LSEMP015', 'Laila Klutse', 'faceOrFpOrCardOrPw', '2026-06-26 08:56:01', 'hikvision', '2026-06-26 17:30:00'),
(1389, 557, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-06-26 09:32:12', 'hikvision', '2026-06-26 17:30:00'),
(1390, 560, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-06-26 16:12:22', 'hikvision', '2026-06-26 17:30:00'),
(1391, 563, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-06-26 16:15:02', 'hikvision', '2026-06-26 17:30:00'),
(1392, 568, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-06-26 17:23:59', 'hikvision', '2026-06-26 17:30:00'),
(1393, 571, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-06-26 17:25:21', 'hikvision', '2026-06-26 17:30:00'),
(1394, 574, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-06-26 17:25:28', 'hikvision', '2026-06-26 17:30:00'),
(1395, 576, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-06-26 17:25:32', 'hikvision', '2026-06-26 17:30:00'),
(1396, 577, 'LSEMP021', 'Morgan Kpabitey', 'faceOrFpOrCardOrPw', '2026-06-26 17:25:37', 'hikvision', '2026-06-26 17:30:00'),
(1397, 648, 'LSEMP100', 'C. Hannah', 'faceOrFpOrCardOrPw', '2026-06-30 05:38:07', 'hikvision', '2026-06-30 09:30:00'),
(1398, 651, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-06-30 08:00:54', 'hikvision', '2026-06-30 09:30:00'),
(1399, 653, 'LSEMP101', 'C. Esther', 'faceOrFpOrCardOrPw', '2026-06-30 08:00:58', 'hikvision', '2026-06-30 09:30:00'),
(1400, 655, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-06-30 08:08:33', 'hikvision', '2026-06-30 09:30:00'),
(1401, 657, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-06-30 08:08:38', 'hikvision', '2026-06-30 09:30:00'),
(1402, 658, 'LSEMP021', 'Morgan Kpabitey', 'faceOrFpOrCardOrPw', '2026-06-30 08:08:42', 'hikvision', '2026-06-30 09:30:00'),
(1403, 660, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-06-30 08:19:07', 'hikvision', '2026-06-30 09:30:00'),
(1404, 664, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-06-30 08:34:24', 'hikvision', '2026-06-30 09:30:00'),
(1405, 667, 'LSEMP015', 'Laila Klutse', 'faceOrFpOrCardOrPw', '2026-06-30 08:41:46', 'hikvision', '2026-06-30 09:30:00'),
(1406, 670, 'LSEMP103', 'Bismark D', 'faceOrFpOrCardOrPw', '2026-06-30 08:49:07', 'hikvision', '2026-06-30 09:30:00'),
(1407, 674, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-06-30 08:56:07', 'hikvision', '2026-06-30 09:30:00'),
(1408, 677, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-06-30 10:09:37', 'hikvision', '2026-06-30 10:10:00'),
(1409, 680, 'LSEMP008', 'Pearl Baah', 'faceOrFpOrCardOrPw', '2026-06-30 10:35:50', 'hikvision', '2026-06-30 10:36:00'),
(1410, 2397, 'LSEMP100', 'C. Hannah', 'faceOrFpOrCardOrPw', '2026-08-03 05:36:24', 'hikvision', '2026-08-04 09:28:01'),
(1411, 2400, 'LSEMP101', 'C. Esther', 'faceOrFpOrCardOrPw', '2026-08-03 07:45:43', 'hikvision', '2026-08-04 09:28:01'),
(1412, 2403, 'LSEMP004', 'Yayera Amedzro', 'faceOrFpOrCardOrPw', '2026-08-03 07:58:51', 'hikvision', '2026-08-04 09:28:01'),
(1413, 2406, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-08-03 07:59:03', 'hikvision', '2026-08-04 09:28:01'),
(1414, 2409, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-08-03 07:59:23', 'hikvision', '2026-08-04 09:28:01'),
(1415, 2412, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-08-03 07:59:29', 'hikvision', '2026-08-04 09:28:01'),
(1416, 2416, 'LSEMP021', 'Morgan Kpabitey', 'faceOrFpOrCardOrPw', '2026-08-03 07:59:35', 'hikvision', '2026-08-04 09:28:01'),
(1417, 2419, 'LSEMP103', 'Bismark D', 'faceOrFpOrCardOrPw', '2026-08-03 08:03:47', 'hikvision', '2026-08-04 09:28:01'),
(1418, 2422, 'LSEMP008', 'Pearl Baah', 'faceOrFpOrCardOrPw', '2026-08-03 08:07:25', 'hikvision', '2026-08-04 09:28:01'),
(1419, 2425, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-08-03 08:17:51', 'hikvision', '2026-08-04 09:28:01'),
(1420, 2428, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-08-03 08:18:23', 'hikvision', '2026-08-04 09:28:01'),
(1421, 2431, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-08-03 08:20:34', 'hikvision', '2026-08-04 09:28:01'),
(1422, 2434, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-08-03 08:34:26', 'hikvision', '2026-08-04 09:28:01'),
(1423, 2437, 'LSEMP015', 'Laila Klutse', 'faceOrFpOrCardOrPw', '2026-08-03 09:34:38', 'hikvision', '2026-08-04 09:28:01'),
(1424, 2440, 'LSEMP003', 'Francis Dogbey', 'faceOrFpOrCardOrPw', '2026-08-03 10:17:13', 'hikvision', '2026-08-04 09:28:01'),
(1425, 2443, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-08-03 17:03:11', 'hikvision', '2026-08-04 09:28:01'),
(1426, 2446, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-08-03 17:05:05', 'hikvision', '2026-08-04 09:28:01'),
(1427, 2449, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-08-03 17:05:32', 'hikvision', '2026-08-04 09:28:01'),
(1428, 2452, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-08-03 17:12:12', 'hikvision', '2026-08-04 09:28:01'),
(1429, 2455, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-08-03 17:17:50', 'hikvision', '2026-08-04 09:28:01'),
(1430, 2458, 'LSEMP021', 'Morgan Kpabitey', 'faceOrFpOrCardOrPw', '2026-08-03 17:19:13', 'hikvision', '2026-08-04 09:28:01'),
(1431, 2461, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-08-03 17:19:18', 'hikvision', '2026-08-04 09:28:01'),
(1432, 2464, 'LSEMP004', 'Yayera Amedzro', 'faceOrFpOrCardOrPw', '2026-08-03 17:22:11', 'hikvision', '2026-08-04 09:28:01'),
(1433, 2467, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-08-03 17:35:11', 'hikvision', '2026-08-04 09:28:01'),
(1434, 2470, 'LSEMP008', 'Pearl Baah', 'faceOrFpOrCardOrPw', '2026-08-03 17:35:56', 'hikvision', '2026-08-04 09:28:01'),
(1435, 2473, 'LSEMP015', 'Laila Klutse', 'faceOrFpOrCardOrPw', '2026-08-03 17:53:56', 'hikvision', '2026-08-04 09:28:01'),
(1436, 2476, 'LSEMP100', 'C. Hannah', 'faceOrFpOrCardOrPw', '2026-08-04 05:34:37', 'hikvision', '2026-08-04 09:28:01'),
(1437, 2479, 'LSEMP101', 'C. Esther', 'faceOrFpOrCardOrPw', '2026-08-04 07:14:24', 'hikvision', '2026-08-04 09:28:01'),
(1438, 2482, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-08-04 07:43:38', 'hikvision', '2026-08-04 09:28:01'),
(1439, 2485, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-08-04 07:43:43', 'hikvision', '2026-08-04 09:28:01'),
(1440, 2488, 'LSEMP004', 'Yayera Amedzro', 'faceOrFpOrCardOrPw', '2026-08-04 07:43:49', 'hikvision', '2026-08-04 09:28:01'),
(1441, 2490, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-08-04 07:43:54', 'hikvision', '2026-08-04 09:28:01'),
(1442, 2492, 'LSEMP008', 'Pearl Baah', 'faceOrFpOrCardOrPw', '2026-08-04 07:59:33', 'hikvision', '2026-08-04 09:28:01'),
(1443, 2495, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-08-04 08:03:25', 'hikvision', '2026-08-04 09:28:01'),
(1444, 2498, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-08-04 08:03:57', 'hikvision', '2026-08-04 09:28:02'),
(1445, 2505, 'LSEMP103', 'Bismark D', 'faceOrFpOrCardOrPw', '2026-08-04 08:09:10', 'hikvision', '2026-08-04 09:28:02'),
(1446, 2508, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-08-04 08:09:20', 'hikvision', '2026-08-04 09:28:02'),
(1447, 2510, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-08-04 08:09:24', 'hikvision', '2026-08-04 09:28:02'),
(1448, 2512, 'LSEMP015', 'Laila Klutse', 'faceOrFpOrCardOrPw', '2026-08-04 09:32:28', 'hikvision', '2026-08-04 09:34:01');

-- --------------------------------------------------------

--
-- Table structure for table `company_settings`
--

CREATE TABLE `company_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `logo_url` text DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'GHS',
  `payroll_year` int(11) NOT NULL DEFAULT 2026,
  `employee_ssnit_rate` decimal(4,2) NOT NULL DEFAULT 5.50,
  `employer_ssnit_rate` decimal(4,2) NOT NULL DEFAULT 13.00,
  `default_working_hours` int(11) DEFAULT 8,
  `late_target_time` time DEFAULT '08:00:00',
  `late_grace_mins` int(11) DEFAULT 5,
  `late_deduction_rate` decimal(10,2) DEFAULT 50.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_settings`
--

INSERT INTO `company_settings` (`id`, `name`, `email`, `phone`, `address`, `logo_url`, `currency`, `payroll_year`, `employee_ssnit_rate`, `employer_ssnit_rate`, `default_working_hours`, `late_target_time`, `late_grace_mins`, `late_deduction_rate`) VALUES
(1, 'LEF Signature LTD', 'info@lefsignature.com', '+233000000000', 'Accra, Ghana', NULL, 'GHS', 2026, 5.00, 13.50, 8, '08:00:00', 30, 30.00);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(10) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `code`, `description`) VALUES
('DEPT001', 'Information Technology Updated', 'IT', 'Updated Department'),
('DEPT002', 'Human Resources', 'HR', 'Human Resource Department'),
('DEPT003', 'Finance', 'FIN', 'Finance and Accounting Department'),
('DEPT1781684924744', 'Security', 'SEC', 'Security Department'),
('DEPT1782292231760', 'ELECTRICAL ENGINEERING', '002', 'Engineering Department'),
('DEPT1782292343633', 'Business Development', '003', 'Business Development Unit'),
('DEPT1782292409237', 'Transport Department', '005', 'Transport Unit'),
('DEPT1782293427422', 'Administration', '001', 'Administration');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `other_names` varchar(100) DEFAULT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `date_of_birth` date NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `address` text NOT NULL,
  `date_employed` date NOT NULL,
  `department_id` varchar(50) DEFAULT NULL,
  `position` varchar(100) NOT NULL,
  `employment_type` enum('Full-Time','Part-Time','Contract','Temporary') NOT NULL DEFAULT 'Full-Time',
  `bank_name` varchar(100) NOT NULL,
  `bank_account` varchar(50) NOT NULL,
  `ssnit_number` varchar(50) NOT NULL,
  `ghana_card_number` varchar(50) DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `photo_url` text DEFAULT NULL,
  `biometric_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `first_name`, `last_name`, `other_names`, `gender`, `date_of_birth`, `phone_number`, `email`, `address`, `date_employed`, `department_id`, `position`, `employment_type`, `bank_name`, `bank_account`, `ssnit_number`, `ghana_card_number`, `status`, `photo_url`, `biometric_id`) VALUES
('LSEMP003', 'Francis', 'Dogbey', '', 'Male', '1979-06-01', '0242753409', 'fkdogbey@lefsignature.com', 'Ashaley Botwe', '2025-10-27', 'DEPT1782292231760', 'Head of Operations', 'Full-Time', 'FIDELITY BANK', '1400053168711', 'E157906010079', 'GHA-713200448-3', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP004', 'Yayera', 'Amedzro', '', 'Female', '1993-06-19', '0543291481', 'yamedzro@lefsignature.com', 'Adenta', '2025-10-27', 'DEPT002', 'Human Resource Manager', 'Full-Time', 'FIDELITY BANK', '2030053168611', 'F019306190329', 'GHA-718181395-1', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP005', 'Bernice', 'Opoku- Aamaniampong', '', 'Female', '2002-08-14', '0240000005', 'bernice@lefpayroll.local', 'Kasoa', '2025-10-27', 'DEPT1782292343633', 'Business Developer', 'Full-Time', 'FIDELITY BANK', '1400053168416', 'C010208140208', 'GHA-727540910-1', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP006', 'Emmanuel', 'Appiah', 'Kwaku', 'Male', '1996-05-15', '02543150780', 'ekappiah@lefsignature.com', 'Adenta', '2025-10-27', 'DEPT001', 'IT & Software Engineer', 'Full-Time', 'FIDELITY BANK', '2030053169410', 'C019605150515', 'GHA-726370721-3', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP007', 'Portia', 'Larbi', '', 'Female', '1998-01-27', '0541784251', 'plarbi@lefsignature.com', 'Dansoman', '2025-10-27', 'DEPT1782292343633', 'Business Development Manager ', 'Full-Time', 'FIDELITY BANK', '2030053169319', 'B089801270022', 'GHA- 723822151-1', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP008', 'Pearl', 'Agyei-Baah', 'Pokua', 'Female', '2004-07-20', '0545180986', 'steezevogue@gmail.com', 'Kasoa', '2025-10-27', 'DEPT1782293427422', 'Customer Care', 'Full-Time', 'FIDELITY BANK', '2030053169918', '2510518893', 'GHA-000224433-4', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP012', 'Samuel', 'Quarshie', '', 'Male', '1994-06-06', '0556367684', 'electricaltechnician003@gmail.com', 'Teshie', '2025-10-27', 'DEPT1782292231760', 'Electrical Technician', 'Full-Time', 'FIDELITY BANK', '2030053168815', 'E129406060010', 'GHA-722309527-7', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP015', 'Laila', 'Kluste', '', 'Female', '1980-11-14', '0209323836', 'lklutse@lefsignature.com', 'Tema', '2025-10-27', 'DEPT1782293427422', 'Executive Secretary / Administrator', 'Temporary', 'FIDELITY BANK', '1400053169011', 'C018011140084', 'GHA-728195521-2', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP016', 'Lordina', 'Benyah', '', 'Female', '1991-10-02', '0548776694', 'lbenyah@lefsignature.com', 'Tema- Gbetsele', '2026-10-27', 'DEPT1782292343633', 'Business Developer', 'Temporary', 'FIDELITY BANK', '1400053169113', 'C019110020587', 'GHA-001037193-4', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP018', 'Doe', 'Agbodo', '', 'Male', '1984-08-13', '0244842172', 'agbodo06@gmail.com', 'Santoe', '2025-10-27', 'DEPT1782292231760', 'Technician', 'Full-Time', 'FIDELITY BANK', '2030053180617', 'D198408130039', 'GHA-001300562-3', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP021', 'Morgan', 'Kpabitey', 'Tei', 'Male', '1995-01-01', '0240000021', 'mkpabitey@lefsignature.com', 'Oyarifa', '2026-02-02', 'DEPT1782292231760', 'Technical Support & Solutions Engineer', 'Temporary', 'FIDELITY BANK', '2030053224916', 'E189811100010', 'GHA-727421084-1', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP022', 'Goldilocks', 'Emson', 'Ejere', 'Female', '1999-11-19', '0540885695', 'goldilocksemsonejere@gmail.com', 'Lakeside Estate', '2026-05-04', 'DEPT1782293427422', 'Front Desk Executive', 'Temporary', 'Stanbic Bank', '9040009822083', 'D199911190047', 'GHA-728706499-8', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP023', 'Hillary', 'Adjei', '', 'Female', '1990-01-01', '0240000023', 'hillary@lefpayroll.local', 'Accra', '2026-01-01', 'DEPT1782292343633', 'Employee', 'Temporary', 'GCB Bank', '100023', 'SSNIT023', 'GHA023', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP024', 'Gifty', 'Owusu', 'Adomah', 'Female', '2002-08-01', '0598142680', 'gadomah@lefsignature.com', 'Spintex', '2026-05-04', 'DEPT1782292343633', 'Business Developer', 'Temporary', 'CALBANK ', '1400004402105', 'C010208010287', 'GHA-125460580-1', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP100', 'Hannah', 'Datsomor', '', 'Female', '2004-07-29', '0547449674', 'datsomorhannah@gmail.com', 'Lashibi', '2026-02-02', 'DEPT1782293427422', 'Janitor', 'Temporary', 'GCB Bank', '100100', 'SSNIT100', 'GHA100', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP101', 'Esther', 'Ofori', '', 'Female', '1975-12-12', '0543433997', 'esther@lefpayroll.local', 'Ashaiman', '2026-02-02', 'DEPT1782293427422', 'Janitor', 'Temporary', 'GCB Bank', '100101', 'SSNIT101', 'GHA101', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP102', 'Samuel', 'Adufu', '', 'Male', '1997-07-28', '0249335689', 'samuel102@lefpayroll.local', 'Lashibi', '2026-02-04', 'DEPT1781684924744', 'Security Officer', 'Temporary', 'GCB Bank', '100102', 'SSNIT0309328', 'GHA-7140812964', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL),
('LSEMP103', 'Bismark', 'Agbodzi', '', 'Male', '1997-08-01', '0595995026', 'bismarkagbodzi313@gmail.com', 'Santoe', '2026-01-19', 'DEPT1782292409237', 'Driver', 'Temporary', 'FIDELITY BANK', '2100907694612', 'D019708010082', 'GHA-7289492878', 'Active', 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hikvision_raw_logs`
--

CREATE TABLE `hikvision_raw_logs` (
  `id` bigint(20) NOT NULL,
  `serial_no` bigint(20) DEFAULT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `employee_name` varchar(255) DEFAULT NULL,
  `event_type` varchar(100) DEFAULT NULL,
  `event_time` datetime DEFAULT NULL,
  `source` varchar(20) DEFAULT 'hikvision',
  `raw_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`raw_json`)),
  `imported` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hikvision_raw_logs`
--

INSERT INTO `hikvision_raw_logs` (`id`, `serial_no`, `employee_id`, `employee_name`, `event_type`, `event_time`, `source`, `raw_json`, `imported`, `created_at`) VALUES
(1, 506, 'LSEMP100', 'C. Hannah', 'faceOrFpOrCardOrPw', '2026-06-26 05:18:50', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T05:18:50-00:00\",\"cardType\":1,\"name\":\"C. Hannah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP100\",\"serialNo\":506,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 08:27:01'),
(2, 512, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-06-26 08:01:52', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:01:52-00:00\",\"cardType\":1,\"name\":\"Hillary Adjei\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP023\",\"serialNo\":512,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 08:27:01'),
(3, 515, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-06-26 08:01:59', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:01:59-00:00\",\"cardType\":1,\"name\":\"Gifty Owusu\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP024\",\"serialNo\":515,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 08:27:01'),
(4, 518, 'LSEMP008', 'Pearl Baah', 'faceOrFpOrCardOrPw', '2026-06-26 08:03:40', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:03:40-00:00\",\"cardType\":1,\"name\":\"Pearl Baah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP008\",\"serialNo\":518,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 08:27:01'),
(5, 521, 'LSEMP103', 'Bismark D', 'faceOrFpOrCardOrPw', '2026-06-26 08:08:22', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:08:22-00:00\",\"cardType\":1,\"name\":\"Bismark D\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP103\",\"serialNo\":521,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 08:27:01'),
(6, 524, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-06-26 08:14:39', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:14:39-00:00\",\"cardType\":1,\"name\":\"Goldilocks Ejere\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP022\",\"serialNo\":524,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 08:27:01'),
(7, 527, 'LSEMP004', 'Yayera Amedzro', 'faceOrFpOrCardOrPw', '2026-06-26 08:15:00', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:15:00-00:00\",\"cardType\":1,\"name\":\"Yayera Amedzro\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP004\",\"serialNo\":527,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 08:27:01'),
(8, 529, 'LSEMP021', 'Morgan Kpabitey', 'faceOrFpOrCardOrPw', '2026-06-26 08:15:05', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:15:05-00:00\",\"cardType\":1,\"name\":\"Morgan Kpabitey\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP021\",\"serialNo\":529,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 08:27:01'),
(425, 531, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-06-26 08:17:35', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:17:35-00:00\",\"cardType\":1,\"name\":\"Emmanuel Appiah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP006\",\"serialNo\":531,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(426, 534, 'LSEMP003', 'Francis Dogbey', 'faceOrFpOrCardOrPw', '2026-06-26 08:23:24', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:23:24-00:00\",\"cardType\":1,\"name\":\"Francis Dogbey\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP003\",\"serialNo\":534,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(427, 539, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-06-26 08:41:46', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:41:46-00:00\",\"cardType\":1,\"name\":\"Lordina Benyah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP016\",\"serialNo\":539,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(428, 544, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-06-26 08:41:55', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:41:55-00:00\",\"cardType\":1,\"name\":\"Lordina Benyah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP016\",\"serialNo\":544,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(429, 550, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-06-26 08:49:33', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:49:33-00:00\",\"cardType\":1,\"name\":\"Portia Larbi\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP007\",\"serialNo\":550,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(430, 553, 'LSEMP015', 'Laila Klutse', 'faceOrFpOrCardOrPw', '2026-06-26 08:56:01', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T08:56:01-00:00\",\"cardType\":1,\"name\":\"Laila Klutse\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP015\",\"serialNo\":553,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(431, 557, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-06-26 09:32:12', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T09:32:12-00:00\",\"cardType\":1,\"name\":\"Bernice Opoku\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP005\",\"serialNo\":557,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(432, 560, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-06-26 16:12:22', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T16:12:22-00:00\",\"cardType\":1,\"name\":\"Bernice Opoku\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP005\",\"serialNo\":560,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(433, 563, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-06-26 16:15:02', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T16:15:02-00:00\",\"cardType\":1,\"name\":\"Portia Larbi\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP007\",\"serialNo\":563,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(434, 568, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-06-26 17:23:59', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T17:23:59-00:00\",\"cardType\":1,\"name\":\"Lordina Benyah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP016\",\"serialNo\":568,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(435, 571, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-06-26 17:25:21', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T17:25:21-00:00\",\"cardType\":1,\"name\":\"Hillary Adjei\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP023\",\"serialNo\":571,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(436, 574, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-06-26 17:25:28', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T17:25:28-00:00\",\"cardType\":1,\"name\":\"Goldilocks Ejere\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP022\",\"serialNo\":574,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(437, 576, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-06-26 17:25:32', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T17:25:32-00:00\",\"cardType\":1,\"name\":\"Gifty Owusu\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP024\",\"serialNo\":576,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(438, 577, 'LSEMP021', 'Morgan Kpabitey', 'faceOrFpOrCardOrPw', '2026-06-26 17:25:37', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-26T17:25:37-00:00\",\"cardType\":1,\"name\":\"Morgan Kpabitey\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP021\",\"serialNo\":577,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-26 17:30:00'),
(659, 648, 'LSEMP100', 'C. Hannah', 'faceOrFpOrCardOrPw', '2026-06-30 05:38:07', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T05:38:07-00:00\",\"cardType\":1,\"name\":\"C. Hannah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP100\",\"serialNo\":648,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 09:30:00'),
(660, 651, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-06-30 08:00:54', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T08:00:54-00:00\",\"cardType\":1,\"name\":\"Hillary Adjei\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP023\",\"serialNo\":651,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 09:30:00'),
(661, 653, 'LSEMP101', 'C. Esther', 'faceOrFpOrCardOrPw', '2026-06-30 08:00:58', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T08:00:58-00:00\",\"cardType\":1,\"name\":\"C. Esther\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP101\",\"serialNo\":653,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 09:30:00'),
(662, 655, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-06-30 08:08:33', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T08:08:33-00:00\",\"cardType\":1,\"name\":\"Goldilocks Ejere\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP022\",\"serialNo\":655,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 09:30:00'),
(663, 657, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-06-30 08:08:38', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T08:08:38-00:00\",\"cardType\":1,\"name\":\"Emmanuel Appiah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP006\",\"serialNo\":657,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 09:30:00'),
(664, 658, 'LSEMP021', 'Morgan Kpabitey', 'faceOrFpOrCardOrPw', '2026-06-30 08:08:42', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T08:08:42-00:00\",\"cardType\":1,\"name\":\"Morgan Kpabitey\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP021\",\"serialNo\":658,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 09:30:00'),
(665, 660, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-06-30 08:19:07', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T08:19:07-00:00\",\"cardType\":1,\"name\":\"Bernice Opoku\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP005\",\"serialNo\":660,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 09:30:00'),
(666, 664, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-06-30 08:34:24', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T08:34:24-00:00\",\"cardType\":1,\"name\":\"Gifty Owusu\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP024\",\"serialNo\":664,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 09:30:00'),
(667, 667, 'LSEMP015', 'Laila Klutse', 'faceOrFpOrCardOrPw', '2026-06-30 08:41:46', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T08:41:46-00:00\",\"cardType\":1,\"name\":\"Laila Klutse\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP015\",\"serialNo\":667,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 09:30:00'),
(668, 670, 'LSEMP103', 'Bismark D', 'faceOrFpOrCardOrPw', '2026-06-30 08:49:07', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T08:49:07-00:00\",\"cardType\":1,\"name\":\"Bismark D\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP103\",\"serialNo\":670,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 09:30:00'),
(669, 674, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-06-30 08:56:07', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T08:56:07-00:00\",\"cardType\":1,\"name\":\"Portia Larbi\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP007\",\"serialNo\":674,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 09:30:00'),
(1110, 677, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-06-30 10:09:37', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T10:09:37-00:00\",\"cardType\":1,\"name\":\"Lordina Benyah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP016\",\"serialNo\":677,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 10:10:00'),
(1219, 680, 'LSEMP008', 'Pearl Baah', 'faceOrFpOrCardOrPw', '2026-06-30 10:35:50', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-06-30T10:35:50-00:00\",\"cardType\":1,\"name\":\"Pearl Baah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP008\",\"serialNo\":680,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-06-30 10:36:00'),
(1441, 2397, 'LSEMP100', 'C. Hannah', 'faceOrFpOrCardOrPw', '2026-08-03 05:36:24', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T05:36:24-00:00\",\"cardType\":1,\"name\":\"C. Hannah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP100\",\"serialNo\":2397,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1442, 2400, 'LSEMP101', 'C. Esther', 'faceOrFpOrCardOrPw', '2026-08-03 07:45:43', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T07:45:43-00:00\",\"cardType\":1,\"name\":\"C. Esther\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP101\",\"serialNo\":2400,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1443, 2403, 'LSEMP004', 'Yayera Amedzro', 'faceOrFpOrCardOrPw', '2026-08-03 07:58:51', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T07:58:51-00:00\",\"cardType\":1,\"name\":\"Yayera Amedzro\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP004\",\"serialNo\":2403,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1444, 2406, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-08-03 07:59:03', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T07:59:03-00:00\",\"cardType\":1,\"name\":\"Emmanuel Appiah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP006\",\"serialNo\":2406,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1445, 2409, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-08-03 07:59:23', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T07:59:23-00:00\",\"cardType\":1,\"name\":\"Hillary Adjei\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP023\",\"serialNo\":2409,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1446, 2412, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-08-03 07:59:29', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T07:59:29-00:00\",\"cardType\":1,\"name\":\"Portia Larbi\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP007\",\"serialNo\":2412,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1447, 2416, 'LSEMP021', 'Morgan Kpabitey', 'faceOrFpOrCardOrPw', '2026-08-03 07:59:35', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T07:59:35-00:00\",\"cardType\":1,\"name\":\"Morgan Kpabitey\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP021\",\"serialNo\":2416,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1448, 2419, 'LSEMP103', 'Bismark D', 'faceOrFpOrCardOrPw', '2026-08-03 08:03:47', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T08:03:47-00:00\",\"cardType\":1,\"name\":\"Bismark D\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP103\",\"serialNo\":2419,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1449, 2422, 'LSEMP008', 'Pearl Baah', 'faceOrFpOrCardOrPw', '2026-08-03 08:07:25', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T08:07:25-00:00\",\"cardType\":1,\"name\":\"Pearl Baah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP008\",\"serialNo\":2422,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1450, 2425, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-08-03 08:17:51', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T08:17:51-00:00\",\"cardType\":1,\"name\":\"Bernice Opoku\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP005\",\"serialNo\":2425,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1451, 2428, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-08-03 08:18:23', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T08:18:23-00:00\",\"cardType\":1,\"name\":\"Gifty Owusu\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP024\",\"serialNo\":2428,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1452, 2431, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-08-03 08:20:34', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T08:20:34-00:00\",\"cardType\":1,\"name\":\"Goldilocks Ejere\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP022\",\"serialNo\":2431,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1453, 2434, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-08-03 08:34:26', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T08:34:26-00:00\",\"cardType\":1,\"name\":\"Lordina Benyah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP016\",\"serialNo\":2434,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1454, 2437, 'LSEMP015', 'Laila Klutse', 'faceOrFpOrCardOrPw', '2026-08-03 09:34:38', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T09:34:38-00:00\",\"cardType\":1,\"name\":\"Laila Klutse\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP015\",\"serialNo\":2437,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1455, 2440, 'LSEMP003', 'Francis Dogbey', 'faceOrFpOrCardOrPw', '2026-08-03 10:17:13', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T10:17:13-00:00\",\"cardType\":1,\"name\":\"Francis Dogbey\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP003\",\"serialNo\":2440,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1456, 2443, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-08-03 17:03:11', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T17:03:11-00:00\",\"cardType\":1,\"name\":\"Bernice Opoku\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP005\",\"serialNo\":2443,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1457, 2446, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-08-03 17:05:05', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T17:05:05-00:00\",\"cardType\":1,\"name\":\"Goldilocks Ejere\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP022\",\"serialNo\":2446,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1458, 2449, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-08-03 17:05:32', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T17:05:32-00:00\",\"cardType\":1,\"name\":\"Gifty Owusu\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP024\",\"serialNo\":2449,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1459, 2452, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-08-03 17:12:12', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T17:12:12-00:00\",\"cardType\":1,\"name\":\"Hillary Adjei\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP023\",\"serialNo\":2452,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1460, 2455, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-08-03 17:17:50', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T17:17:50-00:00\",\"cardType\":1,\"name\":\"Lordina Benyah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP016\",\"serialNo\":2455,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1461, 2458, 'LSEMP021', 'Morgan Kpabitey', 'faceOrFpOrCardOrPw', '2026-08-03 17:19:13', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T17:19:13-00:00\",\"cardType\":1,\"name\":\"Morgan Kpabitey\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP021\",\"serialNo\":2458,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1462, 2461, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-08-03 17:19:18', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T17:19:18-00:00\",\"cardType\":1,\"name\":\"Emmanuel Appiah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP006\",\"serialNo\":2461,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1463, 2464, 'LSEMP004', 'Yayera Amedzro', 'faceOrFpOrCardOrPw', '2026-08-03 17:22:11', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T17:22:11-00:00\",\"cardType\":1,\"name\":\"Yayera Amedzro\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP004\",\"serialNo\":2464,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1464, 2467, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-08-03 17:35:11', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T17:35:11-00:00\",\"cardType\":1,\"name\":\"Portia Larbi\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP007\",\"serialNo\":2467,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1465, 2470, 'LSEMP008', 'Pearl Baah', 'faceOrFpOrCardOrPw', '2026-08-03 17:35:56', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T17:35:56-00:00\",\"cardType\":1,\"name\":\"Pearl Baah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP008\",\"serialNo\":2470,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1466, 2473, 'LSEMP015', 'Laila Klutse', 'faceOrFpOrCardOrPw', '2026-08-03 17:53:56', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-03T17:53:56-00:00\",\"cardType\":1,\"name\":\"Laila Klutse\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP015\",\"serialNo\":2473,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1467, 2476, 'LSEMP100', 'C. Hannah', 'faceOrFpOrCardOrPw', '2026-08-04 05:34:37', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T05:34:37-00:00\",\"cardType\":1,\"name\":\"C. Hannah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP100\",\"serialNo\":2476,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1468, 2479, 'LSEMP101', 'C. Esther', 'faceOrFpOrCardOrPw', '2026-08-04 07:14:24', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T07:14:24-00:00\",\"cardType\":1,\"name\":\"C. Esther\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP101\",\"serialNo\":2479,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1469, 2482, 'LSEMP023', 'Hillary Adjei', 'faceOrFpOrCardOrPw', '2026-08-04 07:43:38', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T07:43:38-00:00\",\"cardType\":1,\"name\":\"Hillary Adjei\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP023\",\"serialNo\":2482,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1470, 2485, 'LSEMP022', 'Goldilocks Ejere', 'faceOrFpOrCardOrPw', '2026-08-04 07:43:43', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T07:43:43-00:00\",\"cardType\":1,\"name\":\"Goldilocks Ejere\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP022\",\"serialNo\":2485,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1471, 2488, 'LSEMP004', 'Yayera Amedzro', 'faceOrFpOrCardOrPw', '2026-08-04 07:43:49', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T07:43:49-00:00\",\"cardType\":1,\"name\":\"Yayera Amedzro\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP004\",\"serialNo\":2488,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1472, 2490, 'LSEMP006', 'Emmanuel Appiah', 'faceOrFpOrCardOrPw', '2026-08-04 07:43:54', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T07:43:54-00:00\",\"cardType\":1,\"name\":\"Emmanuel Appiah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP006\",\"serialNo\":2490,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1473, 2492, 'LSEMP008', 'Pearl Baah', 'faceOrFpOrCardOrPw', '2026-08-04 07:59:33', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T07:59:33-00:00\",\"cardType\":1,\"name\":\"Pearl Baah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP008\",\"serialNo\":2492,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1474, 2495, 'LSEMP024', 'Gifty Owusu', 'faceOrFpOrCardOrPw', '2026-08-04 08:03:25', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T08:03:25-00:00\",\"cardType\":1,\"name\":\"Gifty Owusu\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP024\",\"serialNo\":2495,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1475, 2498, 'LSEMP016', 'Lordina Benyah', 'faceOrFpOrCardOrPw', '2026-08-04 08:03:57', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T08:03:57-00:00\",\"cardType\":1,\"name\":\"Lordina Benyah\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP016\",\"serialNo\":2498,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1476, 2505, 'LSEMP103', 'Bismark D', 'faceOrFpOrCardOrPw', '2026-08-04 08:09:10', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T08:09:10-00:00\",\"cardType\":1,\"name\":\"Bismark D\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP103\",\"serialNo\":2505,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1477, 2508, 'LSEMP007', 'Portia Larbi', 'faceOrFpOrCardOrPw', '2026-08-04 08:09:20', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T08:09:20-00:00\",\"cardType\":1,\"name\":\"Portia Larbi\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP007\",\"serialNo\":2508,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1478, 2510, 'LSEMP005', 'Bernice Opoku', 'faceOrFpOrCardOrPw', '2026-08-04 08:09:24', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T08:09:24-00:00\",\"cardType\":1,\"name\":\"Bernice Opoku\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP005\",\"serialNo\":2510,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:28:01'),
(1707, 2512, 'LSEMP015', 'Laila Klutse', 'faceOrFpOrCardOrPw', '2026-08-04 09:32:28', 'hikvision', '{\"major\":5,\"minor\":38,\"time\":\"2026-08-04T09:32:28-00:00\",\"cardType\":1,\"name\":\"Laila Klutse\",\"cardReaderNo\":1,\"doorNo\":1,\"employeeNoString\":\"LSEMP015\",\"serialNo\":2512,\"userType\":\"normal\",\"currentVerifyMode\":\"faceOrFpOrCardOrPw\",\"mask\":\"unknown\"}', 1, '2026-08-04 09:34:01');

-- --------------------------------------------------------

--
-- Table structure for table `hikvision_settings`
--

CREATE TABLE `hikvision_settings` (
  `id` int(11) NOT NULL,
  `device_name` varchar(100) DEFAULT NULL,
  `device_ip` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hikvision_settings`
--

INSERT INTO `hikvision_settings` (`id`, `device_name`, `device_ip`, `username`, `password`, `is_active`, `created_at`) VALUES
(1, 'Main Attendance Device', '192.168.100.188', 'admin', 'LEFADMIN@12345', 1, '2026-06-17 17:42:47');

-- --------------------------------------------------------

--
-- Table structure for table `hikvision_sync_logs`
--

CREATE TABLE `hikvision_sync_logs` (
  `id` int(11) NOT NULL,
  `last_serial_no` bigint(20) DEFAULT NULL,
  `last_sync_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hikvision_sync_logs`
--

INSERT INTO `hikvision_sync_logs` (`id`, `last_serial_no`, `last_sync_time`) VALUES
(1, 323, '2026-06-24 10:09:10');

-- --------------------------------------------------------

--
-- Table structure for table `hikvision_sync_state`
--

CREATE TABLE `hikvision_sync_state` (
  `id` int(11) NOT NULL,
  `last_serial` bigint(20) DEFAULT 0,
  `last_sync` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hikvision_sync_state`
--

INSERT INTO `hikvision_sync_state` (`id`, `last_serial`, `last_sync`) VALUES
(1, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payroll_items`
--

CREATE TABLE `payroll_items` (
  `id` varchar(50) NOT NULL,
  `payroll_run_id` varchar(50) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `employee_name` varchar(200) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `basic_salary` decimal(15,2) NOT NULL,
  `transport_allowance` decimal(15,2) NOT NULL,
  `housing_allowance` decimal(15,2) NOT NULL,
  `utility_allowance` decimal(15,2) NOT NULL,
  `risk_allowance` decimal(15,2) NOT NULL,
  `other_allowances` decimal(15,2) NOT NULL,
  `gross_salary` decimal(15,2) NOT NULL,
  `employee_ssnit` decimal(15,2) NOT NULL,
  `taxable_income` decimal(15,2) NOT NULL,
  `paye` decimal(15,2) NOT NULL,
  `other_deductions` decimal(15,2) NOT NULL,
  `net_salary` decimal(15,2) NOT NULL,
  `employer_ssnit` decimal(15,2) NOT NULL,
  `late_days_count` int(11) DEFAULT 0,
  `lateness_deduction` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payroll_items`
--

INSERT INTO `payroll_items` (`id`, `payroll_run_id`, `employee_id`, `employee_name`, `department_name`, `basic_salary`, `transport_allowance`, `housing_allowance`, `utility_allowance`, `risk_allowance`, `other_allowances`, `gross_salary`, `employee_ssnit`, `taxable_income`, `paye`, `other_deductions`, `net_salary`, `employer_ssnit`, `late_days_count`, `lateness_deduction`) VALUES
('ITEM-1782814343270-LSEMP003', 'RUN-1782814343238', 'LSEMP003', 'Francis Dogbey', 'ELECTRICAL ENGINEERING', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00),
('ITEM-1782814343285-LSEMP004', 'RUN-1782814343238', 'LSEMP004', 'Yayera Amedzro', 'Human Resources', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00),
('ITEM-1782814343292-LSEMP005', 'RUN-1782814343238', 'LSEMP005', 'Bernice Opoku- Aamaniampong', 'Business Development', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, -100.00, 0.00, 2, 100.00),
('ITEM-1782814343302-LSEMP006', 'RUN-1782814343238', 'LSEMP006', 'Emmanuel Appiah', 'Information Technology Updated', 9570.99, 450.00, 160.00, 500.00, 0.00, 40.00, 10720.99, 478.55, 10242.44, 2244.86, 0.00, 7997.58, 1292.08, 0, 0.00),
('ITEM-1782814343312-LSEMP007', 'RUN-1782814343238', 'LSEMP007', 'Portia Larbi', 'Business Development', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, -150.00, 0.00, 3, 150.00),
('ITEM-1782814343327-LSEMP008', 'RUN-1782814343238', 'LSEMP008', 'Pearl Agyei-Baah', 'Administration', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00),
('ITEM-1782814343336-LSEMP012', 'RUN-1782814343238', 'LSEMP012', 'Samuel Quarshie', 'ELECTRICAL ENGINEERING', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00),
('ITEM-1782814343342-LSEMP015', 'RUN-1782814343238', 'LSEMP015', 'Laila Kluste', 'Administration', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, -150.00, 0.00, 3, 150.00),
('ITEM-1782814343348-LSEMP016', 'RUN-1782814343238', 'LSEMP016', 'Lordina Benyah', 'Business Development', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, -100.00, 0.00, 2, 100.00),
('ITEM-1782814343354-LSEMP018', 'RUN-1782814343238', 'LSEMP018', 'Doe Agbodo', 'ELECTRICAL ENGINEERING', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00),
('ITEM-1782814343358-LSEMP021', 'RUN-1782814343238', 'LSEMP021', 'Morgan Kpabitey', 'ELECTRICAL ENGINEERING', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00),
('ITEM-1782814343363-LSEMP022', 'RUN-1782814343238', 'LSEMP022', 'Goldilocks Emson', 'Administration', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00),
('ITEM-1782814343372-LSEMP023', 'RUN-1782814343238', 'LSEMP023', 'Hillary Adjei', 'Business Development', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, -50.00, 0.00, 1, 50.00),
('ITEM-1782814343376-LSEMP024', 'RUN-1782814343238', 'LSEMP024', 'Gifty Owusu', 'Business Development', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, -50.00, 0.00, 1, 50.00),
('ITEM-1782814343385-LSEMP100', 'RUN-1782814343238', 'LSEMP100', 'Hannah Datsomor', 'Administration', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00),
('ITEM-1782814343389-LSEMP101', 'RUN-1782814343238', 'LSEMP101', 'Esther Ofori', 'Administration', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00),
('ITEM-1782814343394-LSEMP102', 'RUN-1782814343238', 'LSEMP102', 'Samuel Adufu', 'Security', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00),
('ITEM-1782814343400-LSEMP103', 'RUN-1782814343238', 'LSEMP103', 'Bismark Agbodzi', 'Transport Department', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, -100.00, 0.00, 2, 100.00);

-- --------------------------------------------------------

--
-- Table structure for table `payroll_runs`
--

CREATE TABLE `payroll_runs` (
  `id` varchar(50) NOT NULL,
  `period_month` varchar(7) NOT NULL,
  `generated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `generated_by` varchar(150) NOT NULL,
  `total_basic_salary` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_gross_salary` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_ssnit_employee` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_ssnit_employer` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_paye` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_deductions` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_net_salary` decimal(15,2) NOT NULL DEFAULT 0.00,
  `items_count` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payroll_runs`
--

INSERT INTO `payroll_runs` (`id`, `period_month`, `generated_at`, `generated_by`, `total_basic_salary`, `total_gross_salary`, `total_ssnit_employee`, `total_ssnit_employer`, `total_paye`, `total_deductions`, `total_net_salary`, `items_count`) VALUES
('RUN-1782814343238', '2026-06', '2026-06-30 10:12:23', 'Administrator', 9570.99, 10720.99, 478.55, 1292.08, 2244.86, 3423.41, 7297.58, 18);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Administrator'),
(2, 'HR Officer'),
(3, 'Payroll Officer'),
(4, 'Read Only');

-- --------------------------------------------------------

--
-- Table structure for table `salary_setups`
--

CREATE TABLE `salary_setups` (
  `employee_id` varchar(50) NOT NULL,
  `basic_salary` decimal(15,2) NOT NULL DEFAULT 0.00,
  `transport_allowance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `housing_allowance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `utility_allowance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `risk_allowance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `other_allowances` decimal(15,2) NOT NULL DEFAULT 0.00,
  `other_deductions` decimal(15,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salary_setups`
--

INSERT INTO `salary_setups` (`employee_id`, `basic_salary`, `transport_allowance`, `housing_allowance`, `utility_allowance`, `risk_allowance`, `other_allowances`, `other_deductions`) VALUES
('LSEMP004', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
('LSEMP006', 9570.99, 450.00, 160.00, 500.00, 0.00, 40.00, 0.00),
('LSEMP012', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
('LSEMP018', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
('LSEMP022', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `tax_bands`
--

CREATE TABLE `tax_bands` (
  `id` varchar(50) NOT NULL,
  `limit_value` decimal(15,2) DEFAULT NULL,
  `rate` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tax_bands`
--

INSERT INTO `tax_bands` (`id`, `limit_value`, `rate`) VALUES
('BAND1', 490.00, 0.00),
('BAND2', 110.00, 5.00),
('BAND3', 130.00, 10.00),
('BAND4', 3166.67, 17.50),
('BAND5', 16000.00, 25.00),
('BAND6', 30500.00, 30.00),
('BAND7', NULL, 35.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, NULL, 1, 'Kweku Appiah', 'admin', 'admin@lefpayroll.local', '$2b$12$O9UVZb5L7fMKyfXaIFL4De5wT1HSMwOxO3B9.WBDkBcxohqbL5sbK', 1, '2026-06-23 16:37:30', '2026-06-16 16:40:38', '2026-06-23 16:37:30'),
(2, NULL, 2, 'Testing1', 'Testing1', 'kwekuappiahjnr8@gmail.com', '$2b$10$IAPihG9oUf10.8U4qeAwzOYBGVJjePymW16c3rH2RpF5RnuCb5wIu', 1, NULL, '2026-06-17 15:47:05', '2026-06-17 15:47:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_attendance` (`employee_id`,`attendance_date`);

--
-- Indexes for table `biometric_logs`
--
ALTER TABLE `biometric_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_event` (`employee_id`,`event_time`),
  ADD UNIQUE KEY `unique_hikvision_serial` (`serial_no`);

--
-- Indexes for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_employees_department` (`department_id`),
  ADD KEY `idx_employees_status` (`status`);

--
-- Indexes for table `hikvision_raw_logs`
--
ALTER TABLE `hikvision_raw_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_serial` (`serial_no`),
  ADD KEY `idx_employee` (`employee_id`),
  ADD KEY `idx_time` (`event_time`);

--
-- Indexes for table `hikvision_settings`
--
ALTER TABLE `hikvision_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hikvision_sync_logs`
--
ALTER TABLE `hikvision_sync_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hikvision_sync_state`
--
ALTER TABLE `hikvision_sync_state`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payroll_items`
--
ALTER TABLE `payroll_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_payroll_items_run` (`payroll_run_id`);

--
-- Indexes for table `payroll_runs`
--
ALTER TABLE `payroll_runs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `salary_setups`
--
ALTER TABLE `salary_setups`
  ADD PRIMARY KEY (`employee_id`);

--
-- Indexes for table `tax_bands`
--
ALTER TABLE `tax_bands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_user_role` (`role_id`),
  ADD KEY `fk_user_employee` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `biometric_logs`
--
ALTER TABLE `biometric_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1449;

--
-- AUTO_INCREMENT for table `hikvision_raw_logs`
--
ALTER TABLE `hikvision_raw_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3892;

--
-- AUTO_INCREMENT for table `hikvision_settings`
--
ALTER TABLE `hikvision_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hikvision_sync_logs`
--
ALTER TABLE `hikvision_sync_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD CONSTRAINT `attendance_logs_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `fk_employee_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payroll_items`
--
ALTER TABLE `payroll_items`
  ADD CONSTRAINT `fk_payroll_item_run` FOREIGN KEY (`payroll_run_id`) REFERENCES `payroll_runs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `salary_setups`
--
ALTER TABLE `salary_setups`
  ADD CONSTRAINT `fk_salary_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
