import express from 'express';
import {
  createRequest,
  getAllRequests,
  updateRequestStatus,
  getUserRequests,
} from '../controller/request.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js';

const router = express.Router();

// User creates a request for a single item (itemId in params)
router.post('/:itemId', isAuthenticated, createRequest);

// User gets their own request history
router.get('/history', isAuthenticated, getUserRequests);

// Admin gets all requests
router.get('/get', isAuthenticated, getAllRequests);

// Admin updates request status (approve/reject)
router.patch('/:id/status', isAuthenticated, updateRequestStatus);

export default router;
