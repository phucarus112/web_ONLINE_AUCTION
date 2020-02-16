-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: online_auction
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auction_list`
--

DROP TABLE IF EXISTS `auction_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auction_list` (
  `USER_ID` int(11) NOT NULL,
  `PRODUCT_ID` int(11) NOT NULL,
  `PRICE` int(11) NOT NULL,
  `DATE` datetime NOT NULL,
  PRIMARY KEY (`USER_ID`,`PRODUCT_ID`,`DATE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auction_list`
--

LOCK TABLES `auction_list` WRITE;
/*!40000 ALTER TABLE `auction_list` DISABLE KEYS */;
INSERT INTO `auction_list` VALUES (5,6,15390000,'2020-02-02 01:00:37'),(5,6,15490000,'2020-02-02 01:05:47'),(5,6,15590000,'2020-02-02 01:11:53'),(5,6,15690000,'2020-02-02 01:15:47'),(5,6,16690000,'2020-02-02 01:20:19'),(5,6,16790000,'2020-02-02 01:27:11'),(5,6,16890000,'2020-02-02 01:34:21'),(5,6,16990000,'2020-02-02 08:35:14'),(5,6,17090000,'2020-02-02 08:41:19');
/*!40000 ALTER TABLE `auction_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `ID` int(11) NOT NULL,
  `CAT_NAME` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Smart Phone'),(2,'Laptop'),(3,'Headphone'),(4,'Smart Watch');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history_product`
--

