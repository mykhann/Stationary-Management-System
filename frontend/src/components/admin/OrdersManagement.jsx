import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardSideBar from "./DashboardSideBar";
import OrdersTable from "./OrdersTable";
import BASE_URL from "../../apiConfig";

const OrdersManagement = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/v1/order/get`,
        { withCredentials: true }
      );
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/v1/order/${orderId}/delete`,
        { withCredentials: true }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(
        `${BASE_URL}/api/v1/order/${orderId}/status`,
        { status },
        { withCredentials: true }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <div className="hidden md:block w-64 bg-gray-900 text-white">
        <DashboardSideBar closeSidebar={closeSidebar} />
      </div>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64 bg-gray-900 text-white">
            <DashboardSideBar closeSidebar={closeSidebar} />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={closeSidebar}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-white shadow md:hidden">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold">Orders</h2>
          <div className="w-6" />
        </div>

        {/* Page Title (Desktop) */}
        <div className="hidden md:flex items-center justify-between p-6 bg-white shadow">
          <h1 className="text-2xl font-semibold">Orders Management</h1>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <OrdersTable
            orders={orders}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </main>
      </div>
    </div>
  );
};

export default OrdersManagement;
