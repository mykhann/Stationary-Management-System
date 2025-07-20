import React, { useState, useEffect } from "react";
import { BarChart2, Users, ShoppingCart, Box, Menu } from "lucide-react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import DashboardSideBar from "./DashboardSideBar";
import { useSelector } from "react-redux";
import axios from "axios";
import BASE_URL from "../../apiConfig";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-md rounded-2xl ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [descriptiveInsights, setDescriptiveInsights] = useState([]);
  const [weeklyChartData, setWeeklyChartData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f655",
        tension: 0.4,
        fill: true,
      },
    ],
  });
  const weeklyChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResp, itemsResp, descriptiveResp] = await Promise.all([
          axios.get(`${BASE_URL}/api/v1/order/get`, { withCredentials: true }),
          axios.get(`${BASE_URL}/api/v1/item/get`, { withCredentials: true }),
          axios.get(`${BASE_URL}/api/v1/analytics/descriptive`, {
            withCredentials: true,
          }),
        ]);

        const ordersArr = Array.isArray(ordersResp.data.orders)
          ? ordersResp.data.orders
          : [];
        const itemsArr = Array.isArray(itemsResp.data.items)
          ? itemsResp.data.items
          : [];
        const descriptiveRaw = descriptiveResp.data;

        const flattenedDescriptive = Object.entries(
          descriptiveRaw || {}
        ).flatMap(([category, arr]) =>
          arr.map((entry) => ({
            ...entry,
            category,
          }))
        );

        // Align to Monday local time (Mon=0 … Sun=6)
        const today = new Date();
        const day = today.getDay(); // Sun=0, Mon=1, … Sat=6
        // if Sunday (0) you want to go back 6 days, otherwise go back day-1
        const diffToMonday = day === 0 ? 6 : day - 1;

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const ordersThisWeek = ordersArr.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startOfWeek && orderDate <= endOfWeek;
        });

        const dailyRevenue = [0, 0, 0, 0, 0, 0, 0];
        ordersThisWeek.forEach((order) => {
          const day = new Date(order.createdAt).getDay(); // 0 = Sun
          const index = day === 0 ? 6 : day - 1; // Convert to Mon=0 to Sun=6
          dailyRevenue[index] += order.totalAmount || 0;
        });

        setOrders(ordersArr);
        setItems(itemsArr);
        setDescriptiveInsights(flattenedDescriptive);
        setOrderCount(ordersThisWeek.length);
        setCustomerCount(new Set(ordersThisWeek.map((o) => o.user)).size);
        setLowStockCount(itemsArr.filter((i) => i.stock < 10).length);
        setWeeklyRevenue(dailyRevenue.reduce((sum, val) => sum + val, 0));
        setWeeklyChartData({
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Revenue",
              data: dailyRevenue,
              borderColor: "#3b82f6",
              backgroundColor: "#3b82f655",
              tension: 0.4,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={`fixed z-30 inset-0 bg-black bg-opacity-50 transition-opacity md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        className={`fixed z-40 md:relative transform top-0 left-0 h-full transition-transform duration-300 w-64 bg-black text-white md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSideBar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 p-6 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-2xl font-semibold">Admin Panel</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 text-white p-2 rounded-full">A</div>
            <span>{user?.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm text-gray-500">Weekly Revenue</h4>
                  <p className="text-2xl font-bold">${weeklyRevenue}</p>
                </div>
                <BarChart2 className="text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm text-gray-500">Orders This Week</h4>
                  <p className="text-2xl font-bold">{orderCount}</p>
                </div>
                <ShoppingCart className="text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm text-gray-500">New Customers</h4>
                  <p className="text-2xl font-bold">{customerCount}</p>
                </div>
                <Users className="text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm text-gray-500">Low Stock Items</h4>
                  <p className="text-2xl font-bold">{lowStockCount}</p>
                </div>
                <Box className="text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="md:col-span-2">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold ">
                  Weekly Sales Analytics
                </h4>
              </div>
              <Line data={weeklyChartData} options={weeklyChartOptions} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-blue-600 to-purple-600 text-white">
            <CardContent>
              <h4 className="text-lg font-semibold mb-4">
                Descriptive Analytics
              </h4>
              {descriptiveInsights.length === 0 ? (
                <p>Loading insights…</p>
              ) : (
                Object.values(
                  descriptiveInsights
                    .slice()
                    .reverse()
                    .reduce((acc, entry) => {
                      if (!acc[entry.category]) {
                        acc[entry.category] = entry;
                      }
                      return acc;
                    }, {})
                ).map((entry, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between text-sm items-center">
                      <span className="font-medium capitalize">
                        {entry.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {entry.pctChange === null ? (
                          <span>–</span>
                        ) : (
                          <>
                            <span
                              className={
                                entry.pctChange >= 0
                                  ? "text-green-300"
                                  : "text-red-300"
                              }
                            >
                              {entry.pctChange > 0 ? "↑" : "↓"}
                            </span>
                            <span
                              className={
                                entry.pctChange >= 0
                                  ? "text-green-300"
                                  : "text-red-300"
                              }
                            >
                              {`${
                                entry.pctChange > 0 ? "+" : ""
                              }${entry.pctChange.toFixed(1)}%`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
