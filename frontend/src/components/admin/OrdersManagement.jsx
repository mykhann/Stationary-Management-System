import React from "react";
import DashboardSideBar from "./DashboardSideBar";
import { Eye } from "lucide-react";

const orders = [
  {
    id: "ORD001",
    customer: "Jane Doe",
    date: "2024-06-01",
    items: 3,
    total: "$45.00",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD002",
    customer: "John Smith",
    date: "2024-06-03",
    items: 1,
    total: "$12.00",
    paymentMethod: "PayPal",
  },
  {
    id: "ORD003",
    customer: "Emma Wilson",
    date: "2024-06-04",
    items: 5,
    total: "$75.00",
    paymentMethod: "Cash on Delivery",
  },
];

const OrdersManagement = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <DashboardSideBar />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">Orders Management</h2>

        <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Payment</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.customer}</td>
                  <td className="p-4">{order.date}</td>
                  <td className="p-4">{order.items}</td>
                  <td className="p-4">{order.total}</td>
                  <td className="p-4">{order.paymentMethod}</td>
                  <td className="p-4">
                    <button className="flex items-center text-blue-600 hover:underline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default OrdersManagement;
