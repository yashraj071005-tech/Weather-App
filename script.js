const apiKey = "c02ac589aab79ebf4d871fd7a9005e0a";
let selectedUnit = "metric";
async function getWeather(city = null) {
    const cityInput = document.getElementById("cityInput");
    const cityName = city || cityInput.value.trim();
    if (cityName === "") {
        showError("Please enter a city name.");
        return;
    }
    const weatherUrl =
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${selectedUnit}`;
    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) {
            throw new Error();
        }
        const weatherData = await response.json();
        displayWeather(weatherData);
        getForecast(weatherData.name);
        clearError();
    }
    catch (error) {
        showError("City not found. Please enter a valid city name.");
    }
}
function displayWeather(weatherData) {
    document.getElementById("cityName").innerText =
        weatherData.name;
    document.getElementById("temperature").innerText =
        `${Math.round(weatherData.main.temp)} ${selectedUnit === "metric" ? "°C" : "°F"}`;
    document.getElementById("description").innerText =
        weatherData.weather[0].description;
    document.getElementById("humidity").innerText =
        `Humidity : ${weatherData.main.humidity}%`;
    document.getElementById("windSpeed").innerText =
        `Wind Speed : ${weatherData.wind.speed}`;
    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    updateBackground(weatherData.weather[0].main);
}
function updateBackground(weatherCondition) {
    switch (weatherCondition) {
        case "Clear":
            document.body.style.background =
                "linear-gradient(to right, #f7971e, #ffd200)";
            break;
        case "Clouds":
            document.body.style.background =
                "linear-gradient(to right, #757f9a, #d7dde8)";
            break;
        case "Rain":
            document.body.style.background =
                "linear-gradient(to right, #4b79a1, #283e51)";
            break;
        default:
            document.body.style.background =
                "linear-gradient(to right, #4facfe, #00f2fe)";
    }
}
async function getForecast(cityName) {
    const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${selectedUnit}`;
    const response = await fetch(forecastUrl);
    const forecastData = await response.json();
    let forecastCards = "";
    for (let index = 0; index < forecastData.list.length; index += 8) {
        const currentDay = forecastData.list[index];
        forecastCards += `
            <div class="forecast-card">
                <h4>${currentDay.dt_txt.split(" ")[0]}</h4>
                <img src="https://openweathermap.org/img/wn/${currentDay.weather[0].icon}.png">
                <p>
                    ${Math.round(currentDay.main.temp)}
                    ${selectedUnit === "metric" ? "°C" : "°F"}
                </p>
            </div>
        `;
    }
    document.getElementById("forecastContainer").innerHTML = forecastCards;
}
function changeUnit(unit) {
    selectedUnit = unit;
    const currentCity =
        document.getElementById("cityName").innerText;
    if (currentCity !== "") {
        getWeather(currentCity);
    }
}
function getLocationWeather() {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const locationUrl =
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${selectedUnit}`;
        const response = await fetch(locationUrl);
        const weatherData = await response.json();
        displayWeather(weatherData);
        getForecast(weatherData.name);
    });
}
function showError(message) {
    document.getElementById("errorMessage").innerText = message;
}
function clearError() {
    document.getElementById("errorMessage").innerText = "";
}