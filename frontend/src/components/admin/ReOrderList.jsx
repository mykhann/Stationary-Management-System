import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Menu, Trash2, MoreVertical } from "lucide-react";
import BASE_URL from "../../apiConfig";
import DashboardSideBar from "./DashboardSideBar";

const ReorderList = () => {
  const [reorders, setReorders] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchReorders();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleStatusUpdate = async (id, newStatus) => {
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
      console.error("Update failed:", err);
      alert("Failed to update status.");
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
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
      <div className="flex-1 w-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 md:hidden bg-white shadow">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Reorders</h2>
          <div className="w-6" />
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Reorder Management
          </h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {reorders.length === 0 && !error ? (
            <p className="text-gray-600">No reorders found.</p>
          ) : (
            <div className="space-y-4">
              {reorders.map((reorder) => (
                <div
                  key={reorder._id}
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 flex justify-between items-center hover:shadow-md transition"
                >
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Reorder ID</p>
                      <p className="font-medium text-gray-700">{reorder._id}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(reorder.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Supplier</p>
                      <p className="text-gray-700 text-sm">
                        {reorder.supplierId?.name || "N/A"} —{" "}
                        {reorder.supplierId?.phone || "N/A"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {reorder.supplierId?.address || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Item & Status</p>
                      <p className="text-gray-700 text-sm">
                        Item ID: {reorder.itemId} • Stock: {reorder.stock}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        {reorder.status}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4 relative" ref={dropdownRef}>
                    <button
                      title="More"
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === reorder._id ? null : reorder._id
                        )
                      }
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openDropdownId === reorder._id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-10">
                        {["ordered", "received", "cancelled"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              handleStatusUpdate(reorder._id, status);
                              setOpenDropdownId(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {status}
                          </button>
                        ))}
                        <div className="border-t" />
                        <button
                          onClick={() => handleDelete(reorder._id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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
