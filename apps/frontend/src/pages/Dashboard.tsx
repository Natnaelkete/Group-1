interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  forecast: string;
}

interface CropHealthData {
  healthy: number;
  warning: number;
  critical: number;
}

interface MarketData {
  crop: string;
  price: number;
  trend: "up" | "down" | "stable";
}

// Mock data - you would replace this with actual API calls
const weatherData: WeatherData = {
  temperature: 22,
  humidity: 65,
  rainfall: 15,
  forecast: "Partly cloudy with light showers",
};

const cropHealthData: CropHealthData = {
  healthy: 78,
  warning: 15,
  critical: 7,
};

const marketData: MarketData[] = [
  { crop: "Teff", price: 1200, trend: "up" },
  { crop: "Maize", price: 800, trend: "down" },
  { crop: "Wheat", price: 950, trend: "stable" },
  { crop: "Barley", price: 700, trend: "up" },
];

const Dashboard = () => {
  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Farm Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Weather Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Weather
            </h2>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-800">
                {weatherData.temperature}°C
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">
                  Humidity: {weatherData.humidity}%
                </p>
                <p className="text-sm text-gray-600">
                  Rainfall: {weatherData.rainfall}mm
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{weatherData.forecast}</p>
          </div>

          {/* Crop Health Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Crop Health
            </h2>
            <div className="flex justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {cropHealthData.healthy}%
                </div>
                <p className="text-xs text-gray-500">Healthy</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {cropHealthData.warning}%
                </div>
                <p className="text-xs text-gray-500">Warning</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {cropHealthData.critical}%
                </div>
                <p className="text-xs text-gray-500">Critical</p>
              </div>
            </div>
          </div>

          {/* Tasks Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Pending Tasks
            </h2>
            <div className="text-3xl font-bold text-gray-800">3</div>
            <p className="text-sm text-gray-600 mt-2">
              Tasks need your attention
            </p>
          </div>

          {/* Market Prices Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Market Prices
            </h2>
            <div className="text-3xl font-bold text-gray-800">ETB 1200</div>
            <p className="text-sm text-gray-600 mt-2">
              Current avg. per quintal
            </p>
          </div>
        </div>

        {/* Charts and Detailed Data Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crop Health Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Crop Health Overview
            </h2>
            <div className="h-64 flex items-end justify-around">
              <div className="flex flex-col items-center">
                <div
                  className="w-12 bg-green-500 rounded-t-lg"
                  style={{ height: `${cropHealthData.healthy * 2.5}px` }}
                ></div>
                <span className="text-xs mt-2">Healthy</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-12 bg-yellow-500 rounded-t-lg"
                  style={{ height: `${cropHealthData.warning * 2.5}px` }}
                ></div>
                <span className="text-xs mt-2">Warning</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-12 bg-red-500 rounded-t-lg"
                  style={{ height: `${cropHealthData.critical * 2.5}px` }}
                ></div>
                <span className="text-xs mt-2">Critical</span>
              </div>
            </div>
          </div>

          {/* Market Prices Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Current Market Prices (ETB/quintal)
            </h2>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="pb-2">Crop</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{item.crop}</td>
                    <td className="py-3">{item.price}</td>
                    <td className="py-3">
                      {item.trend === "up" && (
                        <span className="text-green-500">↑ Increasing</span>
                      )}
                      {item.trend === "down" && (
                        <span className="text-red-500">↓ Decreasing</span>
                      )}
                      {item.trend === "stable" && (
                        <span className="text-gray-500">→ Stable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Weather Forecast */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              7-Day Weather Forecast
            </h2>
            <div className="flex justify-between">
              {[22, 24, 21, 20, 19, 23, 25].map((temp, index) => (
                <div key={index} className="flex flex-col items-center">
                  <p className="text-sm text-gray-600">Day {index + 1}</p>
                  <p className="text-lg font-semibold">{temp}°C</p>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-2">
                    <span className="text-green-500 text-xs">☀️</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition duration-200">
                Disease Detection
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition duration-200">
                Weather Forecast
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition duration-200">
                Crop Advice
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition duration-200">
                Market Prices
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
