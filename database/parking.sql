-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hostiteľ: 127.0.0.1
-- Čas generovania: So 25.Nov 2023, 14:28
-- Verzia serveru: 10.4.21-MariaDB
-- Verzia PHP: 7.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáza: `parking`
--

-- --------------------------------------------------------

--
-- Štruktúra tabuľky pre tabuľku `area_1`
--

CREATE TABLE `area_1` (
  `id` bigint(20) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `pid` bigint(20) UNSIGNED NOT NULL,
  `occupied_from` datetime NOT NULL,
  `occupied_until` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Sťahujem dáta pre tabuľku `area_1`
--

INSERT INTO `area_1` (`id`, `status`, `pid`, `occupied_from`, `occupied_until`) VALUES
(1, 1, 123, '2023-11-25 14:03:03', '2023-12-25 14:03:03');

-- --------------------------------------------------------

--
-- Štruktúra tabuľky pre tabuľku `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_num` int(15) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Sťahujem dáta pre tabuľku `users`
--

INSERT INTO `users` (`id`, `name`, `surname`, `email`, `phone_num`, `email_verified_at`, `password`, `created_at`) VALUES
(123, 'Dominik', 'Vojtanovský', 'email@blablabla.com', 912345678, NULL, 'asdfghm', NULL);

--
-- Kľúče pre exportované tabuľky
--

--
-- Indexy pre tabuľku `area_1`
--
ALTER TABLE `area_1`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pid` (`pid`);

--
-- Indexy pre tabuľku `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Obmedzenie pre exportované tabuľky
--

--
-- Obmedzenie pre tabuľku `area_1`
--
ALTER TABLE `area_1`
  ADD CONSTRAINT `area_1_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
