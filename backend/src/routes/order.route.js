import express from 'express';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getReorder,
} from '../controller/order.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js';

const router = express.Router();

// Create a new order (user must be logged in)
router.post('/create', isAuthenticated, createOrder);

// REORDER DETAILS 
router.get("/reorder",isAuthenticated,getReorder)

// Get all orders (admin only)
router.get('/get', isAuthenticated, getAllOrders);

// Get orders for logged-in user
router.get('/my-orders', isAuthenticated, getUserOrders);

// Get a specific order by ID (user must be logged in)
router.get('/:id', isAuthenticated, getOrderById);

// Update order status (admin only)
router.put('/:id/status', isAuthenticated, updateOrderStatus);

export default router;
