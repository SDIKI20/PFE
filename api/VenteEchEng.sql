CREATE TABLE `Positions`  (
  `id` int NOT NULL,
  `Position` varchar(255) NULL,
  `Description` linestring NULL,
  `Qte` int UNSIGNED NULL,
  `Start_Price` float UNSIGNED NULL COMMENT 'Prix départ',
  `Increase_Amount ` float UNSIGNED NULL,
  `Fixed_Price ` float UNSIGNED NULL COMMENT 'Prix Attendue',
  `Current_Price ` float UNSIGNED NULL COMMENT 'Prix en cours',
  `Start_Date` date NULL COMMENT 'Date ouverture',
  `Close_Date` date NULL COMMENT 'Date fermeture',
  `State` varchar(1) NULL COMMENT 'Créate/Open/Closed',
  `Owner_Id` int NULL COMMENT 'Etat position',
  `Img1` varchar(255) NULL COMMENT 'Id de Propriétaire de position',
  `Img2` varchar(255) NULL,
  `Img3` varchar(255) NULL,
  `Img4` varchar(255) NULL,
  `Created_at` datetime NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Transactions`  (
  `id` int NOT NULL,
  `Current_Price` decimal(10, 2) UNSIGNED NULL,
  `Increase_Amount` int UNSIGNED NULL,
  `Nbr` int UNSIGNED NULL,
  `Price_Date` date NULL,
  `Validated` bit NOT NULL COMMENT '0:Non, 1 : Oui',
  `UserId` int NOT NULL,
  `PositionId` int NOT NULL,
  `Created_at` datetime NULL ON UPDATE CURRENT_TIMESTAMP,
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
  `Wilaya_id` int NULL,
  `Phone` varchar(255) NULL,
  `Profile` varchar(255) NULL,
  `Subscription ` int UNSIGNED NULL COMMENT 'nombre de mois',
  `Start_Date ` datetime NULL,
  `End_Date ` datetime NULL,
  `State` int NULL,
  `Level` tinyint NULL,
  `Created_at` datetime NULL ON UPDATE CURRENT_TIMESTAMP,
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

