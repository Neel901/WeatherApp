package com.example.dailyweather.dto;


import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeatherSummaryRequest {
    @NotEmpty(message = "City mandatory")
    private String city;

    @NotEmpty(message = "Date mandatory")
    private LocalDate date;

    @NotEmpty(message = "Average temp mandatory")
    private BigDecimal averageTemp;

    @NotEmpty(message = "Max temp mandatory")
    private BigDecimal maxTemp;

    @NotEmpty(message = "Min temp mandatory")
    private BigDecimal minTemp;

    @NotEmpty(message = "Dominant condition mandatory")
    private String dominantCondition;
}
