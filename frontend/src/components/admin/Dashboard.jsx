import React, { useState } from "react";
import { BarChart2, Users, ShoppingCart, Box, Menu } from "lucide-react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import DashboardSideBar from "./DashboardSideBar";
import { useSelector } from "react-redux";

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
  const {user}=useSelector((store)=>store.auth)

  const weeklyChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: [4000, 5000, 4800, 6000, 5500, 6300, 7000],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f655",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 p-6 w-full">
        {/* Top Bar */}
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

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm text-gray-500">Weekly Revenue</h4>
                  <p className="text-2xl font-bold">$24,563</p>
                  <p className="text-green-500 text-sm">+8.2% from last week</p>
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
                  <p className="text-2xl font-bold">385</p>
                  <p className="text-green-500 text-sm">+5.3% from last week</p>
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
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-red-500 text-sm">-2.1% from last week</p>
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
                  <p className="text-2xl font-bold">17</p>
                  <p className="text-red-500 text-sm">+3 more than last week</p>
                </div>
                <Box className="text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Predictive Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="md:col-span-2">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Weekly Sales Analytics</h4>
                <div className="space-x-2">
                  <button className="text-sm font-medium text-blue-600">
                    Weekly
                  </button>
                  <button className="text-sm text-gray-400">Monthly</button>
                  <button className="text-sm text-gray-400">Yearly</button>
                </div>
              </div>
              <Line data={weeklyChartData} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-blue-600 to-purple-600 text-white">
            <CardContent>
              <h4 className="text-lg font-semibold mb-4">Predictive Analytics</h4>
              {[
                { item: "Notebooks & Journals", change: "+12% ↑" },
                { item: "Art Supplies", change: "+8% ↑" },
                { item: "Office Paper", change: "-3% ↓" },
                { item: "Writing Instruments", change: "+5% ↑" },
                { item: "Desk Accessories", change: "+2% ↑" },
              ].map((data) => (
                <div key={data.item} className="flex justify-between mb-2">
                  <span>{data.item}</span>
                  <span>{data.change}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
