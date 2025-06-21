import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import BASE_URL from '../../apiConfig';
import { clearCart } from '../../reduxStore/cartSlice';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';

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
    if (!cartItems || cartItems.length === 0) return;
    async function createPaymentIntent() {
      try {
        const res = await axios.post(`${BASE_URL}/api/v1/order/create-payment-intent`, { cartItems }, { withCredentials: true });
        if (res.data.success) setClientSecret(res.data.clientSecret);
        else throw new Error(res.data.message || 'No client secret');
      } catch (err) {
        toast.error('Failed to initialize payment');
      } finally {
        setInitializing(false);
      }
    }
    createPaymentIntent();
  }, [cartItems]);

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement('cardNumber'),
          billing_details: { name: shipping.fullName },
        },
      });

      if (error) return toast.error(error.message);

      if (paymentIntent.status === 'succeeded') {
        const orderData = {
          orderItems: cartItems.map(i => ({
             item: i._id, quantity: i.quantity ,
             price: i.price,
            })),
          shippingAddress: shipping,
          paymentMethod: 'Stripe',
          paymentResult: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
          },
        };

        const res = await axios.post(`${BASE_URL}/api/v1/order/create`, orderData, { withCredentials: true });
        if (res.data.success) {
          toast.success('Order placed!');
          dispatch(clearCart());
          navigate('/');
        } else {
          throw new Error(res.data.message);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  if (initializing) return <p className="text-center mt-6">Initializing payment...</p>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handlePayment();
      }}
      className="max-w-xl mx-auto w-full p-8 bg-white shadow-md rounded-xl border border-gray-200"
    >
      <h2 className="text-3xl font-bold text-center mb-6">Secure Checkout</h2>
      <div className="flex justify-center gap-3 mb-6">
        <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
        <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="MasterCard" className="h-8" />
        <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" className="h-8" />
      </div>

      <ShippingForm shipping={shipping} setShipping={setShipping} />
      <PaymentForm />

      <button
        type="submit"
        disabled={!stripe || !elements || !clientSecret || loading}
        className={`w-full py-3 rounded-md text-white font-semibold transition ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loading ? 'Processing…' : 'Pay & Place Order'}
      </button>
    </form>
  );
};

export default Checkout;
