import React, { useState } from "react";
import DashboardSideBar from "../components/DashboardSideBar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar always visible on desktop */}
      <div className={`bg-black text-white w-64 ${sidebarOpen ? "block" : "hidden"} md:block`}>
        <DashboardSideBar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
        </div>
        <Outlet /> {/* Route content goes here */}
      </main>
    </div>
  );
};

export default DashboardLayout;
