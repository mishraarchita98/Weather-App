document.getElementById("location-form").addEventListener("submit", getWeather);

async function getWeather(e) {
  e.preventDefault();

  const city = document.getElementById("city-search").value;
  document.getElementById("city-search").value = "";

  toggleLoading(true);
  try {
    const data = await fetchWeatherData(city);
    displayWeather(data);
  } catch (error) {
    displayError();
  } finally {
    toggleLoading(false);
  }
}

function toggleLoading(isLoading) {
  document.getElementById("loading").classList.toggle("hidden", !isLoading);
  document.querySelector(".weather-side").classList.toggle("hidden", isLoading);
  document.getElementById("error").classList.add("hidden");
}

async function fetchWeatherData(city) {
  const apiKey = "f00c38e0279b7bc85480c3fe775d518c";
  const weatherResponse = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: { q: city, units: "metric", appid: apiKey },
    }
  );
  const { lat, lon } = weatherResponse.data.coord;

  const oneCallResponse = await axios.get(
    "https://api.openweathermap.org/data/2.5/onecall",
    {
      params: {
        lat,
        lon,
        exclude: "minutely,hourly,alerts",
        units: "metric",
        appid: apiKey,
      },
    }
  );

  return {
    current: oneCallResponse.data.current,
    daily: oneCallResponse.data.daily,
    location: `${weatherResponse.data.name}, ${weatherResponse.data.sys.country}`,
  };
}

function displayWeather(data) {
  const dateInfo = getDateInfo();
  document.getElementById("date-dayname").textContent = dateInfo.dayName;
  document.getElementById(
    "date-day"
  ).textContent = `${dateInfo.day} ${dateInfo.month}`;
  document.getElementById("location").textContent = data.location;
  document.getElementById(
    "weather-icon"
  ).src = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
  document.getElementById("temperature").textContent = `${Math.round(
    data.current.temp
  )}°C`;
  document.getElementById("description").textContent =
    data.current.weather[0].description.toUpperCase();
  document.getElementById("precipitation").textContent = `${
    data.daily[0].pop * 100
  }%`;
  document.getElementById("humidity").textContent = `${data.current.humidity}%`;
  document.getElementById(
    "wind"
  ).textContent = `${data.current.wind_speed} km/h`;

  document.getElementById("week-list").innerHTML = data.daily
    .slice(1, 5)
    .map((day) => {
      const dayName = new Date(day.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
      });
      return `<li><span class="day-name">${dayName}</span><span class="day-temp">${Math.round(
        day.temp.day
      )}°C</span></li>`;
    })
    .join("");
}

function displayError() {
  document.getElementById("error").classList.remove("hidden");
}

function getDateInfo() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDate = new Date();

  return {
    dayName: weekDays[currentDate.getDay()],
    day: currentDate.getDate(),
    month: months[currentDate.getMonth()],
  };
}
