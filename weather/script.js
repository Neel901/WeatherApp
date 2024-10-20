const apiKey = '3deecbe90679cf4893ae28d4b8811578'; // Replace with your OpenWeatherMap API key
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const weatherContainer = document.getElementById('weather-container');
const temperatureUnitSelector = document.getElementById('temp-unit');
let temperatureUnit = 'Celsius'; // Default temperature unit
let temperatureThreshold = 35; // Default threshold in Celsius

// Function to update the daily aggregates in the UI
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

// Function to display an alert if the temperature exceeds the threshold
function checkTemperatureThreshold(city, temp) {
    const aggregateDiv = document.getElementById(`aggregate-${city}`);
    const convertedTemp = convertTemperature(temp, temperatureUnit);

    let alertDiv = document.getElementById(`alert-${city}`);
    
    if (!alertDiv) {
        // If alert div doesn't exist, create it and append to the city's aggregateDiv
        alertDiv = document.createElement('div');
        alertDiv.id = `alert-${city}`;
        alertDiv.classList.add('alert-message');
        aggregateDiv.appendChild(alertDiv); // Append alert div to the city's aggregate div
    }

    if (convertedTemp > temperatureThreshold) {
        alertDiv.textContent = `⚠️ Alert: Current temperature (${convertedTemp.toFixed(2)} °${temperatureUnit[0]}) exceeds the threshold!`;
        alertDiv.classList.add('alert-active'); // Add the class to make the alert visible
    } else {
        alertDiv.textContent = ''; // Clear the alert text if temperature is below the threshold
        alertDiv.classList.remove('alert-active'); // Remove the class to hide the alert
    }
}



// Temperature conversion function
function convertTemperature(temp, toUnit) {
    if (toUnit === 'Celsius') {
        return temp; // Already in Celsius
    } else if (toUnit === 'Fahrenheit') {
        temperatureThreshold = (temperatureThreshold * 9/5) + 32;
        return (temp * 9/5) + 32; // Convert to Fahrenheit
    } else if (toUnit === 'Kelvin') {
        temperatureThreshold +=273.15;
        return temp + 273.15; // Convert to Kelvin
    }
}

// Fetch weather data from API
async function fetchWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`);
    return response.json();
}

// Process the weather data and check conditions
async function processWeatherData(city, data) {
    const { main, weather } = data;
    const temp = main.temp;
    const condition = weather[0].main;

    // Create a request body for saving summary
    const requestBody = {
        city,
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
        averageTemp: temp,
        maxTemp: temp,
        minTemp: temp,
        dominantCondition: condition
    };

    // Save the weather data to the backend
    await fetch('http://localhost:8080/api/weather/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    // Fetch aggregates from the server
    const aggregatesResponse = await fetch(`http://localhost:8080/api/weather/aggregates?city=${city}&date=${requestBody.date}`);
    const aggregates = await aggregatesResponse.json();

    // Update UI with aggregates
    updateDailyAggregatesUI(city, aggregates);

    // Check if temperature exceeds the threshold
    checkTemperatureThreshold(city, temp);
}

// Fetch weather data for all cities
async function getWeatherData() {
    for (const city of cities) {
        const weatherData = await fetchWeather(city);
        await processWeatherData(city, weatherData);
    }
}

// Event listener to change temperature unit
document.getElementById('change-unit').addEventListener('click', () => {
    temperatureUnit = temperatureUnitSelector.value;
    getWeatherData(); // Fetch data again with the new unit
});

// Fetch data every hour to calculate daily aggregates
setInterval(getWeatherData, 3600000); // 1-hour interval
getWeatherData(); // Initial fetch
