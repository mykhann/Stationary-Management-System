// src/pages/CustomerManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu } from "lucide-react";
import DashboardSideBar from "./DashboardSideBar";
import BASE_URL from "../../apiConfig";

const CustomerManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/v1/order/get`,
          { withCredentials: true }
        );
        const orders = data.orders || [];
        const map = new Map();

        orders.forEach((o) => {
          const u = o.user;
          const s = o.shippingAddress;
          if (!u?._id) return;
          const id = u._id;
          if (!map.has(id)) {
            map.set(id, {
              id,
              name: s?.fullName || "N/A",
              email: u.email || "N/A",
              phone: u.phone || "N/A",
              orders: 1,
              totalSpend: o.totalAmount || 0,
            });
          } else {
            const c = map.get(id);
            c.orders += 1;
            c.totalSpend += o.totalAmount || 0;
          }
        });

        setCustomers(Array.from(map.values()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 bg-gray-900 text-white">
        <DashboardSideBar closeSidebar={closeSidebar} />
      </div>

      {/* Mobile sidebar overlay */}
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

      <div className="flex-1">
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 bg-white shadow md:hidden">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Customers</h2>
          <div className="w-6" />
        </div>

        {/* Main content */}
        <main className="p-6">
          {/* Desktop title */}
          <h2 className="hidden md:block text-2xl font-semibold mb-6">
            Customer Management
          </h2>

          {loading ? (
            <p>Loading customers...</p>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {customers.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl shadow p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{c.name}</h3>
                      <button
                        onClick={() =>
                          setExpanded((e) => ({
                            ...e,
                            [c.id]: !e[c.id],
                          }))
                        }
                        className="text-blue-600 text-sm"
                      >
                        {expanded[c.id] ? "See less" : "See more"}
                      </button>
                    </div>
                    {expanded[c.id] && (
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Email:</strong> {c.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {c.phone}
                        </p>
                        <p>
                          <strong>Orders:</strong> {c.orders}
                        </p>
                        <p>
                          <strong>Total Spend:</strong> Rs.{" "}
                          {c.totalSpend.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-2xl">
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
                    {customers.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-4">{c.name}</td>
                        <td className="p-4">{c.email}</td>
                        <td className="p-4">{c.phone}</td>
                        <td className="p-4">{c.orders}</td>
                        <td className="p-4">
                          Rs. {c.totalSpend.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerManagement;
