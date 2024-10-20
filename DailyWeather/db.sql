CREATE TABLE `daily_weather_summary` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `average_temp` decimal(38,2) DEFAULT NULL,
  `max_temp` decimal(38,2) DEFAULT NULL,
  `min_temp` decimal(38,2) DEFAULT NULL,
  `dominant_condition` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
)
