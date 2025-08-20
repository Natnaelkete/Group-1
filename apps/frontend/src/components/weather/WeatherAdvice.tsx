import React, { useState } from 'react';

interface WeatherData {
  name: string;
  weather: Array<{
    main: string;
    description: string;
  }>;
  main: {
    temp: number;
  };
}

interface CropAdvice {
  weatherForecast: string;
  soilType: string;
  suggestedCrops: string;
  potentialExtremeEvents?: string; 
}
const weatherIcons: { [key: string]: string } = {
  'clear': '☀️',
  'clouds': '☁️',
  'rain': '🌧️',
  'snow': '❄️',
  'thunderstorm': '⛈️',
  'wind': '🌬️',
  'mist': '🌫️',
  'smoke': '💨',
  'haze': '💨',
  'dust': '💨',
  'fog': '🌫️',
  'sand': '🌪️',
  'ash': '🌋',
  'squall': '🌪️',
  'tornado': '🌪️',
  'unknown': '❓',
};
const WeatherAdvice = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [cropAdvice, setCropAdvice] = useState<CropAdvice | null>(null);
  const fetchWeatherAdvice = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);
    setCropAdvice(null);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        const response = await fetch('http://localhost:5000/api/weather-prediction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lat: latitude, lon: longitude }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to get advice from server.');
        }

        const data = await response.json();
        setWeatherData(data.weatherForecast);
        setCropAdvice(data.cropAdvice);

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching advice.");
      } finally {
        setLoading(false);
      }
    }, (err) => {
      setLoading(false);
      console.error("Geolocation error:", err);
      setError("Unable to retrieve your location. Please ensure location services are enabled.");
    });
  };
  const getWeatherIcon = (weatherMain: string): string => {
    const iconKey = weatherMain.toLowerCase();
    if (weatherIcons.hasOwnProperty(iconKey)) {
      return weatherIcons[iconKey];
    }
    return weatherIcons.unknown;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-center text-green-700 mb-2">
          Agricultural Climate Advisor
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Get personalized weather forecasts and crop advice for your farm.
        </p>

        <div className="flex justify-center mb-8">
          <button
            onClick={fetchWeatherAdvice}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            )}
            <span>{loading ? 'Fetching Advice...' : 'Get Advice for My Location'}</span>
          </button>
        </div>

        {/* Conditional rendering for error and loading states */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-inner text-center">
            <p>{error}</p>
          </div>
        )}

        {/* Display weather data and crop advice once available */}
        {weatherData && (
          <div className="space-y-8 mt-8">
            <div className="bg-green-100 p-6 rounded-lg shadow-md border border-green-200">
              <h2 className="flex items-center text-2xl font-bold text-green-800 mb-4 space-x-2">
                <span className="text-3xl">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-700">
                    <path d="M18.88 12.87c.18-1.5-.78-2.92-2.2-3.6-.97-.47-1.88-1.42-2.3-2.5-.54-1.38-1.78-2.27-3.15-2.27-2.12 0-3.88 1.76-3.88 3.88 0 1.25.6 2.4 1.57 3.1-.9.7-1.42 1.8-1.42 3.02 0 2.12 1.76 3.88 3.88 3.88h7.22c1.78 0 3.23-1.45 3.23-3.23.01-1.38-.88-2.5-2.27-3.15z" />
                  </svg>
                </span>
                <span>Current Weather in {weatherData.name}</span>
              </h2>
              <div className="flex items-center justify-between text-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-4xl">{getWeatherIcon(weatherData.weather[0].main)}</span>
                  <span className="capitalize">{weatherData.weather[0].description}</span>
                </div>
                <div className="flex items-center space-x-2 font-semibold">
                  <span className="text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                      <path d="M8 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H8zm0 2h8v12H8V4zm4 10a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  </span>
                  <span>{weatherData.main.temp}°C</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="flex items-center text-2xl font-bold text-gray-700 mb-4 space-x-2">
                <span className="text-3xl">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-600">
                    <path d="M17.5 12.5c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM17.5 21.5c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-7.92-9.92l-2.12-2.12c-2.34 2.34-2.34 6.14 0 8.48l2.12-2.12c-1.17-1.17-1.17-3.07 0-4.24zM10.08 12.08c1.17-1.17 1.17-3.07 0-4.24l-2.12-2.12c-2.34 2.34-2.34 6.14 0 8.48l2.12-2.12z" />
                  </svg>
                </span>
                <span>Predicted Advice</span>
              </h2>
              {cropAdvice && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Weather Forecast:</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">{cropAdvice.weatherForecast}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Predicted Soil Type:</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">{cropAdvice.soilType}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Suggested Crops:</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">{cropAdvice.suggestedCrops}</p>
                  </div>
                  {cropAdvice.potentialExtremeEvents && (
                    <div>
                      <h3 className="text-xl font-semibold text-red-600">Potential Extreme Events:</h3>
                      <p className="mt-2 text-red-500 leading-relaxed">{cropAdvice.potentialExtremeEvents}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherAdvice;
