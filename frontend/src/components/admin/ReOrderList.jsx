import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Menu, MoreVertical } from "lucide-react";
import BASE_URL from "../../apiConfig";
import DashboardSideBar from "./DashboardSideBar";

const ReorderList = () => {
  const [reorders, setReorders] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    fetchReorders();

    const handleClickOutside = (e) => {
      if (!openDropdownId) return;
      const menuEl = document.getElementById(`dropdown-${openDropdownId}`);
      if (menuEl && !menuEl.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdownId]);

  const fetchReorders = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/order/reorder`, {
        withCredentials: true,
      });
      if (Array.isArray(data.reorder)) {
        setReorders(data.reorder);
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
      const { data } = await axios.patch(
        `${BASE_URL}/api/v1/order/${id}/reorder/update`,
        { status: newStatus },
        { withCredentials: true }
      );
      const updated = data.reorder;
      if (updated && updated._id) {
        setReorders((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r))
        );
      } else {
        await fetchReorders();
      }
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update status.");
      await fetchReorders();
    }
  };

  const toggleSidebar = () => setSidebarOpen((o) => !o);
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
           Automated Reorders from vendors
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
                    {/* Reorder ID */}
                    <div>
                      <p className="text-sm text-gray-500">Reorder ID</p>
                      <p className="font-medium text-gray-700">{reorder._id}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(reorder.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Supplier */}
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

                    {/* Item & Status: now with name & image */}
                    <div className="flex items-center space-x-4">
                      {reorder.itemId?.avatar?.[0] && (
                        <img
                          src={reorder.itemId.avatar[0]}
                          alt={reorder.itemId.productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Item</p>
                        <p className="font-medium text-gray-700">
                          {reorder.itemId?.productName || "Unknown Item"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Stock to add: {reorder.stock}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                          {reorder.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown */}
                  <div
                    className="ml-4 relative"
                    id={`dropdown-${reorder._id}`}
                  >
                    <button
                      title="More"
                      onClick={() =>
                        setOpenDropdownId((open) =>
                          open === reorder._id ? null : reorder._id
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
                            onClick={async () => {
                              await handleStatusUpdate(reorder._id, status);
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
