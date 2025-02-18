CREATE TABLE `Positions`  (
  `id` int NOT NULL,
  `Position` varchar(255) NULL,
  `Description` varchar(255) NULL,
  `Qte` int UNSIGNED NULL,
  `PriceDep` float UNSIGNED NULL,
  `Pas` float UNSIGNED NULL,
  `Price` float UNSIGNED NULL,
  `PriceAct` float UNSIGNED NULL,
  `DateDep` date NULL,
  `DateClose` date NULL,
  `State` varchar(1) NULL COMMENT 'Créate/Open/Closed',
  `Owner_Id` int NULL,
  `Img1` varchar(255) NULL,
  `Img2` varchar(255) NULL,
  `Img3` varchar(255) NULL,
  `Img4` varchar(255) NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Transactions`  (
  `id` int NOT NULL,
  `PriceAct` decimal(10, 2) UNSIGNED NULL,
  `Pas` int UNSIGNED NULL,
  `NbPas` int UNSIGNED NULL,
  `DatePrice` date NULL,
  `Validated` bit NOT NULL COMMENT '0:Non, 1 : Oui',
  `UserId` int NOT NULL,
  `PositionId` int NOT NULL,
  PRIMARY KEY (`id`, `PositionId`, `UserId`),
  INDEX `UserEnch`(`UserId`)
);

CREATE TABLE `Users`  (
  `id` int NOT NULL,
  `UserName` varchar(255) NULL,
  `Email` varchar(255) NULL,
  `FName` varchar(255) NULL,
  `LName` varchar(255) NULL,
  `Pass` varchar(255) NULL,
  `Wilayaid` int NULL,
  `Phone` varchar(255) NULL,
  `Profile` varchar(255) NULL,
  `Abonnement` int UNSIGNED NULL COMMENT 'nombre de mois',
  `DateDeb` datetime NULL,
  `DateFin` datetime NULL,
  `State` bit NULL,
  `Created_at` datetime NULL,
  `Level` tinyint NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Wilayas`  (
  `id` int NOT NULL,
  `Wcode` varchar(255) NULL,
  `Wilaya` varchar(255) NULL,
  PRIMARY KEY (`id`)
);

ALTER TABLE `Positions` ADD CONSTRAINT `Owner` FOREIGN KEY (`Owner_Id`) REFERENCES `Users` (`id`);
ALTER TABLE `Transactions` ADD CONSTRAINT `UserProp` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`);
ALTER TABLE `Transactions` ADD CONSTRAINT `Position` FOREIGN KEY (`PositionId`) REFERENCES `Positions` (`id`);
ALTER TABLE `Users` ADD CONSTRAINT `Wilayas` FOREIGN KEY (`Wilayaid`) REFERENCES `Wilayas` (`id`);

