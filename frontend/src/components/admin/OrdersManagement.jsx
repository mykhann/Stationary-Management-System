import React, { useEffect, useState } from "react";
import { Menu, MoreVertical } from "lucide-react";
import DashboardSideBar from "./DashboardSideBar";
import axios from "axios";
import BASE_URL from "../../apiConfig";

const OrdersManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [orders, setOrders] = useState([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/api/v1/order/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      const response = await axios.get(`${BASE_URL}/api/v1/order/get`, {
        withCredentials: true,
      });
      setOrders(response.data.orders);
      setDropdownOpen(null);
    } catch (error) {
      console.error("Failed to update status:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
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
    fetchOrders();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB") + " " + date.toLocaleTimeString();
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Cancelled":
        return "bg-red-100 text-red-600";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-600";
      case "Delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:block w-64 bg-gray-900 text-white">
        <DashboardSideBar closeSidebar={closeSidebar} />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-gray-900 text-white">
            <DashboardSideBar closeSidebar={closeSidebar} />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={closeSidebar}
          />
        </div>
      )}

      <div className="flex-1 w-full md:ml-64">
        <div className="flex items-center justify-between p-4 md:hidden bg-white shadow">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
          <div className="w-6" />
        </div>

        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6 hidden md:block">
            Orders Management
          </h2>

          <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Address</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Items</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Payment</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.shippingAddress.fullName}</td>
                    <td className="p-4">{order.shippingAddress.address}</td>
                    <td className="p-4">{formatDate(order.createdAt)}</td>
                    <td className="p-4">{order.orderItems.length} items</td>
                    <td className="p-4">Rs. {order.totalAmount}</td>
                    <td className="p-4">{order.paymentMethod}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.orderStatus)}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 relative">
                      <button
                        onClick={() =>
                          setDropdownOpen(
                            dropdownOpen === order._id ? null : order._id
                          )
                        }
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {dropdownOpen === order._id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                          <button
                            onClick={() =>
                              handleStatusChange(order._id, "Cancelled")
                            }
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(order._id, "Processing")
                            }
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Process
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(order._id, "Shipped")
                            }
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Shipped
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(order._id, "Delivered")
                            }
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Delivered
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersManagement;
