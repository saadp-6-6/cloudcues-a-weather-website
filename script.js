weathericon = document.querySelector(".weathericon"),
temp = document.querySelector(".temp"),
feelslike = document.querySelector(".feelslike"),
description = document.querySelector(".description"),
date = document.querySelector(".date"),
city = document.querySelector(".city"),
forecast = document.querySelector(".forecast");

const Weather_API_endpoint = `https://api.weatherapi.com/v1/current.json?key=f8ba4df94a03469a93232654250401&q=`;
const Weather_data_endpoint = `https://api.weatherapi.com/v1/forecast.json?key=f8ba4df94a03469a93232654250401&days=7&q=`;
const UNSPLASH_API_KEY = "GNFKVvxPpk70nH_7QIyWPpV0C4bymj96YNPM6LI5uj4";

function findUserLocation() {
forecast.innerHTML = ""; // Clear forecast
fetch(Weather_API_endpoint + userLocation.value)
    .then((response) => response.json())
    .then((data) => {
        city.innerHTML = `${data.location.name}, ${data.location.country}`;
        weathericon.style.backgroundImage = `url(${data.current.condition.icon})`;
        temp.innerHTML = tempconverter(data.current.temp_c);
        feelslike.innerHTML = `Feels like ${tempconverter(data.current.feelslike_c)}`;
        description.innerHTML = `${data.current.condition.text}`;
        date.innerHTML = new Date(data.location.localtime).toLocaleString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
        HValue.innerHTML = `${data.current.humidity}<span>%</span>`;
        WValue.innerHTML = `${(data.current.wind_kph / 3.6).toFixed(1)}<span>m/s</span>`;
        CValue.innerHTML = `${data.current.cloud}<span>%</span>`;
        UValue.innerHTML = data.current.uv;
        PValue.innerHTML = `${data.current.pressure_mb}<span>hPa</span>`;
        fetch(Weather_data_endpoint + userLocation.value)
            .then((response) => response.json())
            .then((forecastData) => {
                forecastData.forecast.forecastday.forEach((weather) => {
                    let div = document.createElement("div");
                    div.innerHTML = `<strong>${new Date(weather.date).toLocaleDateString()}</strong>
                        <img src="${weather.day.condition.icon}" alt="Weather Icon">
                        <p class="forecast-desc">${weather.day.condition.text}</p>`;
                    forecast.appendChild(div);
                });
            });
        fetchCityImage(userLocation.value);
    });
}

function fetchCityImage(cityName) {
const apiUrl = `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${UNSPLASH_API_KEY}&per_page=1`;
fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        if (data.results.length > 0) {
            const imageUrl = data.results[0].urls.regular;
            const weatherInput = document.querySelector(".weather-input");
            weatherInput.style.backgroundImage = `url(${imageUrl})`;
            weatherInput.style.backgroundSize = "cover";
            weatherInput.style.backgroundPosition = "center";
            weatherInput.style.filter = "brightness(0.9) contrast(1.2)"; // Adjust visibility here
        } else {
            console.log("No city image found.");
        }
    })
    .catch((err) => console.error("Error fetching city image:", err));
}

function tempconverter(temp) {
let tempValue = Math.round(temp);
return converter.value === "°C"
    ? `${tempValue}<span>°C</span>`
    : `${Math.round((tempValue * 9) / 5 + 32)}<span>°F</span>`;
}

document.querySelector(".fa-search").addEventListener("click", findUserLocation);
converter.addEventListener("change", findUserLocation);
