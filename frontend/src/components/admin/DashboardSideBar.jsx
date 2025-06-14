import React from "react";
import { Link } from "react-router-dom";

const DashboardSideBar = ({ closeSidebar }) => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Products Management", path: "/dashboard/product-management" },
    { name: "Customer Management", path: "/dashboard/customer-management" },
    { name: "Orders", path: "/dashboard/order-management" },
    { name: "Analytics", path: "/dashboard/analytics" },
    { name: "Predictive Insights", path: "/dashboard/predictive-insights" },

    { name: "Re-Orders", path: "/dashboard/re-orders" },
  ];

  return (
    <aside className="min-h-screen overflow-y-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">StationeryPro</h1>
        <button onClick={closeSidebar} className="md:hidden text-white">
          ✕
        </button>
      </div>
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={closeSidebar}
            className="block hover:bg-gray-800 p-2 rounded text-white"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSideBar;
