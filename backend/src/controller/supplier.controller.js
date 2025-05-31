import Supplier from "../model/supplier.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// Create a new supplier
const createSupplier = asyncHandler(async (req, res) => {
  const { name, contactPerson, email, phone, address } = req.body;
  console.log("name",name);


  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Supplier name is required"
    });
  }

  const supplier = await Supplier.create({
    name,
    contactPerson,
    email,
    phone,
    address
  });

  res.status(201).json({
    success: true,
    message: "Supplier created successfully",
    supplier
  });
});

// Get all suppliers
const getAllSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find().populate("itemsSupplied", "productName quantity");
  res.status(200).json({
    success: true,
    suppliers
  });
});

// Get supplier by ID
const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id).populate("itemsSupplied");

  if (!supplier) {
    return res.status(404).json({
      success: false,
      message: "Supplier not found"
    });
  }

  res.status(200).json({
    success: true,
    supplier
  });
});


// Delete supplier
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndDelete(req.params.id);

  if (!supplier) {
    return res.status(404).json({
      success: false,
      message: "Supplier not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Supplier deleted successfully"
  });
});

export {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  deleteSupplier
};
