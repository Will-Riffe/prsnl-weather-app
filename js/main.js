// API key to plug in shorthand
const apiKey = "88f48de05943207b41e879457d4a80bb";

const form = document.querySelector("form");
const searchInput = document.querySelector("#search");
const recentSearches = document.querySelector("aside ul");

// Event listener for the search button
form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const cityName = searchInput.value;
    
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        const { lat, lon } = data[0];
        return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}`);
      })
      .then(response => response.json())
      .then(data => {
          // JavaScript for updating the current weather
          const currentWeather = data.current;
          const locationName = document.querySelector("#locationName");
          const weatherElem = document.querySelector("#weather");
          const temperatureElem = document.querySelector("#temperature");
          const feelsLikeElem = document.querySelector("#feels-like");
          const humidityElem = document.querySelector("#humidity");
          
          locationName.textContent = cityName;
          if (currentWeather) {
              weatherElem.textContent = currentWeather.weather[0].description;
              temperatureElem.textContent = currentWeather.temp;
              feelsLikeElem.textContent = currentWeather.feels_like;
              humidityElem.textContent = currentWeather.humidity;
            } else {
              console.log("No weather data available.");
            }
  
          // populate five-day forecast
          const fiveDayForecast = data.daily;
          const today = new Date();
          for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = date.toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'});
            const articleElem = document.querySelector(`#${dateString.replace(/ /g, '')}`);
            articleElem.querySelector('h5').textContent = dateString;
  
            articleElem.querySelector('li:nth-child(1)').textContent = `Temp: ${fiveDayForecast[i].temp.day} °F`;
            articleElem.querySelector('li:nth-child(2)').textContent = `Wind: ${fiveDayForecast[i].wind_speed} MPH`;
            articleElem.querySelector('li:nth-child(3)').textContent = `Humidity: ${fiveDayForecast[i].humidity} %`;
          }
  
        })
      .catch(error => console.error(error));
  });
  