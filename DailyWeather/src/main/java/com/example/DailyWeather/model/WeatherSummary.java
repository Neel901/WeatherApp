package com.example.DailyWeather.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "daily_weather_summary")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeatherSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;

    private LocalDate date;

    private BigDecimal averageTemp;
    private BigDecimal maxTemp;
    private BigDecimal minTemp;

    private String dominantCondition;
}
