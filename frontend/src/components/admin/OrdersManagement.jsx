import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import DashboardSideBar from "./DashboardSideBar";
import OrdersTable from "./OrdersTable";
import axios from "axios";
import BASE_URL from "../../apiConfig";

const OrdersManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/order/get`, {
        withCredentials: true,
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/api/v1/order/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="hidden md:block w-64 bg-gray-900 text-white">
        <DashboardSideBar closeSidebar={closeSidebar} />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-gray-900 text-white">
            <DashboardSideBar closeSidebar={closeSidebar} />
          </div>
          <div className="flex-1 bg-black bg-opacity-50" onClick={closeSidebar} />
        </div>
      )}

      <div className="flex-1 w-full ">
        <div className="flex items-center justify-between p-4 md:hidden bg-white shadow">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
          <div className="w-6" />
        </div>

        <main className="p-4 sm:p-6">
          <h2 className="text-2xl font-semibold mb-4 hidden md:block">Orders Management</h2>
          <OrdersTable orders={orders} onStatusChange={handleStatusChange} />
        </main>
      </div>
    </div>
  );
};

export default OrdersManagement;
