import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu } from "lucide-react";
import BASE_URL from "../../apiConfig";
import DashboardSideBar from "./DashboardSideBar";

const ReorderList = () => {
  const [reorders, setReorders] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchReorders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/order/reorder`, {
          withCredentials: true,
        });

        if (Array.isArray(response.data.reorder)) {
          setReorders(response.data.reorder);
        } else {
          setError("Invalid response format");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch reorders.");
      }
    };

    fetchReorders();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-gray-900 text-white">
        <DashboardSideBar closeSidebar={closeSidebar} />
      </div>

      {/* Mobile Sidebar */}
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
      <div className="flex-1 w-full ">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 md:hidden bg-white shadow">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Reorders</h2>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Reorder Management
          </h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {reorders.length === 0 && !error ? (
            <p className="text-gray-600">No reorders found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {reorders.map((reorder) => (
                <div
                  key={reorder._id}
                  className="bg-white rounded-2xl shadow-md p-6 border border-gray-200"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Reorder ID: {reorder._id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created on:{" "}
                      {new Date(reorder.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Supplier Info */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Supplier Info
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>
                          <strong>Name:</strong>{" "}
                          {reorder.supplierId?.name || "N/A"}
                        </li>
                        <li>
                          <strong>Contact:</strong>{" "}
                          {reorder.supplierId?.contactPerson || "N/A"}
                        </li>
                        <li>
                          <strong>Phone:</strong>{" "}
                          {reorder.supplierId?.phone || "N/A"}
                        </li>
                        <li>
                          <strong>Address:</strong>{" "}
                          {reorder.supplierId?.address || "N/A"}
                        </li>
                      </ul>
                    </div>

                    {/* Item Info */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Item Info
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>
                          <strong>Item ID:</strong> {reorder.itemId}
                        </li>
                        <li>
                          <strong>Stock Ordered:</strong> {reorder.stock}
                        </li>
                        <li>
                          <strong>Status:</strong>{" "}
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            {reorder.status}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReorderList;
