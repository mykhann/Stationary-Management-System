import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import BASE_URL from '../../apiConfig';
import { clearCart } from '../../reduxStore/cartSlice';
import ShippingForm from './ShippingForm';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);

  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setShipping({
        fullName: user.name || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
      });
    }
  }, [user]);

  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(i => ({
          item: i._id,
          quantity: i.quantity,
          price: i.price,
        })),
        shippingAddress: shipping,
        paymentMethod: 'Cash on Delivery',
      };

      const res = await axios.post(`${BASE_URL}/api/v1/order/create`, orderData, { withCredentials: true });

      if (res.data.success) {
        toast.success('Order placed!');
        dispatch(clearCart());
        navigate('/');
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message || 'Order placement failed.');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 h-fit">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500"> {item.productName}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="flex justify-between items-center pt-4 text-lg font-bold">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePlaceOrder();
        }}
        className="bg-white p-8 rounded-xl shadow border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Cash On Delivery </h2>
       
        <ShippingForm shipping={shipping} setShipping={setShipping} />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold transition flex justify-center items-center ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3.536-3.536A9 9 0 103.515 13.05L4 12z"
              ></path>
            </svg>
          )}
          {loading ? 'Placing Order…' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
