import { useEffect, useState } from "react";

interface WeatherForecast {
  location: string;
  temp: number;
  humidity: number;
  description: string;
  icon: string;
}

interface CropAdvice {
  soilType: string;
  recommendedCrops: string[];
}

interface WeatherData {
  weatherForecast: WeatherForecast;
  cropAdvice: CropAdvice;
}

type Status = "idle" | "loading" | "success" | "error";

const WeatherCard = ({ data }: { data: WeatherForecast }) => {
  const { location, temp, humidity, description, icon } = data;

  const getWeatherEmoji = (weatherIcon: string) => {
    switch (weatherIcon.toLowerCase()) {
      case "sunny":
        return "☀️";
      case "cloudy":
        return "☁️";
      case "rain":
        return "🌧️";
      case "storm":
        return "⛈️";
      default:
        return "❓";
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg transition-all duration-500 hover:shadow-xl">
      <div className="flex items-center justify-center w-full mb-4">
        <span className="text-6xl">{getWeatherEmoji(icon)}</span>
      </div>
      <h2 className="text-5xl font-extrabold text-gray-800 leading-none">{temp}°C</h2>
      <p className="text-xl font-light text-gray-600 mt-2">{location}</p>
      <div className="mt-6 w-full text-center border-t border-gray-300 pt-4">
        <p className="text-lg font-semibold text-gray-700">{description}</p>
        <p className="mt-1 text-md text-gray-500">💧 Humidity: {humidity}%</p>
      </div>
    </div>
  );
};

const CropAdviceCard = ({ data }: { data: CropAdvice }) => (
  <div className="p-8 bg-white rounded-3xl shadow-lg transition-all duration-500 hover:shadow-xl">
    <div className="flex items-center space-x-4 mb-4">
      <span className="text-4xl">🌱</span>
      <h2 className="text-3xl font-bold text-gray-800">Crop Advice</h2>
    </div>
    <div className="space-y-4 text-gray-700">
      <p className="text-lg">
        <span className="font-semibold">Soil Type:</span> {data.soilType}
      </p>
      <div>
        <p className="text-lg font-semibold mb-2">Recommended Crops:</p>
        <ul className="list-disc list-inside space-y-1">
          {data.recommendedCrops.map((crop, index) => (
            <li key={index}>{crop}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const WeatherPage = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async (lat?: number, lon?: number) => {
      setStatus("loading");
      try {
        const response = await fetch("http://localhost:5000/api/weather-prediction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lon }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch weather data.");
        }

        const data: WeatherData = await response.json();
        setData(data);
        setStatus("success");
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "An error occurred.");
        setStatus("error");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        () => fetchWeatherData() // fallback if location not allowed
      );
    } else {
      fetchWeatherData();
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-200 text-gray-800">
        <div className="text-center p-8">
          <div className="animate-pulse h-16 w-16 text-6xl mx-auto">☁️</div>
          <p className="mt-4 text-gray-600">Loading forecast...</p>
        </div>
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-200 text-gray-800">
        <div className="text-center p-8">
          <span className="text-6xl animate-bounce">⚠️</span>
          <h2 className="mt-4 text-xl font-bold text-red-500">Failed to load data.</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-200 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl mx-auto space-y-12">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-800">
            Weather prediction
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Sun, clouds, or rain?
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <WeatherCard data={data.weatherForecast} />
          <CropAdviceCard data={data.cropAdvice} />
        </main>
      </div>
    </div>
  );
};

export default WeatherPage;
