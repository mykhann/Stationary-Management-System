import { asyncHandler } from '../middlewares/asyncHandler.js';
import Supplier from '../model/supplier.model.js';


// Create a new supplier
const createSupplier = asyncHandler(async (req, res) => {
  const { name, contactPerson, email, phone, address } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Supplier name is required' });
  }

  const newSupplier = await Supplier.create({
    name,
    contactPerson,
    email,
    phone,
    address,
    
  });

  res.status(201).json({ success: true, supplier: newSupplier });
});

// Get all suppliers
const getAllSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find().populate('itemsSupplied', 'productName quantity'); 

  res.status(200).json({ success: true, suppliers });
});

// Get a single supplier by ID
const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id).populate('itemsSupplied', 'productName quantity');

  if (!supplier) {
    return res.status(404).json({ success: false, message: 'Supplier not found' });
  }

  res.status(200).json({ success: true, supplier });
});

// Update a supplier by ID
const updateSupplier = asyncHandler(async (req, res) => {
  const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedSupplier) {
    return res.status(404).json({ success: false, message: 'Supplier not found' });
  }

  res.status(200).json({ success: true, supplier: updatedSupplier });
});

// Delete a supplier by ID
const deleteSupplier = asyncHandler(async (req, res) => {
  const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);

  if (!deletedSupplier) {
    return res.status(404).json({ success: false, message: 'Supplier not found' });
  }

  res.status(200).json({ success: true, message: 'Supplier deleted successfully' });
});

export { createSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier };
