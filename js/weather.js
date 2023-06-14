class WeatherApp {
    constructor(apiKey) {

        // here we initialize our properties
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

        // initializing the event listener
        this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }

    // used to confirm valid zip agains regex
    static isZipValid(zip) {
        return /^\d{5}(-\d{4})?$/.test(zip);
    }

    // gets the current date/time
    static displayTime() {
        const dateTime = new Date();
        const dateTimeEl = document.getElementById("time");
        if (dateTimeEl) {
            dateTimeEl.textContent = dateTime.toString();
        } else {
            console.error("Element with ID 'time' not found.");
        }
    }

    // basically, the search functionality
    handleFormSubmit(event) {
        event.preventDefault();
        const search = this.searchInput.value;
        if (WeatherApp.isZipValid(search)) {
            this.getWeather(search, 'zip');
        } else {
            this.getWeather(search, 'city');
        }
        this.saveSearch(search); //saves our search
        WeatherApp.displayTime();
    }

    // calls the 5-day forcast info
    getForecast(cityName) {
        const forecastPath = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this.apiKey}&units=imperial`;

        fetch(forecastPath)
            .then((res) => res.json())
            .then((json) => this.populateFiveDayForecast(json.list))
    }

    // gets current weather, updates UI
    getWeather(searchTerm, searchType) {
        let currentWeatherPath;
        if (searchType === 'zip') {
            currentWeatherPath = `https://api.openweathermap.org/data/2.5/weather?zip=${searchTerm}&appid=${this.apiKey}&units=imperial`; 
        } else {
            currentWeatherPath = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${this.apiKey}&units=imperial`; 
        }

        fetch(currentWeatherPath)
            .then((res) => res.json())
            .then((json) => {
                this.updateCurrentWeatherUI(json);
                this.getForecast(json.name);
            })
            .catch((err) => console.log(err.message));
    }


    // updates our UI with current weather
    updateCurrentWeatherUI(json) {
        if (currentWeather) {
            this.weather.innerHTML = json.weather[0].description;
            this.temperature.innerHTML = `${json.main.temp} &deg;F`;
            this.feelsLike.innerHTML = `${json.main.feels_like} &deg;F`;
            this.humidity.innerHTML = `${json.main.humidity}%`;

            const iconCode = json.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
            const iconEl = document.createElement("img");
            iconEl.src = iconUrl;
            const iconLi = document.getElementById("icon"); // Assuming you have an ID "icon" for the icon element
            iconLi.innerHTML = ""; // Clear previous icon
            iconLi.appendChild(iconEl);

        } else {
            console.log("No weather data available.");
        }

    }


    // updates the 5-day forecast cards in our UI
    populateFiveDayForecast(forecastData) {
        const forecastArticles = document.querySelectorAll(".large-2.cell.card");
      
        for (let i = 0; i < forecastArticles.length; i++) {
          const forecast = forecastData[i * 8];
          const article = forecastArticles[i];
          const date = new Date(forecast.dt_txt);
      
          const header = article.querySelector("header h5");
          const tempLi = article.querySelector("ul li:nth-child(2)"); // Update this line
          const windLi = article.querySelector("ul li:nth-child(3)");
          const humidityLi = article.querySelector("ul li:nth-child(4)"); // Update this line
          const iconLi = article.querySelector("ul li:nth-child(1)");
      
          header.textContent = date.toLocaleDateString("en-US", { weekday: "long" });
          tempLi.textContent = `Temp: ${forecast.main.temp} °F`;
          windLi.textContent = `Wind: ${forecast.wind.speed} mph`;
          humidityLi.textContent = `Humidity: ${forecast.main.humidity}%`;
      
          const iconCode = forecast.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
          const iconEl = document.createElement("img");
          iconEl.src = iconUrl;
          iconLi.innerHTML = "";
          iconLi.appendChild(iconEl);
        }
      }
      
      // saves the search history (of course!)
    saveSearch(cityName) {
        WeatherApp.addToSearchHistory(cityName);
    }

    // adds the search item local storage
    static addToSearchHistory(searchTerm) {
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searchHistory.unshift(searchTerm);
        searchHistory = searchHistory.slice(0, 10);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        WeatherApp.displaySearchHistory();
    }


    // displays the search history in the UI
    static displaySearchHistory() {
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        let searchHistoryEl = document.getElementById("search-history");
        searchHistoryEl.innerHTML = "";
    
        searchHistory.forEach((searchTerm) => {
          const li = document.createElement("li");
          li.textContent = searchTerm;
          li.addEventListener("click", () => {
            const clickedSearchTerm = li.textContent;
            this.runSearch(clickedSearchTerm); // Updated this line
          });
          searchHistoryEl.appendChild(li);
        });
      }

      // runs a search when a saved item is clicked
      static runSearch(searchTerm) {
        const weatherApp = new WeatherApp(apiKey);
        weatherApp.getWeather(searchTerm, 'city');
      }
    
}

const apiKey = "ed5b70ee3a26a414b68275baca4b2daa"; 
const weatherApp = new WeatherApp(apiKey); //creates new WeatherAPP instance
WeatherApp.displaySearchHistory(); //Dispals the search history
