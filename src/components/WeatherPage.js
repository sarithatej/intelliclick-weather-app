import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const WeatherPage = () => {
  const { cityName } = useParams(); // Get the city name from the URL params
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Define fetchWeather inside useEffect
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=28f47e691eb8537509063cef0bf4e033
`
        );
        setWeatherData(response.data);
      } catch (error) {
        setError('Error fetching weather data.');
      }
    };

    fetchWeather();
  }, [cityName]); // Only run when cityName changes

  if (error) {
    return <div>{error}</div>;
  }

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Weather in {weatherData.name}</h1>
      <p>Temperature: {weatherData.main.temp}°C</p>
      <p>Weather: {weatherData.weather[0].description}</p>
      <p>Humidity: {weatherData.main.humidity}%</p>
      <p>Wind Speed: {weatherData.wind.speed} m/s</p>
      <p>Pressure: {weatherData.main.pressure} hPa</p>
    </div>
  );
};

export default WeatherPage;
