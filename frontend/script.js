import { config } from './env.js';

const apiKey = config.API_KEY;
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const weatherContainer = document.getElementById('weather-container');
const temperatureUnitSelector = document.getElementById('temp-unit');
let temperatureUnit = 'Celsius';
let temperatureThreshold = 35;

function updateDailyAggregatesUI(city, aggregates) {
    const aggregateDiv = document.getElementById(`aggregate-${city}`);
    const avgTemp = convertTemperature(aggregates.averageTemp, temperatureUnit);
    const maxTemp = convertTemperature(aggregates.maxTemp, temperatureUnit);
    const minTemp = convertTemperature(aggregates.minTemp, temperatureUnit);

    if (aggregateDiv) {
        aggregateDiv.innerHTML = `
            <h4>${city} - Daily Aggregates</h4>
            <p><strong>Daily Average Temperature:</strong> ${avgTemp} °${temperatureUnit[0]}</p>
            <p><strong>Max Temperature:</strong> ${maxTemp} °${temperatureUnit[0]}</p>
            <p><strong>Min Temperature:</strong> ${minTemp} °${temperatureUnit[0]}</p>
            <p><strong>Dominant Condition:</strong> ${aggregates.dominantCondition}</p>
        `;
    } else {
        const newDiv = document.createElement('div');
        newDiv.id = `aggregate-${city}`;
        newDiv.classList.add('daily-aggregate');
        newDiv.innerHTML = `
            <h4>${city} - Daily Aggregates</h4>
            <p><strong>Daily Average Temperature:</strong> ${avgTemp} °${temperatureUnit[0]}</p>
            <p><strong>Max Temperature:</strong> ${maxTemp} °${temperatureUnit[0]}</p>
            <p><strong>Min Temperature:</strong> ${minTemp} °${temperatureUnit[0]}</p>
            <p><strong>Dominant Condition:</strong> ${aggregates.dominantCondition}</p>
        `;
        weatherContainer.appendChild(newDiv);
    }
}

function checkTemperatureThreshold(city, temp) {
    const aggregateDiv = document.getElementById(`aggregate-${city}`);
    const convertedTemp = convertTemperature(temp, temperatureUnit);

    let alertDiv = document.getElementById(`alert-${city}`);
    
    if (!alertDiv) {
        alertDiv = document.createElement('div');
        alertDiv.id = `alert-${city}`;
        alertDiv.classList.add('alert-message');
        aggregateDiv.appendChild(alertDiv); 
    }

    if (convertedTemp > temperatureThreshold) {
        alertDiv.textContent = `⚠️ Alert: Current temperature (${convertedTemp.toFixed(2)} °${temperatureUnit[0]}) exceeds the threshold!`;
        alertDiv.classList.add('alert-active');
    } else {
        alertDiv.textContent = '';
        alertDiv.classList.remove('alert-active');
    }
}



function convertTemperature(temp, toUnit) {
    if (toUnit === 'Celsius') {
        return temp;
    } else if (toUnit === 'Fahrenheit') {
        temperatureThreshold = (temperatureThreshold * 9/5) + 32;
        return (temp * 9/5) + 32; 
    } else if (toUnit === 'Kelvin') {
        temperatureThreshold +=273.15;
        return temp + 273.15;
    }
}

async function fetchWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`);
    return response.json();
}

async function processWeatherData(city, data) {
    const { main, weather } = data;
    const temp = main.temp;
    const condition = weather[0].main;
    const requestBody = {
        city,
        date: new Date().toISOString().split('T')[0],
        averageTemp: temp,
        maxTemp: temp,
        minTemp: temp,
        dominantCondition: condition
    };
    await fetch('http://localhost:8080/api/weather/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });
    const aggregatesResponse = await fetch(`http://localhost:8080/api/weather/aggregates?city=${city}&date=${requestBody.date}`);
    const aggregates = await aggregatesResponse.json();
    updateDailyAggregatesUI(city, aggregates);
    checkTemperatureThreshold(city, temp);
}
async function getWeatherData() {
    for (const city of cities) {
        const weatherData = await fetchWeather(city);
        await processWeatherData(city, weatherData);
    }
}
document.getElementById('change-unit').addEventListener('click', () => {
    temperatureUnit = temperatureUnitSelector.value;
    getWeatherData();
});

setInterval(getWeatherData, 3600000);
getWeatherData();
