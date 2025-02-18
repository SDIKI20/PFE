-- --------------------------------------------------------
-- Hôte :                        127.0.0.1
-- Version du serveur:           5.7.9 - MySQL Community Server (GPL)
-- SE du serveur:                Win64
-- HeidiSQL Version:             11.0.0.6037
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Listage de la structure de la base pour encheres
DROP DATABASE IF EXISTS `encheres`;
CREATE DATABASE IF NOT EXISTS `encheres` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `encheres`;

-- Listage de la structure de la table encheres. positions
DROP TABLE IF EXISTS `positions`;
CREATE TABLE IF NOT EXISTS `positions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Position` varchar(255) DEFAULT NULL,
  `Description` text,
  `Qte` int(10) unsigned DEFAULT NULL,
  `Start_Price` float unsigned DEFAULT NULL COMMENT 'Prix départ',
  `Increase_Amount` float unsigned DEFAULT NULL,
  `Fixed_Price` float unsigned DEFAULT NULL COMMENT 'Prix Attendue',
  `Current_Price` float unsigned DEFAULT NULL COMMENT 'Prix en cours',
  `Start_Date` datetime DEFAULT NULL COMMENT 'Date ouverture',
  `Close_Date` datetime DEFAULT NULL COMMENT 'Date fermeture',
  `State` varchar(1) DEFAULT NULL COMMENT 'Créate/Open/Closed',
  `Owner_Id` int(11) DEFAULT NULL COMMENT 'Etat position',
  `Img1` varchar(255) DEFAULT NULL COMMENT 'Id de Propriétaire de position',
  `Img2` varchar(255) DEFAULT NULL,
  `Img3` varchar(255) DEFAULT NULL,
  `Img4` varchar(255) DEFAULT NULL,
  `Created_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `Updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Owner` (`Owner_Id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Listage des données de la table encheres.positions : 3 rows
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` (`id`, `Position`, `Description`, `Qte`, `Start_Price`, `Increase_Amount`, `Fixed_Price`, `Current_Price`, `Start_Date`, `Close_Date`, `State`, `Owner_Id`, `Img1`, `Img2`, `Img3`, `Img4`, `Created_at`, `Updated_at`) VALUES
	(2, 'Position 01', 'Position Description 01', 10, 1500, 100, 2500, 1500, '2022-01-01 00:00:00', '2022-05-01 00:00:00', '1', 2, 'hani@gmail.com', 'hani@gmail.com', '', 'hani@gmail.com', '2022-02-17 18:18:12', '2022-02-17 18:18:12'),
	(3, 'Position 0Ã©', 'Position Description 0Ã©', 10, 1500, 100, 2500, 1500, '2022-02-01 00:00:00', '2022-03-01 00:00:00', '1', 2, 'hani@gmail.com', 'hani@gmail.com', '', 'hani@gmail.com', '2022-02-17 18:45:22', '2022-02-17 18:45:22');
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;

-- Listage de la structure de la table encheres. transactions
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Current_Price` decimal(10,2) unsigned DEFAULT NULL,
  `Increase_Amount` int(10) unsigned DEFAULT NULL,
  `Nbr` int(10) unsigned DEFAULT NULL,
  `Price_Date` date DEFAULT NULL,
  `Validated` varchar(1) NOT NULL COMMENT '0:Non, 1 : Oui',
  `User_Id` int(11) NOT NULL,
  `Position_Id` int(11) NOT NULL,
  `Created_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `Updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `UserProp` (`User_Id`),
  KEY `Position` (`Position_Id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Listage des données de la table encheres.transactions : 0 rows
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` (`id`, `Current_Price`, `Increase_Amount`, `Nbr`, `Price_Date`, `Validated`, `User_Id`, `Position_Id`, `Created_at`, `Updated_at`) VALUES
	(1, 15000.00, 1000, 2, '2022-01-01', b'0001', 2, 2, '2022-02-01 00:00:00', '2022-02-01 00:00:00'),
	(2, 15000.00, 1000, 1, '2022-01-01', b'0001', 2, 2, '2022-02-01 00:00:00', '2022-02-01 00:00:00');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;

-- Listage de la structure de la table encheres. users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `UserName` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `FName` varchar(255) DEFAULT NULL,
  `LName` varchar(255) DEFAULT NULL,
  `Pass` varchar(255) DEFAULT NULL,
  `Wilaya_id` int(11) DEFAULT NULL,
  `Phone` varchar(255) DEFAULT NULL,
  `Profile` varchar(255) DEFAULT NULL,
  `Subscription` int(10) unsigned DEFAULT NULL COMMENT 'nombre de mois',
  `Start_Date` datetime DEFAULT NULL,
  `End_Date` datetime DEFAULT NULL,
  `State` int(11) DEFAULT NULL,
  `Level` tinyint(4) DEFAULT NULL,
  `Created_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `Updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Wilayas` (`Wilaya_id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- Listage des données de la table encheres.users : 23 rows
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `UserName`, `Email`, `FName`, `LName`, `Pass`, `Wilaya_id`, `Phone`, `Profile`, `Subscription`, `Start_Date`, `End_Date`, `State`, `Level`, `Created_at`, `Updated_at`) VALUES
	(1, 'hani', 'hani@email.com', 'hani', 'aek', 'aaaaa', 1, '22222222222', '1', 1, '2022-02-01 00:00:00', '2022-02-09 00:00:00', 0, 0, NULL, NULL),
	(2, 'kader', 'Kader@gmail.com', 'kader', 'ahmed', 'ZZZZ', 1, '111111111111111', '0', NULL, '2022-02-10 00:00:00', '2022-02-25 00:00:00', 1, 1, NULL, NULL),
	(3, 'nabil', 'nabil.email.com', 'nabil', 'aek222', 'eeee', 2, '999999999999', '4', 1, '2022-02-17 00:00:00', '2022-02-17 00:00:00', 1, 0, '2022-02-02 19:43:46', '2022-02-02 19:43:46'),
	(4, 'haniZZZZZ', 'hani@gmail.com', 'HaniZZZZZ', 'aek', 'aaaa', 1, '33333333333', '1', 5, '2022-01-01 00:00:00', '2022-03-01 00:00:00', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00'),
	(5, 'haniZZZZZ', 'hani@gmail.com', 'HaniZZZZZ', 'aek', 'aaaa', 1, '33333333333', '1', 5, '2022-01-01 00:00:00', '2022-03-01 00:00:00', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00'),
	(6, 'haniZZZZZ', 'hani@gmail.com', 'HaniZZZZZ', 'aek', 'aaaa', 1, '33333333333', '1', 5, '2022-01-01 00:00:00', '2022-03-01 00:00:00', 1, 1, '2022-01-01 00:00:00', '2022-01-01 00:00:00'),
	(7, 'haniZZZZZ', 'hani@gmail.com', 'HaniZZZZZ', 'aek', 'aaaa', 1, '33333333333', '1', 8, '2022-01-01 00:00:00', '2022-03-01 00:00:00', 1, 1, '2022-02-17 14:59:08', '2022-02-17 14:59:08'),
	(8, 'hanihhhhh', 'hani@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(9, 'hanihhhhh', 'hani@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(10, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(11, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(12, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(13, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(14, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(15, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(16, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(17, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(18, 'hanoooo', 'hani@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(19, 'haniZZZZZ', 'hani@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(20, 'hanoo__oo', 'hani@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(21, 'hanoo__oo', 'hani@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(22, 'hanoo__oo', 'hani@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(23, 'bouhani_hanoooo', 'hani@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Listage de la structure de la table encheres. wilayas
DROP TABLE IF EXISTS `wilayas`;
CREATE TABLE IF NOT EXISTS `wilayas` (
  `id` int(11) NOT NULL,
  `Wcode` varchar(255) DEFAULT NULL,
  `Wilaya` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- Listage des données de la table encheres.wilayas : 2 rows
/*!40000 ALTER TABLE `wilayas` DISABLE KEYS */;
INSERT INTO `wilayas` (`id`, `Wcode`, `Wilaya`) VALUES
	(1, '01', 'Adrar'),
	(2, '02', 'Echlef');
/*!40000 ALTER TABLE `wilayas` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
