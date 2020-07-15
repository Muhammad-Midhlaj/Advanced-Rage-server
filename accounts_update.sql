/*
Navicat MySQL Data Transfer

Source Server         : Masina #1
Source Server Version : 100140
Source Host           : 173.212.237.12:3306
Source Database       : xdev

Target Server Type    : MYSQL
Target Server Version : 100140
File Encoding         : 65001

Date: 2019-08-08 18:08:07
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(40) NOT NULL,
  `socialClub` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL,
  `email` varchar(40) NOT NULL,
  `lang` varchar(10) NOT NULL DEFAULT 'eng',    
  `regIp` varchar(40) NOT NULL,
  `regDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastIp` varchar(40) NOT NULL,
  `lastDate` timestamp NULL DEFAULT NULL,
  `confirmEmail` int(1) NOT NULL DEFAULT '0',
  `pin` int(11) NOT NULL DEFAULT '0',
  `exp` int(11) NOT NULL DEFAULT '0',
  `minutes` int(11) NOT NULL DEFAULT '0',
  `rp` int(11) NOT NULL DEFAULT '0',
  `donate` int(11) NOT NULL DEFAULT '0',
  `googlecode` varchar(60) NOT NULL DEFAULT 'none',
  `promocode` varchar(255) NOT NULL,
  `googlesecret` varchar(60) NOT NULL DEFAULT 'none',
  `email_status` int(11) NOT NULL DEFAULT '0',
  `achievements_slot` int(1) NOT NULL DEFAULT '0',
  `donate_slot` int(1) NOT NULL DEFAULT '0',
  `done` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
