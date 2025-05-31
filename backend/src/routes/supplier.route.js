import express from 'express';
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
} from '../controller/supplier.controller.js';

import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js';

const router = express.Router();

// Create a new supplier ( admin only)
router.post('/create', isAuthenticated, createSupplier);

// Get all suppliers (admin)
router.get('/get', getAllSuppliers);

// Get a single supplier by ID
router.get('/:id', getSupplierById);

// Update supplier by ID (admin only)
router.patch('/:id/update', isAuthenticated, updateSupplier);

// Delete supplier by ID ( admin only)
router.delete('/:id/delete', isAuthenticated, deleteSupplier);

export default router;
