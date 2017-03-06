-- phpMyAdmin SQL Dump
-- version 4.6.0
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 02, 2016 at 12:03 AM
-- Server version: 5.7.11
-- PHP Version: 7.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `matcha`
--
CREATE DATABASE IF NOT EXISTS `matcha` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `matcha`;

-- --------------------------------------------------------

--
-- Table structure for table `actions`
--

CREATE TABLE `actions` (
  `action_id` int(11) NOT NULL,
  `action` enum('like','dislike','message','report','visite','bloque') NOT NULL,
  `action_receiver` int(11) NOT NULL,
  `action_sender` int(11) NOT NULL,
  `action_created_at` datetime NOT NULL,
  `action_see` int(11) NOT NULL DEFAULT '0',
  `action_message` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `actions`
--
-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_login` varchar(30) NOT NULL,
  `user_email` varchar(64) NOT NULL,
  `user_name` varchar(30) NOT NULL,
  `user_surname` varchar(30) NOT NULL,
  `user_birth` date NOT NULL,
  `user_city` varchar(50) DEFAULT NULL,
  `user_lat` float DEFAULT NULL,
  `user_lon` float DEFAULT NULL,
  `user_sex` int(11) NOT NULL,
  `user_orientation` int(11) NOT NULL,
  `user_biography` text,
  `user_mdp` varchar(100) NOT NULL,
  `user_key` varchar(100) DEFAULT NULL,
  `user_valid` int(11) NOT NULL,
  `user_snap_profile` varchar(100) DEFAULT NULL,
  `user_snap1` varchar(50) DEFAULT NULL,
  `user_snap2` varchar(50) DEFAULT NULL,
  `user_snap3` varchar(50) DEFAULT NULL,
  `user_snap4` varchar(50) DEFAULT NULL,
  `user_snap5` varchar(50) DEFAULT NULL,
  `user_music` varchar(150) DEFAULT NULL,
  `user_tags` varchar(200) DEFAULT NULL,
  `user_city_begin` varchar(50) DEFAULT NULL,
  `user_size` int(11) DEFAULT NULL,
  `user_poid` int(11) DEFAULT NULL,
  `user_eyes` varchar(20) DEFAULT NULL,
  `user_hairs` varchar(20) DEFAULT NULL,
  `user_new_mail` varchar(200) DEFAULT NULL,
  `user_socket` varchar(100) NOT NULL,
  `user_last_activity` datetime DEFAULT NOW(),
  `user_connect` int(11)  DEFAULT '0',
  `user_score` int(11) NOT NULL DEFAULT '0',
  `user_admin` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_login`, `user_email`, `user_name`, `user_surname`, `user_birth`, `user_city`, `user_lat`, `user_lon`, `user_sex`, `user_orientation`, `user_biography`, `user_mdp`, `user_key`, `user_valid`, `user_snap_profile`, `user_snap1`, `user_snap2`, `user_snap3`, `user_snap4`, `user_snap5`, `user_music`, `user_tags`, `user_city_begin`, `user_size`, `user_poid`, `user_eyes`, `user_hairs`, `user_new_mail`, `user_socket`, `user_last_activity`, `user_connect`, `user_score`, `user_admin`) VALUES
