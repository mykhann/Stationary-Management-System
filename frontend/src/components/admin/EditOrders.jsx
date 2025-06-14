import React, { useEffect, useState } from "react";
import DashBoardSideBar from "./DashboardSideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setSingleOrder } from "../../reduxStore/orderSlice";

const EditOrders = () => {
  const [status, setStatus] = useState(""); // Initialize status state
  const params = useParams();
  const orderId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleOrder } = useSelector((store) => store.order);

  // Fetch the order when component mounts
  useEffect(() => {
    const fetchSingleOrder = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/orders/get/${orderId}`,
          { withCredentials: true }
        );
        console.log(res.data);
        if (res.data.success) {
          dispatch(setSingleOrder(res.data.order));
          setStatus(res.data.order.orderStatus); // Set initial status from fetched order
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch order");
      }
    };
    fetchSingleOrder();
  }, [dispatch, orderId]); // Add orderId and dispatch as dependencies

  const handleStatusChange = (e) => {
    setStatus(e.target.value); // Update the status state on dropdown change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/orders/update-status/${orderId}`,
        { orderStatus: status }, // Send orderStatus (correct key)
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(res.data);

      if (res.data.success) {
        dispatch(setSingleOrder(res.data.order));
        toast.success("Order updated successfully");
        navigate(-1); // Optionally navigate after update
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const deleteOrderHandler =async (e) => {
    e.preventDefault();
    try {
      const res=await axios.delete(`http://localhost:8000/api/v1/orders/delete/${orderId}`,{withCredentials:true})
      console.log(res.data)
      
        toast.success(res.data.message)
        dispatch(setSingleOrder(null))
        navigate(-1)
     
    } catch (error) {
      toast.error(error.response.data.message)
      
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoardSideBar />
      <div className="flex-grow bg-gray-700 p-6">
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4 max-w-md mx-auto">
          <h1 className="text-3xl text-center text-white font-bold mb-6">
            Edit Order
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Status */}
              <div>
                <select
                  id="orderStatus"
                  name="orderStatus"
                  value={status} // Bind value to status state
                  onChange={handleStatusChange} // Handle change event
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between space-x-4">
              <button
                type="submit"
                className="mt-4 bg-cyan-900 text-white px-4 py-2 rounded hover:bg-cyan-950 transition duration-200 w-full"
              >
                Update Order
              </button>
              <button
                onClick={deleteOrderHandler}
                type="button"
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200 w-full"
              >
                Delete Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrders;