DROP TABLE IF EXISTS `history_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `history_product` (
  `USER_ID` int(11) NOT NULL,
  `PRODUCT_ID` int(11) NOT NULL,
  `PRICE` int(11) NOT NULL,
  `DATE` datetime NOT NULL,
  PRIMARY KEY (`USER_ID`,`DATE`,`PRODUCT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history_product`
--

LOCK TABLES `history_product` WRITE;
/*!40000 ALTER TABLE `history_product` DISABLE KEYS */;
INSERT INTO `history_product` VALUES (5,6,15390000,'2020-02-02 01:00:37'),(5,6,15490000,'2020-02-02 01:05:47'),(5,6,15590000,'2020-02-02 01:11:53'),(5,6,15690000,'2020-02-02 01:15:47'),(5,6,16690000,'2020-02-02 01:20:19'),(5,6,16790000,'2020-02-02 01:27:11'),(5,6,16890000,'2020-02-02 01:34:21'),(5,6,16990000,'2020-02-02 08:35:14'),(5,6,17090000,'2020-02-02 08:41:19');
/*!40000 ALTER TABLE `history_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `ID` int(11) NOT NULL,
  `NAME` varchar(500) NOT NULL,
  `DESCRIPTION` varchar(10000) NOT NULL,
  `ORIGINAL_PRICE` int(11) NOT NULL,
  `PRICE` int(11) NOT NULL,
  `STATUS` int(11) NOT NULL,
  `DAYSTART` datetime NOT NULL,
  `DAYEND` datetime NOT NULL,
  `SELLER` int(11) NOT NULL,
  `TURN_AUCTION` int(11) NOT NULL,
  `BUOCGIA` int(11) DEFAULT NULL,
  `CATEGORIES` int(11) NOT NULL,
  `BIDDER` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Điện thoại  OPPO A39','<p>Vốn l&agrave; một đạo diễn chuy&ecirc;n trị d&ograve;ng phim kinh dị, t&acirc;m l&yacute; nặng đ&ocirc;, ng&agrave;y&nbsp;<a class=\"link-inline-content\" title=\"Victor Vũ \" href=\"http://kenh14.vn/victor-vu.html\" target=\"_blank\" rel=\"noopener\" data-cke-saved-href=\"http://kenh14.vn/victor-vu.html\">Victor Vũ&nbsp;</a>quyết định mạo hiểm với&nbsp;<em><strong><a class=\"link-inline-content\" title=\"Mắt Biếc\" href=\"http://kenh14.vn/mat-biec-2019.html\" target=\"_blank\" rel=\"noopener\" data-cke-saved-href=\"http://kenh14.vn/mat-biec-2019.html\">Mắt Biếc</a>&nbsp;</strong></em>- một t&aacute;c phẩm t&igrave;nh cảm, l&atilde;ng mạn, ai nấy đều v&ocirc; c&ugrave;ng ngạc nhi&ecirc;n bởi kh&ocirc;ng biết cha đẻ của&nbsp;<a class=\"link-inline-content\" title=\"Scandal\" href=\"http://kenh14.vn/scandal-bi-mat-tham-do.html\" target=\"_blank\" rel=\"noopener\" data-cke-saved-href=\"http://kenh14.vn/scandal-bi-mat-tham-do.html\">Scandal</a>&nbsp;sẽ xử l&yacute; ra sao với dự &aacute;n n&agrave;y. Khi Mắt Biếc được c&ocirc;ng chiếu, sự ngạc nhi&ecirc;n c&ograve;n lớn hơn thế khi đ&acirc;y l&agrave; một bộ phim đủ t&igrave;nh để chinh phục cả những kh&aacute;n giả kh&oacute; t&iacute;nh nhất. Ch&iacute;nh nhờ vậy m&agrave; phim li&ecirc;n tục lập được những th&agrave;nh t&iacute;ch đ&aacute;ng nể v&agrave; thời điểm hiện tại, doanh thu Mắt Biếc đ&atilde; c&aacute;n mốc hơn 160 tỷ.</p>',6900000,6900000,1,'2020-01-01 09:00:00','2020-02-13 22:13:00',7,0,400000,1,-1),(2,'Điện thoại Vivo U10','<p>Chiếc điện thoại Vivo U10 l&agrave; một chiếc smartphone thuộc ph&acirc;n kh&uacute;c gi&aacute; tầm trung, g&acirc;y ấn tượng với thiết kế m&agrave;n h&igrave;nh giọt nước tr&agrave;n viền, dung lượng pin khủng, bộ ba camera tr&iacute; tuệ nh&acirc;n tạo c&ugrave;ng nhiều t&iacute;nh năng, c&ocirc;ng nghệ nổi trội kh&aacute;c.</p>\r\n<p>ygtfrdyyytkyu</p>',3990000,3990000,1,'2020-02-14 17:00:00','2020-02-14 23:59:00',0,0,100000,1,-1),(3,'Điện thoại Nokia 6.1 ','<p>Sau nhiều r&ograve; rỉ th&igrave; cuối c&ugrave;ng chiếc Nokia 6.1 (Nokia 6 new) cũng đ&atilde; ch&iacute;nh thức ra mắt với một thiết kế sang trọng nhưng vẫn c&oacute; g&igrave; đ&oacute; đ&aacute;ng tiếc cho một chiếc smartphone ra mắt v&agrave;o năm 201tyttyyuyuiu.</p>',3590000,3590000,0,'2020-01-23 03:25:00','2020-02-28 17:48:00',7,0,100000,1,-1),(4,'Laptop Apple MacBook Pro 2018 Touch i5 2.3GHz/8GB/256GB (MR9Q2SA/A)','<p>Thế hệ Macbook Pro 2018 đ&atilde; được ra mắt với n&acirc;ng cấp mạnh mẽ về cấu h&igrave;nh v&agrave; khả năng bảo mật với con chip Apple T2.&nbsp;</p>',39900000,39900000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,500000,2,-1),(5,'Laptop Lenovo IdeaPad 330 15 i7 8550U/4GB/1TB+16GB/4GB R530/Win10 (81DE01JPVN)','Laptop Lenovo IdeaPad 330 có thiết kế đơn giản nhưng hiệu quả làm việc cao với card đồ họa rời tiên tiến, laptop Lenovo IdeaPad sẽ giúp bạn xử lí công việc dễ dàng hơn bên cạnh đó còn là thiết bị giải trí vô cùng thú vị.',18990000,18990000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,2,-1),(6,'Laptop Dell Vostro 3580 i5 8265U/4GB/1TB/Win10 (T3RMD1)','Dell Vostro 3580 là chiếc laptop văn phòng cấu hình khỏe, ổ cứng HDD dung lượng khủng lưu trữ thả ga mọi bộ phim hay bản nhạc yêu thích. ',15290000,17090000,1,'2020-02-13 17:00:00','2020-02-15 08:48:00',7,9,100000,2,5),(7,'Laptop Acer Aspire A515 54 54EU i5 10210U/8GB/512GB/Win10 (NX.HN3SV.002)','Acer Aspire A515 54 54EU vượt trội trong dòng laptop văn phòng với Chip Core i5 thế hệ 10 cùng thời lượng pin lên đến 10 tiếng sẵn sàng đồng hành cùng bạn suốt cả ngày dài.',15990000,15990000,0,'2020-02-14 17:00:00','2020-02-28 17:48:00',0,0,100000,2,-1),(8,'Laptop Apple Macbook Pro Touch 2019 i7 2.6GHz/16GB/256GB/4GB Radeon 555X (MV922SA/A)','MacBook Pro 2019 được Apple ra mắt là một chiếc laptop cá nhân mang tính thời trang rất cao với thiết kế tinh tế đến từng chi tiết bên cạnh cấu hình khủng để vận hành trơn tru hầu hết các công việc văn phòng như Photoshop, AI, cắt ghép video. Thêm vào đó là một số tính năng hữu ích khác như thanh cảm ứng Touch Bar, Touch ID, màn hình Retina.',55990000,55990000,0,'2020-02-14 17:00:00','2020-02-28 17:48:00',0,0,100000,2,-1),(9,'Laptop Apple Macbook Air 2019 i5 1.6GHz/8GB/128GB (MVFM2SA/A)','MacBook Air 2019 128 GB i5 đã ra mắt giữ nguyên các ưu điểm vốn có của dòng MacBook Air: Mỏng nhẹ, cấu hình khỏe và pin trâu. Mẫu MacBook mới con được trang bị màn hình True Tone và cải tiến bàn phím Butterfly thế hệ mới, ổn định và gõ êm hơn.',28990000,28990000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,2,-1),(10,'Tai nghe Bluetooth sạc không dây AirPods 2 Apple MRXJ2 Trắng','Thiết kế đơn giản, thời trang và nhỏ gọn.',5990000,5990000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,3,-1),(11,'Tai nghe Bluetooth LG HBS-1120 Đen','Thiết kế gọn nhẹ, liền mạch tinh xảo và thanh lịch, nút tai có thể thu vào.',3490000,3490000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,3,-1),(12,'Tai nghe Bluetooth True Wireless Huawei FreeBuds 3','Thiết kế nhỏ gọn, êm ái, đảm bảo thoải mái khi sử dụng.',3990000,3990000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,3,-1),(13,'Tai nghe Bluetooth True Wireless JBL T120 Đen','Thiết kế gọn nhẹ, trẻ trung và đầy cá tính.',2390000,2390000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,3,-1),(14,'Tai nghe chụp tai Gaming Logitech G Pro Đen','Tai nghe G PRO được thiết kế có trọng lượng siêu nhẹ, bền và cực kỳ thoải mái.',2490000,2490000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,3,-1),(15,'Tai nghe Bluetooth True Wireless Mozard DS635-WB Đen','Thiết kế tiện lợi, thoải mái khi đeo và không dễ rơi.',950000,950000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,3,-1),(16,'Apple Watch S5 LTE 44mm viền nhôm dây cao su','Apple Watch S5 LTE là phiên bản nâng cấp với phiên bản Apple Watch S5 . Lần đầu tiên Apple Watch sẽ được trang bị màn hình OLED luôn bật, tính năng la bàn và khả năng cảnh báo khẩn cấp trên nhiều quốc gia hơn và đắc biệt chiếc Apple Watch phiên bản LTE có tích hợp tính năng nghe gọi độc lập như một chiếc điện thoại...',14990000,14990000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,4,-1),(17,'Apple Watch S4 GPS 44mm viền nhôm dây vải','Apple Watch S4 GPS 44mm viền nhôm dây vải có thiết kế khá đơn giản và nổi bật. Sử dụng dây từ chất liệu vải, giúp đồng hồ cá tính hơn, nhẹ nhàng hơn khi đeo trong thời gian dài. Ngoài ra dây vải còn giúp bạn thấy dễ chịu hơn khi tay ra mồ hôi lúc vận động nhiều.',11990000,11990000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,4,-1),(18,'Đồng hồ Nam Orient RA-AG0027Y10B - Cơ tự động','Đồng hồ Orient đem đến những sản phẩm ấn tượng chinh phục người nhìn một cách nhanh chóng. Đồng hồ Orient với những chất liệu cao cấp bóng bẩy nâng tầm đẳng cấp cho người sở hữu, phù hợp với doanh nhân thành đạt, dân văn phòng hay các giám đốc công ty. Phong cách thời thượng, sang trọng đầy sức thu hút đến từ đồng hồ Orient chắc chắn sẽ khiến bạn luôn hãnh diện với những người xung quanh.',6752000,6752000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,4,-1),(19,'Đồng hồ Nữ Michael Kors MK2747','Michael Kors là thương hiệu hàng đầu của Mỹ về mặt hàng phụ kiện thời trang và thể thao cao cấp. Truyền thống của công ty nằm ở việc luôn cho ra đời những sản phẩm tinh xảo, khéo léo đồng thời mang đậm phong cách “jet-set” kiểu Mỹ. Sứ mệnh của thương hiệu Michael Kors là “mang phong cách sống năng động và sang trọng đến với mọi khách hàng trên thế giới”.',3249000,3249000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,4,-1),(20,'Đồng hồ Nam MVMT D-MR01-WC','MVMT là dòng đồng hồ nguyên bản tạo nên sự khác biệt bằng cách mang đến cho bạn những thiết kế tối giản, chất lượng với giá cả hợp lý. Trên hết, MVMT được tạo ra với ước mơ làm sống lại sứ mệnh cuối cùng của chúng tôi: truyền cảm hứng cho bạn để sống cuộc sống theo cách riêng của bạn.',2040000,2040000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,4,-1),(21,'Apple Watch S5 LTE 44mm viền thép dây thép','Đo nhịp tim, Tính lượng Calories tiêu thụ, Đếm số bước chân, Tính quãng đường chạy, Chế độ luyện tập, Định vị, Đếm bước chân, Đồng hồ đếm ngược, Phát hiện té ngã, Báo thức, Nghe nhạc với tai nghe Bluetooth, Màn hình luôn hiển thị, Gọi điện trên đồng hồ, Từ chối cuộc gọi, Dự báo thời tiết, La bàn, Đồng hồ bấm giờ, Điều khiển chơi nhạc, Rung thông báo, Thay mặt đồng hồ, Nhận cuộc gọi, Tìm điện thoại',21990000,21990000,0,'2020-01-20 03:25:00','2020-02-28 17:48:00',0,0,100000,4,-1),(22,'Đồng hồ thông minh Colmi S9 Plus','Đồng hồ thông minh Colmi S9 Plus có thiết kế hiện đại. Kiểu dáng màn hình chữ nhật độc đáo cùng với phối hài hòa giữa màu xanh nước và đen tạo được nét năng động, cá tính. Thiết kế các tính năng tiện ít giúp theo dõi và điều chỉnh chế độ luyện tập, rèn luyện sức khỏe, mang đến cho bạn sự hài lòng. ',690000,690000,0,'2020-02-14 17:00:00','2020-02-28 17:48:00',0,0,100000,4,-1),(24,'iphone12','<p>g</p>',200000000,200000000,0,'2020-02-06 06:19:00','2020-02-28 17:48:00',7,0,1200000,1,-1);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `USER_ID` int(11) NOT NULL,
  `PRODUCT_ID` int(11) NOT NULL,
  `PERSON_ID` int(11) NOT NULL,
  `CONTENT` varchar(300) NOT NULL,
  `DATE` datetime NOT NULL,
  PRIMARY KEY (`USER_ID`,`PERSON_ID`,`PRODUCT_ID`,`DATE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `ID` int(11) NOT NULL,
  `USERNAME` varchar(45) NOT NULL,
  `PASSWORD` varchar(100) NOT NULL,
  `FULLNAME` varchar(45) NOT NULL,
  `EMAIL` varchar(45) NOT NULL,
  `DOB` datetime NOT NULL,
  `PERMISSION` int(11) NOT NULL,
  `POINT_PLUS` int(11) NOT NULL,
  `POINT_SUBSTRACT` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `USERNAME_UNIQUE` (`USERNAME`),
  UNIQUE KEY `EMAIL_UNIQUE` (`EMAIL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (0,'admin','$2a$10$A/HxfZ5Iy7B9kNBRLo2MSewOPRx0BZAiE69UuucAWdVgfBBz6WFYS','admin','huynhphuc211.thcs@gmail.com','1999-11-02 00:00:00',2,0,0),(5,'popo','$2a$10$Y.Qi9fbN3iwBRIPeLLvBQOI.Q8K6hIa4iz9kJ24RcuA7zlWCvFKL6','Lê Huỳnh Phúc','nguyentranaithi@gmail.com','2019-12-31 00:00:00',-1,2,0),(7,'tara','$2a$10$DjGVUqH.NlTD5N35T5kLQOR8sDQZE.TCFddUR.hEgIXFZkLaPo2sO','phuc','abc@gmail.com','2020-02-14 00:00:00',1,0,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watch_list`
--

DROP TABLE IF EXISTS `watch_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watch_list` (
  `USER_ID` int(11) NOT NULL,
  `PRODUCT_ID` int(11) NOT NULL,
  PRIMARY KEY (`USER_ID`,`PRODUCT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watch_list`
--

LOCK TABLES `watch_list` WRITE;
/*!40000 ALTER TABLE `watch_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `watch_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `won_list`
--

DROP TABLE IF EXISTS `won_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `won_list` (
  `USER_ID` int(11) NOT NULL,
  `PRODUCT_ID` int(11) NOT NULL,
  `PRICE` int(11) NOT NULL,
  `DATE` datetime NOT NULL,
  PRIMARY KEY (`PRODUCT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `won_list`
--

LOCK TABLES `won_list` WRITE;
/*!40000 ALTER TABLE `won_list` DISABLE KEYS */;
INSERT INTO `won_list` VALUES (-1,1,6900000,'2020-02-13 22:13:00'),(-1,2,3990000,'2020-02-14 23:59:00'),(5,6,17090000,'2020-02-15 08:48:00');
/*!40000 ALTER TABLE `won_list` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-02-16 20:10:38
