package com.example.DailyWeather;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WeatherSummaryRepository extends JpaRepository<WeatherSummary, Long> {
    List<WeatherSummary> findByCityAndDate(String city, LocalDate date);
}
