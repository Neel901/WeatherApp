package com.example.DailyWeather.controller;

import com.example.DailyWeather.dto.WeatherSummaryAggregates;
import com.example.DailyWeather.dto.WeatherSummaryRequest;
import com.example.DailyWeather.WeatherSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin
public class WeatherSummaryController {

    @Autowired
    private WeatherSummaryService weatherSummaryService;

    @PostMapping("/summary")
    public void saveWeatherSummary(@RequestBody WeatherSummaryRequest request) {
        weatherSummaryService.saveSummary(
                request.getCity(),
                request.getDate(),
                request.getAverageTemp(),
                request.getMaxTemp(),
                request.getMinTemp(),
                request.getDominantCondition()
        );
    }
    @GetMapping("/aggregates")
    public WeatherSummaryAggregates getWeatherAggregates(@RequestParam String city, @RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date);
        return weatherSummaryService.getAggregates(city, localDate);
    }
}