(17, 'kaboff', 'kaboffbeta@gmail.com', 'Le Floch', 'Arnaud', '1991-04-02', '94140', 48.8018, 2.42138, 2, 1, 'Je suis Admin du site Meetal, je recherche une femme de qualité supérieur.', 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'o8mgirAXkY83aAxLztwmqGz0bcYCw3ugm3jkHUpb9XtBm8KP', 1, '430add92ed851c6aa78293011470eab61480586059520.jpeg', '430add92ed851c6aa78293011470eab61480586059520.jpeg', NULL, NULL, NULL, NULL, 'System of a Down;Arch Enemy;Slipknot;Asking Alexandria;Lamb of God', 'Musique;One Piece;Jeux Video;OverWatch;Batterie;Guitare;', 'auxerre', 181, 58, 'Noir', 'Brun', NULL, '3a21065d0fea79bae971e626c1a1d661b3e300b48917324b764dc6de177b3730', '2016-12-01 12:00:47', 0, 878, 1),
(18, 'julie', 'lol@testtest.fr', 'lefranc', 'julie', '1984-06-03', '75017', 48.892, 2.31929, 1, 1, 'Je suis a la recherche d\'une personne bien aimable qui aime cuisiner faire de la musique pour partager mes passions.', 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'U3I62PIz7c6lFfa3kcdczu0pmgy4IuPJ9jY4Im405ecl85I2', 1, 'c70e74c013aace50c3866e7ade9a69c91480583903949.jpeg', 'c70e74c013aace50c3866e7ade9a69c91480583903949.jpeg', NULL, NULL, NULL, NULL, 'Renaud;Die antwoord;Serge gainsbourg;Jacques Brel;Francis Cabrel', 'Cuisine;Guitare;Cheval;Peinture;Cinema;', NULL, 180, 63, 'Bleu', 'Blond', NULL, 'ca3e00c37b89173d1d1ca2aeb477bee5776f94a8f34c6531b2878b7c7e10188e', '2016-12-01 10:24:12', 0, 5, 0),
(19, 'douglas', 'mdr@teesttest.fr', 'Gokar', 'Douglas', '1996-01-11', '75018', 48.8913, 2.35299, 2, 1, 'Actuellement en recherche de partenaire. Vous pouvez me meet si vous pratiquez le Sport la Musique et ou la Danse', 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'gEyua6CCqTzCPYZgX2tsKnJ1me1nMM3936Aa7NLu14uuAXWr', 1, '985cb885cce9ad051d2c71ed3b0aef811480586826559.jpeg', '985cb885cce9ad051d2c71ed3b0aef811480586826559.jpeg', '02637824b62a4fed02902e4d5d2fa4f31480586964717.jpeg', NULL, NULL, NULL, 'Ice Cube;50 Cent;Efy Saboutey;Shakira;Beyonce', 'Voyage;Musique;Jeux Video;Sport;Sortie entre amis;', NULL, 188, 56, 'Noir', 'Noir', NULL, 'edb40f827fbee8832673f589138d608f7aeb2051137e2b7787d951b790e22910', '2016-12-01 11:15:59', 0, -5, 0),
(20, 'gwen', 'test@jsuisunclochard.fr', 'Barthelemy', 'gwen', '1988-08-09', '94200', 48.81, 2.39117, 1, 2, 'A la recherche d\'un chinois adequate qui boit du jager :)', 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'c978TVcOdsXUuM93Y2SHghfRdJQWdQ6cG59GtmrfH9R3RV3J', 1, '947a4be279cbfefe6593e1acda86086d1480587535133.png', '947a4be279cbfefe6593e1acda86086d1480587535133.png', NULL, NULL, NULL, NULL, 'Slipknot;Asking Alexandria;Metal Japonais;;', 'Metal;Chinois;Jägermeister;', NULL, 183, 49, 'Vert', 'Brun', NULL, 'cb80bb5cc13ff02588f96ad9ddfa8e7dbae3600d82e28aedda5e2a8cf2dedec4', '2016-12-01 11:28:02', 0, 5, 0),
(21, 'audrey', 'test@test.frp', 'Boucher', 'audrey', '1993-11-12', '92110', 48.9048, 2.30627, 1, 3, 'bonjour je m\'apelle audrey et j\'adore juste le poulet de malade alors si tu cherche une mangeuse de poulet like moi :)', 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'An8LfCPkIwiGnlgv5nd2v2tWWBy3hyZvNdCM3iTSzqLv1mqh', 1, '0f942b121291af34ce9957c32a5004ce1477344704432.jpeg', '0f942b121291af34ce9957c32a5004ce1477344704432.jpeg', NULL, NULL, NULL, NULL, 'Linkin Park;Tryo;System of a Down;Le poulet du dimanche;Kirby song Kawaiiii', 'Kirby;Linkin Park;Pokemon;Guitare;Voiture;WTC;', NULL, 175, 60, 'Noir', 'Brun', NULL, '97724339d1aa511c05b48d1d2c058a3aa9bb2ba5891caf40eada9feb2c624e86', '2016-12-01 12:29:22', 0, 773, 0),
(26, 'krok2', 'kaboffbeta@gmail.com', 'krok', 'krok', '1993-08-05', '94140', 48.8018, 2.42138, 2, 2, 'je suis trop beau tu a vuje suis trop beau tu a vuje suis trop beau tu a vuje suis trop beau tu a vuje suis trop beau tu a vuje suii', 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'S2ry6uUcnSPYeRKvlRyw2N1VClK61zWVtdRECz6zQYHRGvbx', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '', '', NULL, '3f40a6c6891fde608af1932c5dc929cc13c88a48b47d9a7964745293956487dc', '2016-11-14 05:25:49', 0, 5, 0),
(27, 'mehdi', 'lol@lol.fr', 'Addibi', 'mehdi', '1991-02-06', '11100', 43.0549, 1.99727, 2, 3, 'Si tu est latina c\'est un plus, ce que j\'aime par dessus tout ce sont les femmes qui font du sport', 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'J65rEBwzDJqRrWHHUonRZGrpJvUHoqJkkcI4ALmg6fYOk2TZ', 0, 'd0b9e1c79b4a06db44d64bcba4ecf8bc1480590249470.png', 'd0b9e1c79b4a06db44d64bcba4ecf8bc1480590249470.png', NULL, NULL, NULL, NULL, 'Rap en tout genre;50 cent;Eminem;;', 'Jeux Video;Overwatch;E-Sport;Poker;Soiree entre amis;', NULL, 171, 70, 'Noir', 'Noir', NULL, '448c15fafc1de7572f86b394a076d505c8492dc0e3b48382a240d51f5447f31e', '2016-12-01 12:07:48', 0, 5, 0),
(28, 'Corey', 'test@test.meetal.fr', 'Corey', 'Taylor', '1973-12-08', '97110', 46.2276, 2.21375, 2, 1, 'Salut je suis le chanteur de Slipknot et de Stone sour, j\'aime beaucoup tout ce qui est tatouage alors si tu en as c\'est un plus', 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'qjzTlhpDwOESIaOGSZT7LT9n595R3BYoC7NaKFCIiguuZ07W', 1, '871960a89ed518dc08dc81e529fc36311477344312574.jpeg', '871960a89ed518dc08dc81e529fc36311477344312574.jpeg', NULL, NULL, NULL, NULL, 'Slipknot;Stone Sour;Slayer;Motorhead;Metallica', 'Metal;Heavy Metal;Masque;Tatouage;', NULL, 185, 74, 'Bleu', 'Blond', NULL, '0062ea1c2e9ebffb605f53b44872405159e8afd37eb0efbe9d8da5c218f55010', '2016-10-29 14:55:59', 0, 5, 0),
(29, 'dherz', 'test@meetal.meetal.fr', 'Rammos', 'Anthony', '1985-05-08', '75017', 48.892, 2.31929, 2, 1, 'J\'aime beaucoup les chinoises et windows', 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'JGjm6MaIs7GkCgzwXe35kehZlFYdopyb6d4JJh9rJicxkNRL', 1, 'c05aeeba5ad1b919b81d19f1178e68591477345858840.jpeg', 'c05aeeba5ad1b919b81d19f1178e68591477345858840.jpeg', NULL, NULL, NULL, NULL, 'Die antwoord;Kraddy;Ouh Ah Ah Ah;Limp Bizkit;System of a Down', 'Cinema;Manga;Serie;Cuisine;', NULL, 161, 62, 'Bleu', 'Brun', NULL, 'e168729e700a7dca80af838de775c842b6f166ae3eda702984dbc30651f5d64d', '2016-12-01 11:40:09', 0, -35, 0),
(30, 'mathiaskun', 'meetal@meetal.meetal.fr', 'lct', 'Matthias', '1990-04-06', '94370', 48.767, 2.52235, 2, 1, NULL, 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'AYHONAoASHQfU04U4LxuFzNQAhNTJroQzo6dG7JNzavXawLE', 1, '5e00bb4e3cd9d05a194ae00fa7fc020a1477345985708.jpeg', '5e00bb4e3cd9d05a194ae00fa7fc020a1477345985708.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '423c7c8c72a7165b27a4134a6070474665609ed02fcca22c367817ed36a0fe33', '2016-10-28 20:42:47', 0, 0, 0),
(31, 'akerkeb', 'meetal@meetal.fr', 'kerkeb', 'abdou', '1986-06-14', '75018', 48.8913, 2.35299, 2, 1, 'Bonjour j\'aime beaucoup tout ce qui est Kawai, je recherche une partenaire pour pouvoir jouer a World of Druide ensemble.', 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'K0xiMeM9MaKxMCF7WTm5V6ipVN034sis2woZ703b3Bjtx1Gg', 1, '827cf79b1825607c38bcb3cf2130f8a91477346323876.jpeg', '827cf79b1825607c38bcb3cf2130f8a91477346323876.jpeg', NULL, NULL, NULL, NULL, 'Superbus;League of legends Musique;Diam\'s;Quatre Saison;Baby Metal', 'wow;kawai;camagru;', NULL, 174, 64, 'Marron', 'Brun', NULL, 'd046cb3c662eea19258bfa727fd36bfe3df98b83387924080eb94c3d53adbc27', '2016-11-14 04:53:52', 0, -5, 0),
(32, 'aymee', 'meetal@test.meetal.fr', 'Daviere', 'Aymee', '1996-05-19', '75011', 48.858, 2.38115, 1, 3, 'Hey vous tous, tout ceux qui aime les dramas et les festoches vous pouvez venir me meet directement :)', 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'KvorWsIQkvfiuy1YaCqyRjlAil9UITvHiGiA7ioBuAngTQ51', 1, 'faf08b7d61f8ef8658aa4adb2c9ae1cb1480584689743.png', 'faf08b7d61f8ef8658aa4adb2c9ae1cb1480584689743.png', NULL, NULL, NULL, NULL, 'MitchiriNeko March;Corobizar Musique;Dubstep;Ditto;', 'Zerator;Corobizar;Stream;Jeux Video;Cinema;Drama;Manga;Mister MV;', NULL, 172, 52, 'Vert', 'Brun', NULL, '2f612aa3371d406b74e8d3b1d208dbc52a4c5a66feb34bd803eac0101c426b4a', '2016-12-01 10:36:53', 0, -5, 0),
(33, 'Angelina', 'meetal@test.meeaal.fr', 'carotte', 'Angelina', '1974-05-07', '75012', 48.8294, 2.42654, 1, 2, NULL, 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', '2U3AkhsMxdIlOZ5j6qjc7PRrHDA6Cwuypigk8vkLkP23tl5N', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1a5fbb3564c08e93dc8b9ed64107dd85b41dc74208c39b98fc3a9d340526a3f3', '2016-10-28 22:03:47', 0, 0, 0),
(34, 'okoktest', 'kaboff@lol.lol.fr', 'test', 'test', '1985-06-19', '69460', 46.0595, 4.59875, 1, 1, NULL, 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'NgiRgyMP39ACmZNnkKSlJXZQTLLf0OpIGeID8lo86JhzWT9N', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '69460', NULL, NULL, NULL, NULL, NULL, 'b82fb50377260e360d3d6b0dd96b068724cb1a04dd4a32e4af1af4a3c1f68257', '2016-11-10 02:33:15', 0, 5, 0),
(35, 'mehdichan', 'lol@krok.meetal.fr', 'Aissabrahim', 'Mehdi', '1994-06-13', '92170', 48.8246, 2.28855, 2, 1, NULL, 'ff6f2758b29f5753aad6300f758cc9ddfd06f463d2032c53c578972ca24aff93', 'lFseJmLEewSE4rYirLCw09NbFjJNnUcmLW3jfYTOwWp8fvdk', 1, 'd6e9fa83e62a7715c35c68026212b8971477759611980.jpeg', 'd6e9fa83e62a7715c35c68026212b8971477759611980.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, '69460', NULL, NULL, NULL, NULL, NULL, 'f4fd5228a126e9f7c375515e1720d449c996567a6955a0e191c9debc9f2a6fb9', '2016-12-01 11:44:38', 0, 5, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actions`
--
ALTER TABLE `actions`
  ADD PRIMARY KEY (`action_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actions`
--
ALTER TABLE `actions`
  MODIFY `action_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=393;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
