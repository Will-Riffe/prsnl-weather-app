class WeatherApp {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.form = document.querySelector("form");
      this.search = document.querySelector("#search");
      this.locationName = document.querySelector("#locationName");
      this.weather = document.querySelector("#weather");
      this.temperature = document.querySelector("#temperature");
      this.feelsLike = document.querySelector("#feels-like");
      this.humidity = document.querySelector("#humidity");
      this.recentSearches = document.querySelector("aside ul");
  
      this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }
  
    handleFormSubmit(event) {
      event.preventDefault();
      const search = this.search.value;
      const searchSegments = search.split(",");
      const city = searchSegments[0].trim();
      const state = searchSegments.length > 1 ? searchSegments[1].trim() : null;
      const country = searchSegments.length > 2 ? searchSegments[2].trim() : null;
  
      this.searchWeather(city, state, country);
    }
  
    searchWeather(city, state, country) {
      this.fetchCityData(city)
        .then((data) => this.filterCityData(data, city, state, country))
        .then((cityMatch) => {
          if (cityMatch.length > 0) {
            const cityId = cityMatch[0].id;
            const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${this.apiKey}&units=imperial`;
  
            fetch(apiUrl)
              .then((response) => response.json())
              .then((data) => this.updateWeatherData(data, cityMatch[0]))
              .catch((error) => console.error(error));
          }
        });
    }
  
    fetchCityData(city) {
      return fetch("../json/cityList.json").then((response) => response.json());
    }
  
    filterCityData(data, city, state, country) {
      return data.filter((item) => {
        return item.city === city && (!item.state || item.state === state) && item.country === country;
      });
    }
  
    updateWeatherData(data, cityData) {
      const currentWeather = data.list[0];
  
      this.locationName.textContent = cityData.name;
      if (currentWeather) {
        this.weather.textContent = currentWeather.weather[0].description;
        this.temperature.textContent = currentWeather.main.temp;
        this.feelsLike.textContent = currentWeather.main.feels_like;
        this.humidity.textContent = currentWeather.main.humidity;
      } else {
        console.log("No weather data available.");
      }
  
      this.populateFiveDayForecast(data.list);
      this.saveSearch(cityData.name);
      this.displayRecentSearches();
    }
  
    populateFiveDayForecast(fiveDayForecast) {
      const today = new Date();
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
        const article = document.querySelector(`#${dateString.replace(/ /g, "")}`);
        article.querySelector("h5").textContent = dateString;
  
        article.querySelector("li:nth-child(1)").textContent = `Temp: ${fiveDayForecast[i].main.temp} °F`;
        article.querySelector("li:nth-child(2)").textContent = `Wind: ${fiveDayForecast[i].wind.speed} MPH`;
        article.querySelector("li:nth-child(3)").textContent = `Humidity: ${fiveDayForecast[i].main.humidity} %`;
      }
    }
  
    saveSearch(cityName) {
      localStorage.setItem("cityName", cityName);
    }
  
    displayRecentSearches() {
      const savedCityName = localStorage.getItem("cityName");
      if (savedCityName) {
        const li = document.createElement("li");
        li.textContent = savedCityName;
        this.recentSearches.appendChild(li);
      }
    }
  }
  
  const apiKey = "ed5b70ee3a26a414b68275baca4b2daa";
  const weatherApp = new WeatherApp(apiKey);
  