class WeatherApp {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.form = document.querySelector("form");
        this.search = document.querySelector("#search");
        this.recentSearches = document.querySelector("aside ul");
        this.locationName = document.querySelector("#locationName");

        this.temperature = document.querySelector("#temperature");
        this.weather = document.querySelector("#weather");
        this.humidity = document.querySelector("#humidity");
        this.feelsLike = document.querySelector("#feels-like");
        this.windSpeed = document.querySelector('#wind');

        this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }



    // static func checks the entered zip using regex expression
    // returns boolean value
    static isZipValid(zip) {
        return /^\d{5}(-\d{4})?$/.test(zip);
    }



    // static func for current date and time
    static displayTime() {
        const dateTime = new Date();
        const dateTimeEl = document.getElementById("time");
        dateTimeEl.textContent = `${dateTime}`; //updates element with id 'time'
    }



    handleFormSubmit(event) {
        event.preventDefault();
        const search = this.searchInput.value;
        if (isZipValid(search)) {
            this.getWeather(search, 'zip');
        } else {
            this.getWeather(search, 'city');
        }
        this.add2History(search);
        this.displayTime();
    }


    getWeather(searchTerm, searchType) {
        let currentWeatherPath, forecastPath;
        if (searchType === 'zip') {
            currentWeatherPath = `https://api.openweathermap.org/data/2.5/weather?zip=${searchTerm}&appid=${apiKey}&units=imperial`;
            forecastPath = `https://api.openweathermap.org/data/2.5/forecast?zip=${searchTerm}&appid=${apiKey}&units=imperial`;
        } else {
            currentWeatherPath = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}&units=imperial`;
            forecastPath = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${apiKey}&units=imperial`;
        }

        fetch()
    }
};
    

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
