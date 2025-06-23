import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import axios from "axios";
import DashboardSideBar from "./DashboardSideBar";
import BASE_URL from "../../apiConfig";

const DescriptiveAnalysis = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/v1/analytics/descriptive`)
      .then((res) => setAnalytics(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = Object.entries(analytics);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform bg-gray-900 text-white w-60 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <DashboardSideBar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 p-4 ">
        {/* Header with Hamburger on Left */}
        <div className="flex items-center justify-between mb-4 md:justify-start md:gap-4">
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Descriptive Analytics
          </h1>
        </div>

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
            {/* Cards per Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(([category, data]) => {
                const latest = data[data.length - 1];
                const previous = data.length > 1 ? data[data.length - 2] : null;
                return (
                  <div
                    key={category}
                    className="bg-white p-4 rounded-lg shadow border border-gray-200"
                  >
                    <h2 className="text-sm font-semibold text-gray-500 uppercase truncate">
                      {category}
                    </h2>
                    <div className="mt-2 text-blue-700 font-bold text-xl">
                      {latest.count}
                    </div>
                    <div className="text-xs text-gray-600">
                      Week: {latest.week}
                    </div>
                    {previous && (
                      <div className="text-sm mt-1">
                        <span className="text-gray-600">Previous:</span>{" "}
                        {previous.count} →
                        <span
                          className={
                            latest.pctChange > 0
                              ? "text-green-600"
                              : latest.pctChange < 0
                              ? "text-red-500"
                              : "text-gray-500"
                          }
                        >
                          {latest.pctChange}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Weekly Trend by Category
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(([category, values]) => {
                  const lastTwo = values.slice(-2);
                  return (
                    <div
                      key={category}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow"
                    >
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">
                        {category}
                      </h3>
                      <div className="flex gap-4 items-end justify-center h-32">
                        {lastTwo.map(({ week, count }) => (
                          <div
                            key={week}
                            className="flex flex-col items-center justify-end h-full"
                          >
                            <div
                              className="bg-blue-500 w-6 rounded-t-md"
                              style={{ height: `${count * 6}px` }}
                              title={`Week ${week}: ${count}`}
                            ></div>
                            <span className="text-xs mt-1 text-gray-500">
                              week {week.split("-W")[1]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DescriptiveAnalysis;
