-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema fisdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema fisdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `fisdb` DEFAULT CHARACTER SET utf8 ;
USE `fisdb` ;

-- -----------------------------------------------------
-- Table `fisdb`.`customer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fisdb`.`customer` (
  `idCustomer` INT(11) NOT NULL AUTO_INCREMENT,
  `CustomerName` VARCHAR(45) NOT NULL,
  `CustomerAddress` VARCHAR(45) NOT NULL,
  `CustomerPhone` INT(11) NOT NULL,
  PRIMARY KEY (`idCustomer`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `fisdb`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fisdb`.`orders` (
  `idOrder` INT(11) NOT NULL AUTO_INCREMENT,
  `OrderDate` DATETIME NOT NULL,
  `OrderDeliverDate` DATETIME NULL DEFAULT NULL,
  `idCustomer` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`idOrder`),
  INDEX `fk_Order_Customer1_idx` (`idCustomer` ASC),
  CONSTRAINT `fk_Order_Customer1`
    FOREIGN KEY (`idCustomer`)
    REFERENCES `fisdb`.`customer` (`idCustomer`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `fisdb`.`product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fisdb`.`product` (
  `idProduct` INT(11) NOT NULL AUTO_INCREMENT,
  `FrameType` ENUM('frame1', 'frame2', 'frame3') NOT NULL,
  `FrameColor` ENUM('blue', 'red', 'green') NOT NULL,
  `ScreenType` ENUM('screen1', 'screen2', 'screen3') NOT NULL,
  `ScreenColor` ENUM('blue', 'red', 'green') NOT NULL,
  `KeyboardType` ENUM('keyboard1', 'keyboard2', 'keyboard3') NOT NULL,
  `KeyboardColor` ENUM('blue', 'red', 'green') NOT NULL,
  PRIMARY KEY (`idProduct`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `fisdb`.`order_has_products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fisdb`.`order_has_products` (
  `idOrder` INT(11) NOT NULL,
  `idProduct` INT(11) NOT NULL,
  `quantity` INT(11) NOT NULL,
  `productState` ENUM('ordered', 'production', 'shipped') NOT NULL,
  PRIMARY KEY (`idOrder`, `idProduct`),
  INDEX `fk_Order_has_Product_Product1_idx` (`idProduct` ASC),
  INDEX `fk_Order_has_Product_Order1_idx` (`idOrder` ASC),
  CONSTRAINT `fk_Order_has_Product_Order1`
    FOREIGN KEY (`idOrder`)
    REFERENCES `fisdb`.`orders` (`idOrder`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Order_has_Product_Product1`
    FOREIGN KEY (`idProduct`)
    REFERENCES `fisdb`.`product` (`idProduct`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
