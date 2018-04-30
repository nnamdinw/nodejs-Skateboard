-- phpMyAdmin SQL Dump
-- version 4.5.0.2
-- http://www.phpmyadmin.net
--
-- Host: 10.30.84.177:3306
-- Generation Time: Apr 30, 2018 at 09:42 PM
-- Server version: 5.6.39-83.1-56-log
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sk8_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `sk8_data`
--

CREATE TABLE `sk8_data` (
  `ID` int(11) NOT NULL,
  `Frame_Index` int(11) NOT NULL,
  `ax` int(11) NOT NULL,
  `ay` double NOT NULL,
  `az` double NOT NULL,
  `q0` double NOT NULL,
  `q1` double NOT NULL,
  `q2` double NOT NULL,
  `q3` double NOT NULL,
  `rpm` float NOT NULL,
  `wheelspeed` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sk8_trips`
--

CREATE TABLE `sk8_trips` (
  `ID` int(32) NOT NULL,
  `Date` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sk8_trips`
--
ALTER TABLE `sk8_trips`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sk8_trips`
--
ALTER TABLE `sk8_trips`
  MODIFY `ID` int(32) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
