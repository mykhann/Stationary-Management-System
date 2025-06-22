import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Menu } from "lucide-react";
import DashboardSideBar from "./DashboardSideBar";
import BASE_URL from "../../apiConfig";

const CustomerManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const fetchCustomersFromOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/order/get`, {
          withCredentials: true,
        });
        const orders = response.data.orders || [];

        const customerMap = new Map();

        orders.forEach((order) => {
          const user = order.user;
          const shipping = order.shippingAddress;

          // Ensure both user and user._id exist
          if (!user || !user._id) return;

          const customerId = user._id;

          if (!customerMap.has(customerId)) {
            customerMap.set(customerId, {
              id: customerId,
              name: shipping?.fullName || "N/A",
              email: user.email || "N/A",
              phone: user.phone || "N/A",
              address: shipping?.address || "N/A",
              orders: 1,
              totalSpend: order.totalAmount || 0,
              registrationDate: order.createdAt || "N/A",
            });
          } else {
            const existing = customerMap.get(customerId);
            existing.orders += 1;
            existing.totalSpend += order.totalAmount || 0;
            customerMap.set(customerId, existing);
          }
        });

        setCustomers(Array.from(customerMap.values()));
      } catch (error) {
        console.error("Failed to fetch customer data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomersFromOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (Desktop & Mobile) */}
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

      {/* Main Content */}
      <div className="flex-1 w-full md:ml-64">
        <div className="flex items-center justify-between p-4 md:hidden bg-white shadow">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Customers</h2>
          <div className="w-6" />
        </div>

        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6 hidden md:block">
            Customer Management
          </h2>

          {loading ? (
            <p>Loading customers...</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Phone</th>
                    <th className="p-4 text-left">Orders</th>
                    <th className="p-4 text-left">Total Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{customer.name}</td>
                      <td className="p-4">{customer.email}</td>
                      <td className="p-4">{customer.phone}</td>
                      <td className="p-4">{customer.orders}</td>
                      <td className="p-4">
                        Rs. {customer.totalSpend.toLocaleString()}
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerManagement;
