import React from "react";
import { Eye } from "lucide-react";
import DashboardSideBar from "./DashboardSideBar";

const customers = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "123-456-7890",
    registrationDate: "2024-10-05",
    orders: 12,
    totalSpend: "$320.00",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    phone: "987-654-3210",
    registrationDate: "2023-04-11",
    orders: 7,
    totalSpend: "$210.00",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "555-123-4567",
    registrationDate: "2022-12-30",
    orders: 5,
    totalSpend: "$130.00",
  },
];

const CustomerManagement = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <DashboardSideBar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">Customer Management</h2>

        <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Registered</th>
                <th className="p-4 text-left">Orders</th>
                <th className="p-4 text-left">Total Spend</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{customer.name}</td>
                  <td className="p-4">{customer.email}</td>
                  <td className="p-4">{customer.phone}</td>
                  <td className="p-4">{customer.registrationDate}</td>
                  <td className="p-4">{customer.orders}</td>
                  <td className="p-4">{customer.totalSpend}</td>
                  <td className="p-4">
                    <button className="flex items-center text-blue-600 hover:underline">
                      <Eye className="w-4 h-4 mr-1" /> View
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

export default CustomerManagement;
