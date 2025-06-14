import React, { useEffect } from "react";
import DashBoardSideBar from "./DashboardSideBar";
import axios from "axios";
import { setOrders } from "../../reduxStore/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify"; // Ensure you import toast for error handling
import { FaEdit } from "react-icons/fa"; // Import FaEdit from react-icons
import { useNavigate } from "react-router-dom";

const ViewOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders } = useSelector((store) => store.order);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/orders/get", {
          withCredentials: true,
        });
        console.log(res.data);
        if (res.data.success) {
          dispatch(setOrders(res.data.orders));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    };
    fetchOrders();
  }, [dispatch]);

  if (!orders || orders.length === 0) {
    return <p>No orders</p>;
  }

  const getProductNames = (orderItems) => {
    return orderItems.reduce((acc, item, index) => {
      acc += item.product?.name;
      if (index < orderItems.length - 1) {
        acc += ", ";
      }
      return acc;
    }, "");
  };

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoardSideBar />
      <div className="flex-grow bg-gray-900 p-6">
        <h1 className="text-3xl text-white text-center font-bold mb-6">
          View Orders
        </h1>
        <div className="overflow-x-auto bg-gray-800 text-white rounded-lg shadow-md">
          <table className="min-w-full">
            <thead className="  bg-cyan-950 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>{" "}
                {/* Actions column */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-900">
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">
                    {getProductNames(order.orderItems)}
                  </td>
                  <td className="py-3 px-4">{order.user?.name}</td>
                  <td className="py-3 px-4">{order.user?.email}</td>
                  <td className="py-3 px-4">{order.address}</td>

                  <td
                    className={`${
                      order.orderStatus === "Cancelled"
                        ? "text-red-700 font-bold"
                        : order.orderStatus === "Delivered"
                        ? "text-green-800 font-bold"
                        : order.orderStatus === "Processing"
                        ? "text-yellow-400 font-bold"
                        : "text-gray-500 font-bold"
                    }`}
                  >
                    {order.orderStatus}
                  </td>

                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-blue-500 hover:text-blue-300">
                      <FaEdit
                        onClick={() =>
                          navigate(`/admin/orders/edit/${order?._id}`)
                        }
                        className="w-5 h-5 inline"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewOrders;
