-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 25, 2012 at 11:44 AM
-- Server version: 5.1.36
-- PHP Version: 5.3.0

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `scw`
--
CREATE DATABASE `scw` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `scw`;

-- --------------------------------------------------------

--
-- Table structure for table `billing`
--

CREATE TABLE IF NOT EXISTS `billing` (
  `id` double NOT NULL AUTO_INCREMENT,
  `shopID` double NOT NULL,
  `namee` varchar(255) NOT NULL,
  `email2` varchar(100) NOT NULL,
  `adrs` varchar(100) NOT NULL,
  `cName` varchar(200) NOT NULL,
  `city` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `contact` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=48 ;

--
-- Dumping data for table `billing`
--

INSERT INTO `billing` (`id`, `shopID`, `namee`, `email2`, `adrs`, `cName`, `city`, `country`, `contact`) VALUES
(46, 42, 'Absar Naeem', 'info@vtechpk.com', 'Rashid Minhas Road', 'Value Technologies Pakistan', 'Karachi', 'Pakistan', '033-3147460'),
(47, 25, 'Absar Naeem', 'info@vtechpk.com', 'Rashid Minhas Road', 'Value Technologies Pakistan', 'Karachi', 'Pakistan', '033-3147460');

-- --------------------------------------------------------

--
-- Table structure for table `brand`
--

CREATE TABLE IF NOT EXISTS `brand` (
  `id` double NOT NULL AUTO_INCREMENT,
  `namee` varchar(200) NOT NULL,
  `imagee` varchar(200) NOT NULL,
  `desc1` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `brand`
--

INSERT INTO `brand` (`id`, `namee`, `imagee`, `desc1`) VALUES
(1, 'Sony', '', '<p>// ''Lorem'' &nbsp;"ipsum" &nbsp;dolor sit amet, consectetur adipiscing elit. Donec arcu velit, vestibulum vel pharetra ut, malesuada in turpis. Phasellus ut nisi ipsum, sit amet pellentesque metus. Sed leo diam, egestas eget venenatis nec, consequat sed sem. Suspendisse placerat nisl nunc, non imperdiet elit. Etiam eu eros erat, non rutrum odio. Sed vel massa nulla. Sed libero lacus, sodales at blandit ut, mollis in justo. Integer euismod eros in nibh malesuada accumsan. Etiam in velit in nisi hendrerit dictum sed et libero. Suspendisse aliquet, diam a feugiat vehicula, lacus neque facilisis diam, nec porttitor libero arcu ac libero. In hac habitasse platea dictumst. Integer ut velit neque, ut laoreet tortor. Nulla lacinia, massa eget placerat aliquet, odio ipsum dignissim tellus, vel facilisis odio neque et justo. Morbi convallis posuere molestie. Proin massa magna, sollicitudin in porttitor nec, porta quis erat.</p>'),
(2, 'Panasonic', 'panasonic.JPG', '<p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Maecenas urna tellus, commodo non bibendum et, volutpat eu turpis. Nunc facilisis ullamcorper velit, ut malesuada elit sagittis ut. Suspendisse potenti. Curabitur lacinia diam placerat nisl consectetur laoreet. Nulla facilisi. Etiam sit amet enim in sapien faucibus ullamcorper. Morbi quis dolor risus. Proin ac turpis ipsum. Donec et felis est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam feugiat, purus et faucibus commodo, nulla magna vehicula sem, nec scelerisque purus libero at purus. Phasellus facilisis purus vitae mi volutpat sollicitudin. Donec vulputate urna sed nisl consectetur tempus. Curabitur metus sem, lacinia et semper ac, rhoncus a augue. Vestibulum vel nisl in dui convallis aliquet id eget lorem.</p>');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE IF NOT EXISTS `cart` (
  `id` double NOT NULL AUTO_INCREMENT,
  `shopID` double NOT NULL,
  `iDate` date NOT NULL,
  `pid` double NOT NULL,
  `qty` int(10) NOT NULL,
  `email` varchar(200) NOT NULL,
  `comments` text NOT NULL,
  `ddate` varchar(25) NOT NULL,
  `statuss` varchar(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=56 ;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `shopID`, `iDate`, `pid`, `qty`, `email`, `comments`, `ddate`, `statuss`) VALUES
(53, 42, '2011-11-22', 14, 1, '', '', '2011-11-22', 'a'),
(54, 25, '2011-11-29', 11, 1, '', '', '2011-11-29', 'a'),
(55, 25, '2011-11-29', 9, 1, '', '', '2011-11-29', 'a');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `id` double NOT NULL AUTO_INCREMENT,
  `namee` varchar(255) NOT NULL,
  `sortID` int(11) NOT NULL,
  `dhp` varchar(10) NOT NULL,
  `catID` int(12) NOT NULL,
  `imagee` varchar(150) NOT NULL,
  `pmethod` int(5) NOT NULL,
  `title` varchar(255) NOT NULL,
  `keyword` text NOT NULL,
  `descr` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=17 ;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `namee`, `sortID`, `dhp`, `catID`, `imagee`, `pmethod`, `title`, `keyword`, `descr`) VALUES
(1, 'Office Headsets', 1, 'yes', 0, 'banerrite.jpg', 0, 'check', 'test', 'none'),
(2, 'Mobile  Phone Headsets', 2, 'yes', 0, '', 0, '', '', ''),
(3, 'Computer & VOIP \\r\\nHeadsets', 3, 'yes', 0, '', 0, '', '', ''),
(4, 'absar', 4, 'yes', 3, '', 0, '', '', ''),
(5, 'Murder2', 5, 'yes', 3, '', 0, '', '', ''),
(6, 'sami', 6, 'no', 3, '', 0, '', '', ''),
(7, 'News', 7, 'no', 3, '', 0, '', '', ''),
(8, 'ken ShemRock', 8, 'yes', 4, 'gift1.jpg', 0, '', '', ''),
(9, 'Headset Acessories', 9, 'yes', 0, '', 0, '', '', ''),
(10, 'Telephone Sets', 10, 'yes', 0, '', 0, '', '', ''),
(12, 'Test Category1', 12, 'yes', 0, 'sony-logo.jpg', 0, 'web design company', 'rdj', 'jtjrtjrtjrtj'),
(16, 'Test Category1', 13, 'yes', 1, 'Jquery Image 5.jpg', 0, '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `delivery`
--

CREATE TABLE IF NOT EXISTS `delivery` (
  `id` double NOT NULL AUTO_INCREMENT,
  `shopID` double NOT NULL,
  `namee` varchar(255) NOT NULL,
  `email2` varchar(100) NOT NULL,
  `adrs` varchar(100) NOT NULL,
  `cName` varchar(200) NOT NULL,
  `city` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `contact` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=47 ;

--
-- Dumping data for table `delivery`
--

INSERT INTO `delivery` (`id`, `shopID`, `namee`, `email2`, `adrs`, `cName`, `city`, `country`, `contact`) VALUES
(46, 42, 'Sami', 'support@vtechpk.com', 'asfasf', 'Value Technologies Pakistan', 'Karachi', 'Burundi', '033');

-- --------------------------------------------------------

--
-- Table structure for table `imagee`
--

CREATE TABLE IF NOT EXISTS `imagee` (
  `id` double NOT NULL AUTO_INCREMENT,
  `imagee` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sortID` int(11) NOT NULL,
  `linkk` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `align` varchar(12) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=18 ;

--
-- Dumping data for table `imagee`
--

INSERT INTO `imagee` (`id`, `imagee`, `sortID`, `linkk`, `align`) VALUES
(17, 'topbrands.jpg', 8, '', 'right'),
(15, 'deal.jpg', 5, '', 'left'),
(11, 'banner1.jpg', 7, '#', 'left'),
(12, 'headphon.jpg', 6, '', 'right'),
(13, 'telephon.jpg', 6, '', 'right');

-- --------------------------------------------------------

--
-- Table structure for table `measurement`
--

CREATE TABLE IF NOT EXISTS `measurement` (
  `id` double NOT NULL AUTO_INCREMENT,
  `shopID` double NOT NULL,
  `m_scale` varchar(11) NOT NULL,
  `neck` varchar(15) NOT NULL,
  `bust` varchar(15) NOT NULL,
  `bicep` varchar(15) NOT NULL,
  `headd` varchar(15) NOT NULL,
  `neck_to_bust` varchar(15) NOT NULL,
  `shirt` varchar(15) NOT NULL,
  `shoulder` varchar(15) NOT NULL,
  `sleeve` varchar(15) NOT NULL,
  `arm` varchar(15) NOT NULL,
  `shirt_length` varchar(15) NOT NULL,
  `bust_point` varchar(15) NOT NULL,
  `back_neck` varchar(15) NOT NULL,
  `waist` varchar(15) NOT NULL,
  `crotch` varchar(15) NOT NULL,
  `knee` varchar(15) NOT NULL,
  `length` varchar(15) NOT NULL,
  `waist_to_knee` varchar(15) NOT NULL,
  `height` varchar(15) NOT NULL,
  `hips` varchar(15) NOT NULL,
  `thigh` varchar(15) NOT NULL,
  `calf` varchar(15) NOT NULL,
  `seam` varchar(15) NOT NULL,
  `cuff` varchar(15) NOT NULL,
  `weight` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=34 ;

--
-- Dumping data for table `measurement`
--

INSERT INTO `measurement` (`id`, `shopID`, `m_scale`, `neck`, `bust`, `bicep`, `headd`, `neck_to_bust`, `shirt`, `shoulder`, `sleeve`, `arm`, `shirt_length`, `bust_point`, `back_neck`, `waist`, `crotch`, `knee`, `length`, `waist_to_knee`, `height`, `hips`, `thigh`, `calf`, `seam`, `cuff`, `weight`) VALUES
(22, 0, 'inches', '1', '3', '5', '7', '9', '11', '2', '4', '6', '8', '10', '12', '13', '15', '174', '19', '21', '22', '14', '16', '18', '20', '22', '23'),
(21, 15, 'inches', '1', '3', '5', '7', '9', '11', '2', '4', '6', '8', '10', '12', '13', '15', '174', '19', '21', '22', '14', '16', '18', '20', '22', '23'),
(20, 14, 'inches', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(19, 13, 'inches', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(18, 12, 'inches', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(17, 11, 'inches', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(16, 10, 'inches', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(15, 0, 'inches', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '10', '11', '12', '13', '141', '151', '16', '17', '18', '19', '50', '20', '21', '22'),
(14, 9, 'inches', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '10', '11', '12', '13', '141', '151', '16', '17', '18', '19', '50', '20', '21', '22'),
(12, 8, 'inches', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '10', '11', '12', '13', '141', '151', '16', '17', '18', '19', '50', '20', '21', '22'),
(23, 16, 'inches', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(24, 17, 'inches', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(25, 18, 'inches', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(26, 19, 'inches', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(27, 20, 'inches', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(28, 21, 'inches', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(29, 22, 'inches', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(30, 23, 'inches', '1', '2', '3', '5', '565', '984', '4', '65', '4', '4', '465', '5646', '656', '5656', '56', '65', '6', '56', '56', '56', '6', '656', '6', '65'),
(31, 23, 'inches', '1', '2', '3', '5', '565', '984', '4', '65', '4', '4', '465', '5646', '656', '5656', '56', '65', '6', '56', '56', '56', '6', '656', '6', '65'),
(32, 23, 'inches', '1', '2', '3', '5', '565', '984', '4', '65', '4', '4', '465', '5646', '656', '5656', '56', '65', '6', '56', '56', '56', '6', '656', '6', '65'),
(33, 24, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE IF NOT EXISTS `members` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`username`, `password`) VALUES
('admin', 'vtech');

-- --------------------------------------------------------

--
-- Table structure for table `paymentmethod`
--

CREATE TABLE IF NOT EXISTS `paymentmethod` (
  `id` double NOT NULL AUTO_INCREMENT,
  `shopID` double NOT NULL,
  `method` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=53 ;

--
-- Dumping data for table `paymentmethod`
--

INSERT INTO `paymentmethod` (`id`, `shopID`, `method`) VALUES
(51, 42, 'radio'),
(52, 25, 'radio');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `id` double NOT NULL AUTO_INCREMENT,
  `catID` double NOT NULL,
  `namee` varchar(255) NOT NULL,
  `brand` varchar(200) NOT NULL,
  `imagee` varchar(255) NOT NULL,
  `image2` varchar(255) NOT NULL,
  `image3` varchar(255) NOT NULL,
  `image4` varchar(255) NOT NULL,
  `desc1` varchar(255) NOT NULL,
  `` double NOT NULL,
  `old_` double NOT NULL,
  `dhp` varchar(5) NOT NULL,
  `reviews` text NOT NULL,
  `part` varchar(100) NOT NULL,
  `jenne` varchar(100) NOT NULL,
  `qty` double NOT NULL,
  `weight` double NOT NULL,
  `upc` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `keyword` text NOT NULL,
  `descr` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `catID`, `namee`, `brand`, `imagee`, `image2`, `image3`, `image4`, `desc1`, ``, `old_`, `dhp`, `reviews`, `part`, `jenne`, `qty`, `weight`, `upc`, `title`, `keyword`, `descr`) VALUES
(8, 1, 'testing', '', 'Cadillac-CTS_2008_thumbnail_01.jpg', 'Isuzu-Pickup_2008_thumbnail_01.jpg', '', '', '<p>none</p>', 2000, 0, 'yes', '<p>fdhfdhf</p>', '', '', 0, 0, '', '', '', ''),
(9, 1, 'test', '', 'flash_t.jpg', '', '', '', '<p>tgjfgjfgjfgj</p>', 20000, 0, 'yes', '<p>jhkjhk</p>', '', '', 0, 0, '', '', '', ''),
(10, 11, 'Shalwar Kameez', '', 'i-robot copy.jpg', '', '', '', '<p>essegsdg</p>', 5000, 2000, 'yes', '<p>asfasfsafasdfas</p>', '', '', 0, 0, '', 'asf', 'asfasfas', 'fasfasfasfasfasf'),
(11, 1, 'Test Product', 'Sony', '5.jpg', '4.jpg', '6.jpg', '2.jpg', '<p>Nullam at placerat felis. Vestibulum nisl tellus, vestibulum et feugiat fermentum, dapibus vel arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris ultrices turpis et ante feugiat faucibus vitae mol', 150, 200, 'yes', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec arcu velit, vestibulum vel pharetra ut, malesuada in turpis. Phasellus ut nisi ipsum, sit amet pellentesque metus. Sed leo diam, egestas eget venenatis nec, consequat sed sem. Suspendisse placerat nisl nunc, non imperdiet elit. Etiam eu eros erat, non rutrum odio. Sed vel massa nulla. Sed libero lacus, sodales at blandit ut, mollis in justo. Integer euismod eros in nibh malesuada accumsan. Etiam in velit in nisi hendrerit dictum sed et libero. Suspendisse aliquet, diam a feugiat vehicula, lacus neque facilisis diam, nec porttitor libero arcu ac libero. In hac habitasse platea dictumst. Integer ut velit neque, ut laoreet tortor. Nulla lacinia, massa eget placerat aliquet, odio ipsum dignissim tellus, vel facilisis odio neque et justo. Morbi convallis posuere molestie. Proin massa magna, sollicitudin in porttitor nec, porta quis erat.</p>', '', '', 0, 0, '', 'web design company', 'asf', 'asfafasfasfasf');

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE IF NOT EXISTS `profile` (
  `id` double NOT NULL AUTO_INCREMENT,
  `namee` varchar(255) NOT NULL,
  `email2` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `cName` varchar(255) NOT NULL,
  `adrs` varchar(255) NOT NULL,
  `city` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `contact` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`id`, `namee`, `email2`, `password`, `cName`, `adrs`, `city`, `country`, `contact`) VALUES
(1, 'Absar Naeem', 'info@vtechpk.com', '654321', 'Value Technologies Pakistan', 'Rashid Minhas Road', 'Karachi', 'Pakistan', '033-3147460');

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

CREATE TABLE IF NOT EXISTS `shipping` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `rate` int(10) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `shipping`
--

INSERT INTO `shipping` (`id`, `title`, `rate`) VALUES
(3, 'DHL', 100);

-- --------------------------------------------------------

--
-- Table structure for table `shippingmethod`
--

CREATE TABLE IF NOT EXISTS `shippingmethod` (
  `id` double NOT NULL AUTO_INCREMENT,
  `sID` int(10) NOT NULL,
  `shopID` double NOT NULL,
  `sRate` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `shippingmethod`
--

INSERT INTO `shippingmethod` (`id`, `sID`, `shopID`, `sRate`) VALUES
(3, 3, 42, 100),
(4, 3, 25, 100);

-- --------------------------------------------------------

--
-- Table structure for table `shopid`
--

CREATE TABLE IF NOT EXISTS `shopid` (
  `shopID` double NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shopid`
--

INSERT INTO `shopid` (`shopID`) VALUES
(42);

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE IF NOT EXISTS `stores` (
  `id` double NOT NULL AUTO_INCREMENT,
  `imagee` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sortID` int(11) NOT NULL,
  `linkk` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=47 ;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `imagee`, `sortID`, `linkk`) VALUES
(38, 'flash.jpg', 1, '#'),
(44, '3.jpg', 4, ''),
(43, '2.jpg', 3, ''),
(42, '1.jpg', 2, ''),
(45, '4.jpg', 5, ''),
(46, '5.jpg', 6, '');

-- --------------------------------------------------------

--
-- Table structure for table `tempid`
--

CREATE TABLE IF NOT EXISTS `tempid` (
  `tempID` double NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tempid`
--

INSERT INTO `tempid` (`tempID`) VALUES
(1);

-- --------------------------------------------------------

--
-- Table structure for table `textpage`
--

CREATE TABLE IF NOT EXISTS `textpage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `namee` varchar(255) NOT NULL,
  `desc1` text NOT NULL,
  `pageData` text NOT NULL,
  `title` varchar(255) NOT NULL,
  `keyword` text NOT NULL,
  `descr` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

--
-- Dumping data for table `textpage`
--

INSERT INTO `textpage` (`id`, `namee`, `desc1`, `pageData`, `title`, `keyword`, `descr`) VALUES
(1, 'About Us', '', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec arcu velit, vestibulum vel pharetra ut, malesuada in turpis. Phasellus ut nisi ipsum, sit amet pellentesque metus. Sed leo diam, egestas eget venenatis nec, consequat sed sem. Suspendisse placerat nisl nunc, non imperdiet elit. Etiam eu eros erat, non rutrum odio. Sed vel massa nulla. Sed libero lacus, sodales at blandit ut, mollis in justo. Integer euismod eros in nibh malesuada accumsan. Etiam in velit in nisi hendrerit dictum sed et libero. Suspendisse aliquet, diam a feugiat vehicula, lacus neque facilisis diam, nec porttitor libero arcu ac libero. In hac habitasse platea dictumst. Integer ut velit neque, ut laoreet tortor. Nulla lacinia, massa eget placerat aliquet, odio ipsum dignissim tellus, vel facilisis odio neque et justo. Morbi convallis posuere molestie. Proin massa magna, sollicitudin in porttitor nec, porta quis erat.</p>\r\n<p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Maecenas urna tellus, commodo non bibendum et, volutpat eu turpis. Nunc facilisis ullamcorper velit, ut malesuada elit sagittis ut. Suspendisse potenti. Curabitur lacinia diam placerat nisl consectetur laoreet. Nulla facilisi. Etiam sit amet enim in sapien faucibus ullamcorper. Morbi quis dolor risus. Proin ac turpis ipsum. Donec et felis est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam feugiat, purus et faucibus commodo, nulla magna vehicula sem, nec scelerisque purus libero at purus. Phasellus facilisis purus vitae mi volutpat sollicitudin. Donec vulputate urna sed nisl consectetur tempus. Curabitur metus sem, lacinia et semper ac, rhoncus a augue. Vestibulum vel nisl in dui convallis aliquet id eget lorem.</p>', 'About Us', 'ojmaosjf', 'ojoajgadgsdgsdgh'),
(2, 'Privacy Policy', 'Helpline:<br />0321 1234567<br />0321 1234567<br />0321 1234567<br />info@mobitel.pk<br />support@mobitel.pk', '<p>Coming soom</p>', '', '', ''),
(3, 'Contact Us', 'none ', '<p>coming soon abc</p>', '', '', ''),
(4, 'Unified Solutions', 'none', 'coming soon', '', '', ''),
(6, 'Learning Guide', 'none ', 'coming soon', '', '', ''),
(7, 'Compatibility Guide', 'none', '<p>coming soon</p>', '', '', ''),
(8, 'Customer Services', 'none ', 'coming soon', '', '', ''),
(9, 'Frequently Asked Questions', 'none', 'coming soon', '', '', ''),
(10, 'Terms & Conditions', 'none', 'coming soon', '', '', ''),
(11, 'Return Policy', 'none', 'coming soon', '', '', ''),
(12, 'Sitemap', 'none', 'coming soon', '', '', ''),
(5, 'Home', '', '', 'Sonic City waves', 'sonic', 'city waves');

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

CREATE TABLE IF NOT EXISTS `video` (
  `id` double NOT NULL AUTO_INCREMENT,
  `namee` varchar(100) NOT NULL,
  `desc1` text NOT NULL,
  `filee` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `video`
--

INSERT INTO `video` (`id`, `namee`, `desc1`, `filee`) VALUES
(8, 'absar', '', 'Wildlife.wmv');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
