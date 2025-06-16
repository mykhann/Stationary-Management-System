import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import BASE_URL from '../../apiConfig';
import { clearCart } from '../../reduxStore/cartSlice';

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#9e2146' },
  },
};

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);

  const [clientSecret, setClientSecret] = useState('');
  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

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

 useEffect(() => {
  if (!cartItems || cartItems.length === 0) return; // ✅ Prevent empty cart request

  async function createPaymentIntent() {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/order/create-payment-intent`,
        { cartItems },
        { withCredentials: true }
      );
      if (response.data.success && response.data.clientSecret) {
        setClientSecret(response.data.clientSecret);
      } else {
        throw new Error(response.data.message || 'No clientSecret received');
      }
    } catch (err) {
      console.error('Failed to initialize payment:', err);
      toast.error('Payment initialization failed. Please try again.');
    } finally {
      setInitializing(false);
    }
  }

  createPaymentIntent();
}, [cartItems]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!clientSecret) return toast.error('Payment not ready yet.');

    setLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: { name: shipping.fullName },
          },
        }
      );

      if (error) {
        console.error('Payment confirmation error:', error);
        return toast.error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        const orderData = {
          orderItems: cartItems.map((i) => ({ item: i._id, quantity: i.quantity })),
          shippingAddress: shipping,
          paymentMethod: 'Stripe',
          paymentResult: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
          },
        };
        const res = await axios.post(
          `${BASE_URL}/api/v1/order/create`,
          orderData,
          { withCredentials: true }
        );
        if (res.data.success) {
          toast.success('Payment & order successful!');
          dispatch(clearCart());
          navigate('/');
        } else {
          throw new Error(res.data.message || 'Order creation failed');
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'An error occurred processing your payment.');
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return <p className="text-center mt-6">Initializing payment...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-center mb-6">Checkout</h2>

      {/* Shipping Fields */}
      {['fullName', 'address', 'city', 'postalCode', 'country'].map((key, idx) => (
        <div className="mb-4" key={idx}>
          <label className="block text-sm font-medium text-gray-700">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <input
            type="text"
            value={shipping[key]}
            onChange={(e) => setShipping((s) => ({ ...s, [key]: e.target.value }))}
            placeholder={key}
            className="mt-1 p-2 border rounded-md w-full focus:ring focus:border-blue-300"
          />
        </div>
      ))}

      {/* Card Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
        <div className="border p-2 rounded">
          <CardNumberElement options={CARD_OPTIONS} />
        </div>
      </div>

      {/* Expiry Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
        <div className="border p-2 rounded">
          <CardExpiryElement options={CARD_OPTIONS} />
        </div>
      </div>

      {/* CVC */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
        <div className="border p-2 rounded">
          <CardCvcElement options={CARD_OPTIONS} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || !clientSecret || loading}
        className={`w-full py-2 rounded-md text-white font-semibold ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
        }`}
      >
        {loading ? 'Processing…' : 'Pay & Place Order'}
      </button>
    </form>
  );
};

export default Checkout;
