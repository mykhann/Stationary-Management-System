import express from 'express';
import Stripe from 'stripe';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getReorder,
} from '../controller/order.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js';
import Item from '../model/item.model.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a new order (user must be logged in)
router.post('/create', isAuthenticated, createOrder);

// REORDER DETAILS 
router.get('/reorder', isAuthenticated, getReorder);

// Get all orders (admin only)
router.get('/get', isAuthenticated, getAllOrders);

// Get orders for logged-in user
router.get('/my-orders', isAuthenticated, getUserOrders);

// Get a specific order by ID (user must be logged in)
router.get('/:id', isAuthenticated, getOrderById);

// Update order status (admin only)
router.put('/:id/status', isAuthenticated, updateOrderStatus);

// Stripe: create PaymentIntent for checkout
router.post('/create-payment-intent', isAuthenticated, async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in cart.',
      });
    }

    let totalAmount = 0;

    for (const item of cartItems) {
      const dbItem = await Item.findById(item._id || item.item);
      if (!dbItem) {
        return res.status(404).json({ success: false, message: `Item not found: ${item._id}` });
      }
      totalAmount += dbItem.price * item.quantity * 100;
    }

    if (totalAmount < 50) {
      return res.status(400).json({
        success: false,
        message: 'Order total is too small to process payment.',
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount),
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});



export default router;