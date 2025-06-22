import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import axios from "axios";
import DashboardSideBar from "./DashboardSideBar";
import BASE_URL from "../../apiConfig";

const PredictiveAnalytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [forecast, setForecast] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/v1/analytics/predictive`)
      .then((res) => setForecast(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = Object.entries(forecast);
  const maxForecast = Math.max(
    ...categories.map(([, [d]]) => d.forecast)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-60 bg-gray-900 text-white">
        <DashboardSideBar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-60 bg-gray-900 text-white">
            <DashboardSideBar closeSidebar={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 w-full md:ml-60">
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 md:hidden bg-white shadow">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            Predictive Sales
          </h2>
          <div className="w-6" />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 hidden md:block mb-4">
            Predictive Sales For Next Week
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <span className="text-gray-500 animate-pulse">Loading...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-600 py-16">
              No data available
            </div>
          ) : (
            <>
              {/* Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {categories.map(([cat, [d]]) => (
                  <div
                    key={cat}
                    className="bg-white p-4 rounded-lg shadow border border-gray-200"
                  >
                    <h2 className="text-sm font-semibold text-gray-500 uppercase truncate">
                      {cat}
                    </h2>
                    <div className="text-lg font-bold text-blue-600">
                      <span className="text-gray-500">Expected Sales</span> {d.forecast}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Min Est ↓ {d.lower} | Max Est ↑ {d.upper}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Comparison Chart
                </h3>
                <div className="flex items-end justify-start gap-4 px-4 overflow-x-auto pb-4">
                  {categories.map(([cat, [d]]) => {
                    const height = (d.forecast / maxForecast) * 200;
                    return (
                      <div
                        key={cat}
                        className="flex flex-col items-center w-24"
                      >
                        <div
                          className="bg-blue-500 w-full rounded-t-md"
                          style={{ height: `${height}px` }}
                          title={`Forecast: ${d.forecast}`}
                        ></div>
                        <span className="mt-1 text-xs text-gray-600 truncate capitalize">
                          {cat}
                        </span>
                        <div className="text-xs text-gray-500">{d.forecast}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
