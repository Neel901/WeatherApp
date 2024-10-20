package com.example.DailyWeather.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeatherSummaryRequest {
    private String city;
    private LocalDate date;
    private BigDecimal averageTemp;
    private BigDecimal maxTemp;
    private BigDecimal minTemp;
    private String dominantCondition;
}
