package com.example.DailyWeather;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeatherSummaryAggregates {
    private BigDecimal averageTemp;
    private BigDecimal maxTemp;
    private BigDecimal minTemp;
    private String dominantCondition;
}