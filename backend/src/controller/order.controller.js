import { asyncHandler } from '../middlewares/asyncHandler.js';
import Order from '../model/order.model.js';
import Item from "../model/item.model.js"
import { reOrderHelper } from '../utils/ReOrder.helper.js';
import { sendEmail } from '../middlewares/sendEmail.js';
import Reorder from "../model/reorder.model.js"

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, paymentResult } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ success: false, message: "No items in the order" });
  }

  let totalAmount = 0;
  const updatedOrderItems = [];

  for (const item of orderItems) {
    const dbItem = await Item.findById(item.item);
    if (!dbItem) {
      return res.status(404).json({ success: false, message: `Item with ID ${item.item} not found` });
    }

    if (dbItem.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for item: ${dbItem.name}`,
      });
    }

    totalAmount += dbItem.price * item.quantity;

    dbItem.stock -= item.quantity;
    await dbItem.save();

    await reOrderHelper(dbItem._id);

    updatedOrderItems.push({
      item: dbItem._id,
      quantity: item.quantity,
      category: dbItem.category,
    });
  }

  const orderData = {
    orderItems: updatedOrderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentResult: paymentResult ? {
      id: paymentResult.id,
      status: paymentResult.status,
      amount: paymentResult.amount,
    } : undefined,
  };

  if (req.user && req.user._id) {
    orderData.user = req.user._id;
  }

  const order = await Order.create(orderData);

  if (req.user?.email) {
    await sendEmail({
      to: req.user.email,
      subject: 'Order Confirmation',
      text: `Hello ${req.user.UserName || ''},\n\nYour order with ID ${order._id} has been received successfully.\n\nThank you for your purchase!\n\n- Your Team`,
    });
  }

  res.status(201).json({ success: true, order });
});



// Get all orders (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'UserName email phone')
    .populate('orderItems.item', 'productName stock')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, orders });
});

// Get orders for a specific user
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .populate('orderItems.item', 'name stock avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, orders });
});

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('user', 'UserName email')
    .populate('orderItems.item', 'name stock');

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  res.status(200).json({ success: true, order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Processing","Shipped","Delivered","Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const order = await Order.findById(id)
    .populate("user")
    .populate("orderItems.item");
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const prevStatus = order.orderStatus;
  await Order.findByIdAndUpdate(id, { orderStatus: status });

  if (status === "Processing" && prevStatus !== "Processing") {
    for (const item of order.orderItems) {
      if (!item.item) continue;
      const dbItem = await Item.findById(item.item._id);
      if (!dbItem || dbItem.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for item: ${dbItem?.productName || "Unknown"}`
        });
      }
      dbItem.quantity -= item.quantity;
      await dbItem.save();
    }
  }


  // Only send emails (if email available)
  if (["Processing","Delivered"].includes(status) && order.user?.email) {
    const subject = `Your Order has been ${status}`;
    const text = `Hello ${order.user.UserName || ""},\nYour order ${order._id} is now ${status}.\nThank you!`;
    sendEmail({ to: order.user.email, subject, text }).catch(console.error);
  }

  res.status(200).json({ success: true, message: `Order marked as ${status}` });
});



// REORDER DETAILS 
const getReorder=asyncHandler(async(req,res)=>{
  const reorder=await Reorder.find().populate("supplierId").sort({createdAt:-1})
  if (!reorder){
    return res.status(404).json({
      success:false,

    })
  }
  res.status(200).json({
    success:true,
    reorder
  })
});

// const change status 
const reorderStatusChange=asyncHandler(async(req,res)=>{
  const { id } = req.params;
  const { status } = req.body;

  // Find the reorder first
  const reorder = await Reorder.findById(id);
  if (!reorder) {
    return res.status(404).json({
      success: false,
      message: "No reorder found",
    });
  }

  // Update the status
  reorder.status = status;
  await reorder.save();

  // If status changed to 'received', update item's stock
  if (status.toLowerCase() === "received") {
    const item = await Item.findById(reorder.itemId);
    if (item) {
      const addedStock = reorder.stock ?? item.reorderStock ?? 0;
      item.stock += addedStock;
      await item.save();
    }
  }
  const updatedReorder = await Reorder.findById(reorder._id).populate("supplierId");

  res.status(200).json({
    success: true,
    updatedReorder,
  });
});

// Delete Reorder 

const DeleteReorder=asyncHandler(async(req,res)=>{
  const {id}=req.params;
  const reorder=await Reorder.findByIdAndDelete(id);
  if (!reorder){
    return res.status(404).json({
      success:false,
      message:"Not found "
    })
  }
  res.status(200).json({
    success:true,
    message:"Deleted Re-order Successfully"
  })
})



const deleteOrder=asyncHandler(async(req,res)=>{
  const {id}=req.params;
  const order= await Order.findByIdAndDelete(id);
  if (!order){
    return res.status(404).json({
      success:false,
      message:"No item found"
    })
  }
  res.status(200).json({
    success:true,
    message:"Order Deleted Successfully"
  })


})
export {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getReorder,
  deleteOrder,
  reorderStatusChange,
  DeleteReorder
};