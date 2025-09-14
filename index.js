const cityNameElem = document.querySelector(".weather_city");
const dateTimeElem = document.querySelector(".weather_date_time");
const forecastElem = document.querySelector(".weather_forecast");
const iconElem = document.querySelector(".weather_icon");
const tempElem = document.querySelector(".weather_temperature");
const minTempElem = document.querySelector(".weather_min");
const maxTempElem = document.querySelector(".weather_max");
const feelsLikeElem = document.querySelector(".weather_feelsLike");
const humidityElem = document.querySelector(".weather_humidity");
const windElem = document.querySelector(".weather_wind");
const pressureElem = document.querySelector(".weather_pressure");
const citySearchForm = document.querySelector(".weather_search");
const cityInput = document.querySelector(".city_name");

const apiKey = "d0cf4651f901611fe0483d224b46e158";

const getCountryName = (code) =>
  new Intl.DisplayNames(["en"], { type: "region" }).of(code);

const getFormattedDateTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const updateWeatherUI = (data) => {
  const { main, name, weather, wind, sys, dt } = data;

  cityNameElem.textContent = `${name}, ${getCountryName(sys.country)}`;
  dateTimeElem.textContent = getFormattedDateTime(dt);
  forecastElem.textContent = weather[0].main;

  iconElem.innerHTML = `
    <img 
      src="https://openweathermap.org/img/wn/${weather[0].icon}@4x.png" 
      alt="${weather[0].description}" 
      width="100" height="100" loading="lazy" decoding="async" 
    />
  `;

  tempElem.innerHTML = `${main.temp.toFixed(1)}&#176;C`;
  minTempElem.innerHTML = `Min: ${main.temp_min.toFixed(1)}&#176;C`;
  maxTempElem.innerHTML = `Max: ${main.temp_max.toFixed(1)}&#176;C`;
  feelsLikeElem.innerHTML = `${main.feels_like.toFixed(1)}&#176;C`;
  humidityElem.innerHTML = `${main.humidity}%`;
  windElem.innerHTML = `${wind.speed} m/s`;
  pressureElem.innerHTML = `${main.pressure} hPa`;
};

const fetchWeather = async (city) => {
  if (!navigator.onLine) {
    cityNameElem.textContent = "You are offline. Check your connection.";
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      cityNameElem.textContent = "City not found. Try again.";
      dateTimeElem.textContent = "";
      iconElem.innerHTML = "";
      forecastElem.textContent = "";
      tempElem.textContent = "";
      minTempElem.textContent = "";
      maxTempElem.textContent = "";
      feelsLikeElem.textContent = "--";
      humidityElem.textContent = "--";
      windElem.textContent = "--";
      pressureElem.textContent = "--";
      return;
    }

    updateWeatherUI(data);
  } catch (err) {
    cityNameElem.textContent = "Failed to fetch weather data.";
    console.error(err);
  }
};

citySearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    cityNameElem.textContent = "Please enter a city name.";
  }
  cityInput.value = "";
});

window.addEventListener("DOMContentLoaded", () => {
  fetchWeather("Pune");
});
