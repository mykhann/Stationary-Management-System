import React, { useState, useEffect } from "react";
import { MoreVertical, Trash2 } from "lucide-react";

const OrdersTable = ({ orders, onDelete, onStatusChange }) => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const ordersPerPage = 7;

  useEffect(() => {
    let list = [...orders];
    if (filter !== "All") {
      list = list.filter((o) => o.orderStatus === filter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter((o) => {
        const name = o.shippingAddress?.fullName?.toLowerCase() || "";
        const email = o.user?.email?.toLowerCase() || "";
        const id = o._id || "";
        return (
          name.includes(term) ||
          email.includes(term) ||
          id.includes(searchTerm)
        );
      });
    }
    setFilteredOrders(list);
    setCurrentPage(1);
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
      {/* Filters & Search */}
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name, email or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-64"
        />
        <div className="flex gap-2 flex-wrap">
          {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1 text-sm rounded-full border ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-4">
        {currentOrders.map((order) => (
          <div
            key={order._id}
            className="relative bg-white rounded-2xl shadow p-4 space-y-2"
          >
            {/* Header with ID, name, status icon, delete icon */}
            <div className="flex items-center">
              <div className="flex-1">
                <p className="font-semibold break-all">{order._id}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.fullName}
                </p>
              </div>
              <button
                onClick={() =>
                  setDropdownOpen(
                    dropdownOpen === order._id ? null : order._id
                  )
                }
                className="p-1 text-gray-600"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(order._id)}
                className="p-1 text-red-600 ml-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              {dropdownOpen === order._id && (
                <div className="absolute top-10 right-4 w-40 bg-white border rounded-md shadow-lg z-10">
                  {["Cancelled", "Processing", "Shipped", "Delivered"].map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => {
                          onStatusChange(order._id, st);
                          setDropdownOpen(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Expand toggle */}
            <button
              onClick={() =>
                setExpandedCards((prev) => ({
                  ...prev,
                  [order._id]: !prev[order._id],
                }))
              }
              className="text-blue-600 text-sm"
            >
              {expandedCards[order._id] ? "See less" : "See more"}
            </button>

            {/* Expanded details */}
            {expandedCards[order._id] && (
              <div className="text-sm space-y-1">
                <p>
                  <strong>Address:</strong> {order.shippingAddress?.address}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(order.createdAt)}
                </p>
                <p>
                  <strong>Items:</strong>{" "}
                  {order.orderItems.map((it, idx) => (
                    <span key={idx}>
                      {it.item?.productName}×{it.quantity}
                      {idx < order.orderItems.length - 1 && ", "}
                    </span>
                  ))}
                </p>
                <p>
                  <strong>Total:</strong> Rs. {order.totalAmount}
                </p>
                <p>
                  <strong>Payment:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      getStatusBadgeColor(order.orderStatus)
                    }`}
                  >
                    {order.orderStatus}
                  </span>
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
              {["Order ID","Customer","Address","Date","Items","Total","Payment","Status","Actions"].map(
                (h) => (
                  <th key={h} className="p-4 text-left">
                    {h}
                  </th>
                )
              )}
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
                  {order.orderItems.map((it, idx) => (
                    <div key={idx}>
                      {it.item?.productName || "Unknown"} × {it.quantity}
                    </div>
                  ))}
                </td>
                <td className="p-4">Rs. {order.totalAmount}</td>
                <td className="p-4">{order.paymentMethod}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getStatusBadgeColor(order.orderStatus)
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="p-4 relative flex items-center gap-2">
                  <button
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === order._id ? null : order._id
                      )
                    }
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => onDelete(order._id)}
                    className="text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {dropdownOpen === order._id && (
                    <div className="absolute right-4 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                      {["Cancelled","Processing","Shipped","Delivered"].map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => {
                              onStatusChange(order._id, st);
                              setDropdownOpen(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === idx + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {idx + 1}
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
