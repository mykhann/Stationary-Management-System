import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../apiConfig';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/order/my-orders`, {
          withCredentials: true,
        });
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading order history...</p>;

  if (orders.length === 0) {
    return <p className="text-center mt-10 text-gray-500">You haven't placed any orders yet.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Order History</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-cyan-700">Id #{order._id}</h3>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Item Avatars */}
            <div className="flex gap-2 overflow-x-auto py-2">
              {order.orderItems.map((orderItem) => {
                const avatarUrl =
                  orderItem.item?.avatar?.[0] || '/placeholder.png';
                return (
                  <div
                    key={orderItem._id}
                    className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-200"
                    title={`Qty: ${orderItem.quantity}`}
                  >
                    <img
                      src={avatarUrl}
                      alt="Item"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 text-xs bg-black text-white rounded-full px-1">
                      x{orderItem.quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cleaner Summary in 2 Rows */}
            <div className="grid grid-cols-2 gap-4 text-sm font-medium mt-3">
              <p>Total Items: {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)}</p>
              <p>Total: <span className="text-cyan-600 font-bold">Rs {order.totalAmount}</span></p>
              <p>Payment: {order.paymentMethod}</p>
              <p>Status: <span className="text-yellow-600">{order.orderStatus}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
