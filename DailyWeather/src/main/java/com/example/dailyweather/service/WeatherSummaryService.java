package com.example.dailyweather.service;

import com.example.dailyweather.dto.WeatherSummaryAggregates;
import com.example.dailyweather.model.WeatherSummary;
import com.example.dailyweather.repository.WeatherSummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WeatherSummaryService {

    @Autowired
    private WeatherSummaryRepository repository;

    public void saveSummary(String city, LocalDate date, BigDecimal averageTemp, BigDecimal maxTemp, BigDecimal minTemp, String dominantCondition) {
        WeatherSummary summary = new WeatherSummary();
        summary.setCity(city);
        summary.setDate(date);
        summary.setAverageTemp(averageTemp);
        summary.setMaxTemp(maxTemp);
        summary.setMinTemp(minTemp);
        summary.setDominantCondition(dominantCondition);
        repository.save(summary);
    }
    public WeatherSummaryAggregates getAggregates(String city, LocalDate date) {
        List<WeatherSummary> summaries = repository.findByCityAndDate(city, date);

        if (summaries.isEmpty()) {
            return null; 
        }

        BigDecimal averageTemp = summaries.stream()
                .map(WeatherSummary::getAverageTemp)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(summaries.size()), BigDecimal.ROUND_HALF_UP);

        BigDecimal maxTemp = summaries.stream()
                .map(WeatherSummary::getMaxTemp)
                .reduce(BigDecimal::max)
                .orElse(BigDecimal.ZERO);

        BigDecimal minTemp = summaries.stream()
                .map(WeatherSummary::getMinTemp)
                .reduce(BigDecimal::min)
                .orElse(BigDecimal.ZERO);

        
        String dominantCondition = determineDominantCondition(summaries);

        return new WeatherSummaryAggregates(averageTemp, maxTemp, minTemp,dominantCondition);
    }
    private String determineDominantCondition(List<WeatherSummary> summaries) {
        Map<String, Integer> conditionFrequency = new HashMap<>();

        
        for (WeatherSummary summary : summaries) {
            String condition = summary.getDominantCondition();
            conditionFrequency.put(condition, conditionFrequency.getOrDefault(condition, 0) + 1);
        }

        
        String dominantCondition = null;
        int maxCount = 0;

        for (Map.Entry<String, Integer> entry : conditionFrequency.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                dominantCondition = entry.getKey();
            }
        }

        return dominantCondition;
    }
}