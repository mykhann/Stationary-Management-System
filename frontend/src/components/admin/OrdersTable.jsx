import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, Trash2 } from "lucide-react";
import BASE_URL from "../../apiConfig";
import DashboardSideBar from "./DashboardSideBar";

const STATUS_OPTIONS = ["Ordered", "Received", "Cancelled"];

const ReorderList = () => {
  const [reorders, setReorders] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchReorders();
  }, []);

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/order/${id}/reorder/delete`, {
        withCredentials: true,
      });
      setReorders((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete reorder.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/v1/order/${id}/reorder/update`,
        { status: newStatus },
        { withCredentials: true }
      );
      setReorders((prev) =>
        prev.map((r) => (r._id === id ? response.data.reorder : r))
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status.");
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Ordered":
        return "bg-yellow-100 text-yellow-800";
      case "Received":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 md:hidden bg-white shadow">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Reorders</h2>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Reorder Management
          </h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {reorders.length === 0 && !error ? (
            <p className="text-gray-600">No reorders found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reorders.map((reorder) => (
                <div
                  key={reorder._id}
                  className="bg-white rounded-xl shadow p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-700 font-medium">
                      {reorder._id}
                    </div>
                    <button
                      onClick={() => handleDelete(reorder._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 mb-2">
                    Created: {new Date(reorder.createdAt).toLocaleDateString()}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Supplier:</span>{" "}
                      {reorder.supplierId?.name || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Item ID:</span> {reorder.itemId}
                    </div>
                    <div>
                      <span className="font-semibold">Stock:</span> {reorder.stock}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Status:</span>
                      <select
                        value={reorder.status}
                        onChange={(e) =>
                          handleStatusChange(reorder._id, e.target.value)
                        }
                        className={`text-xs rounded px-2 py-1 border ${getStatusColor(
                          reorder.status
                        )}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
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
