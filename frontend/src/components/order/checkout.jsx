import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../apiConfig';
import { clearCart } from '../../reduxStore/cartSlice'

const Checkout = () => {
  const { user } = useSelector((store) => store.auth);
  const { cartItems = [] } = useSelector((store) => store.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setPostalCode(user.postalCode || '');
      setCountry(user.country || '');
    }
  }, [user]);

  const placeOrder = async () => {
    setLoading(true);

    const orderData = {
      orderItems: cartItems.map((item) => ({
        item: item._id,
        quantity: item.quantity,
      })),
      shippingAddress: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
      paymentMethod: 'Cash on Delivery',
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/order/create`,
        orderData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.success) {
        toast.success('Order placed successfully!');
        dispatch(clearCart());
        navigate('/');
      } else {
        toast.error(response.data.message || 'Failed to place order.');
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 w-full p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Checkout</h2>

      {[
        { label: 'Full Name', value: fullName, setter: setFullName, placeholder: 'John Doe' },
        { label: 'Address', value: address, setter: setAddress, placeholder: '123 Main St' },
        { label: 'City', value: city, setter: setCity, placeholder: 'New York' },
        { label: 'Postal Code', value: postalCode, setter: setPostalCode, placeholder: '10001' },
        { label: 'Country', value: country, setter: setCountry, placeholder: 'USA' },
      ].map(({ label, value, setter, placeholder }, index) => (
        <div className="mb-4" key={index}>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setter(e.target.value)}
            className="mt-1 p-2 border border-pink-300 rounded-md w-full focus:ring-pink-500 focus:border-pink-500"
            placeholder={placeholder}
          />
        </div>
      ))}

      <button
        onClick={placeOrder}
        disabled={loading}
        className={`w-full py-2 rounded-md text-white font-semibold transition-colors duration-200 ${
          loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
        }`}
      >
        {loading ? 'Placing Order...' : 'Confirm Order'}
      </button>
    </div>
  );
};

export default Checkout;
