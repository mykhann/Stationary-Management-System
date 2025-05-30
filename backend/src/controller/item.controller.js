import {asyncHandler} from '../middlewares/asyncHandler.js';
import Item from "../model/item.model.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Create new item

const createItem = asyncHandler(async (req, res) => {
    const {productName,quantity,description,category,supplier}=req.body;
    if (!productName || !quantity || !description || !category)
    {
        return res.status(400).json({
            success:false,
            message:"missing required fields"
        })
    }

    let imageUrl = "";

        if (req.file) {
            const result = await uploadOnCloudinary(req.file.buffer, `items/${Date.now()}-${req.file.originalname}`);
            imageUrl = result.secure_url;
        }

  const newItem = await Item.create({
    productName,
    quantity,
    description,
    category,
    supplier,
    images: imageUrl ? [imageUrl] : []

  });
  res.status(201).json({ message:"added new item",success: true, newItem });
});


// Get all items

const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find().populate('supplier', 'name email phone');
  res.status(200).json({ success: true, items });
});

// Get item by ID

 const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate('supplier');
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  res.status(200).json({ success: true, item });
});

//  Update item

const updateItem = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const source = req.body;

  const item = await Item.findById(itemId);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  if (source.productName) item.productName = source.productName;
  if (source.quantity) item.quantity = source.quantity;
  if (source.description) item.description = source.description;
  if (source.category) item.category = source.category;
  if (source.supplier) item.supplier = source.supplier;

  // Handle image upload
  if (req.file) {
    const result = await uploadOnCloudinary(
      req.file.buffer,
      `items/${Date.now()}-${req.file.originalname}`
    );
    item.images = [result.secure_url]; 
  }

  await item.save();

  res.status(200).json({
    success: true,
    message: "Item updated successfully",
    item,
  });
});


// Delete item

const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  res.status(200).json({ success: true, message: 'Item deleted successfully' });
});

export {
    createItem,
    updateItem,
    deleteItem,
    getAllItems,
    getItemById
}