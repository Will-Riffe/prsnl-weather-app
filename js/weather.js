class WeatherApp {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.form = document.querySelector("form");
        this.searchInput = document.querySelector("#search");
        this.recentSearches = document.querySelector("aside ul");
        this.locationName = document.querySelector("#locationName");


        this.temperature = document.querySelector("#temperature");
        this.weather = document.querySelector("#weather");
        this.humidity = document.querySelector("#humidity");
        this.feelsLike = document.querySelector("#feels-like");
        this.windSpeed = document.querySelector("#wind");

        this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }

    static isZipValid(zip) {
        return /^\d{5}(-\d{4})?$/.test(zip);
    }

    static displayTime() {
        const dateTime = new Date();
        const dateTimeEl = document.getElementById("time");
        if (dateTimeEl) {
            dateTimeEl.textContent = dateTime.toString();
        } else {
            console.error("Element with ID 'time' not found.");
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const search = this.searchInput.value;
        if (WeatherApp.isZipValid(search)) {
            this.getWeather(search, 'zip');
        } else {
            this.getWeather(search, 'city');
        }
        this.saveSearch(search);
        WeatherApp.displayTime();
    }


    getForecast(cityName) {
        const forecastPath = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this.apiKey}&units=imperial`;

        fetch(forecastPath)
            .then((res) => res.json())
            .then((json) => this.populateFiveDayForecast(json.list))
    }

    getWeather(searchTerm, searchType) {
        let currentWeatherPath, forecastPath;
        if (searchType === 'zip') {
            currentWeatherPath = `https://api.openweathermap.org/data/2.5/weather?zip=${searchTerm}&appid=${this.apiKey}&units=imperial`; // Updated apiKey reference
            forecastPath = `https://api.openweathermap.org/data/2.5/forecast?zip=${searchTerm}&appid=${this.apiKey}&units=imperial`; // Updated apiKey reference
        } else {
            currentWeatherPath = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${this.apiKey}&units=imperial`; // Updated apiKey reference
            forecastPath = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${this.apiKey}&units=imperial`; // Updated apiKey reference
        }

        fetch(currentWeatherPath)
            .then((res) => res.json())
            .then((json) => {
                this.updateCurrentWeatherUI(json);
                this.getForecast(json.name);
            })
            .catch((err) => console.log(err.message));
    }

    updateCurrentWeatherUI(json) {
        if (currentWeather) {
            this.weather.innerHTML = json.weather[0].description;
            this.temperature.innerHTML = `${json.main.temp} &deg;F`;
            this.feelsLike.innerHTML = `${json.main.feels_like} &deg;F`;
            this.humidity.innerHTML = `${json.main.humidity}%`;
        } else {
            console.log("No weather data available.");
        }

    }

    populateFiveDayForecast(forecastData) {
        const forecastArticles = document.querySelectorAll(".large-2.cell.card");
        const days = ["today", "tomorrow", "twoDays", "threeDays", "fourDays"];

        for (let i = 0; i < forecastArticles.length; i++) {
            const forecast = forecastData[i * 8];
            const article = forecastArticles[i];
            const date = new Date(forecast.dt_txt);
            const day = days[i];

            const header = article.querySelector("header h5");
            const tempLi = article.querySelector("ul li:nth-child(1)");
            const windLi = article.querySelector("ul li:nth-child(2)");
            const humidityLi = article.querySelector("ul li:nth-child(3)");

            header.textContent = day.charAt(0).toUpperCase() + day.slice(1); // Capitalize the day
            tempLi.textContent = `Temp: ${forecast.main.temp} °F`;
            windLi.textContent = `Wind: ${forecast.wind.speed} mph`;
            humidityLi.textContent = `Humidity: ${forecast.main.humidity}%`;
        }
    }


    saveSearch(cityName) {
        WeatherApp.addToSearchHistory(cityName);
    }

    static addToSearchHistory(searchTerm) {
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searchHistory.unshift(searchTerm);
        searchHistory = searchHistory.slice(0, 10);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        WeatherApp.displaySearchHistory(); // Call the static method using the class name
    }

    static displaySearchHistory() {
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        let searchHistoryEl = document.getElementById("search-history");
        searchHistoryEl.innerHTML = "";

        searchHistory.forEach((searchTerm) => {
            const li = document.createElement("li");
            li.textContent = searchTerm;
            searchHistoryEl.appendChild(li);
        });
    }

}

const apiKey = "ed5b70ee3a26a414b68275baca4b2daa";
const weatherApp = new WeatherApp(apiKey);
