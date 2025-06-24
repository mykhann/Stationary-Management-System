import React, { useEffect, useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";

const OrdersTable = ({ orders, onStatusChange, onDelete }) => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;

  useEffect(() => {
    let updatedOrders = [...orders];

    if (filter !== "All") {
      updatedOrders = updatedOrders.filter((order) => order.orderStatus === filter);
    }

    if (searchTerm) {
      updatedOrders = updatedOrders.filter((order) => {
        const fullName = order.shippingAddress?.fullName?.toLowerCase() || "";
        const email = order.user?.email?.toLowerCase() || "";
        const id = order._id || "";

        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          email.includes(searchTerm.toLowerCase()) ||
          id.includes(searchTerm)
        );
      });
    }

    setFilteredOrders(updatedOrders);
    setCurrentPage(1); // Reset to first page on filter/search
  }, [orders, searchTerm, filter]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

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
    <>
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name, email or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-64"
        />

        <div className="flex gap-2 flex-wrap">
          {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm rounded-full border ${
                filter === status ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
        {currentOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No orders found for selected filter.</div>
        ) : (
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
              {currentOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 break-all max-w-xs">{order._id}</td>
                  <td className="p-4">{order.shippingAddress?.fullName || "N/A"}</td>
                  <td className="p-4">{order.shippingAddress?.address || "N/A"}</td>
                  <td className="p-4">{formatDate(order.createdAt)}</td>
                  <td className="p-4 text-xs">
                    {order.orderItems?.map((item, index) => (
                      <div key={index}>
                        {item.item?.productName || "Unknown"} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-4">Rs. {order.totalAmount}</td>
                  <td className="p-4">{order.paymentMethod}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 relative flex gap-2 items-center">
                    <button
                      onClick={() =>
                        setDropdownOpen(dropdownOpen === order._id ? null : order._id)
                      }
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(order._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Order"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    {dropdownOpen === order._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                        {["Cancelled", "Processing", "Shipped", "Delivered"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              onStatusChange(order._id, status);
                              setDropdownOpen(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 p-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default OrdersTable;
