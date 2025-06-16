import { asyncHandler } from '../middlewares/asyncHandler.js';
import Order from '../model/order.model.js';
import Item from "../model/item.model.js"
import { reOrderHelper } from '../utils/ReOrder.helper.js';
import { sendEmail } from '../middlewares/sendEmail.js';
import { IssuanceLog } from '../model/Issuence.model.js';
import Reorder from "../model/reorder.model.js"

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
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
    });
  }

  const order = await Order.create({
    user: userId,
    orderItems: updatedOrderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentResult: paymentResult ? {
      id: paymentResult.id,
      status: paymentResult.status,
      amount: paymentResult.amount,
    } : undefined,
  });

  if (req.user.email) {
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

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const order = await Order.findById(id).populate('user').populate('orderItems.item');
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const prevStatus = order.orderStatus;
  order.orderStatus = status;
  await order.save();

  // Deduct quantity when moving to 'Processing' (existing logic)
  if (status === 'Processing' && prevStatus !== 'Processing') {
    for (const item of order.orderItems) {
      const dbItem = await Item.findById(item.item._id);
      if (dbItem.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for item: ${dbItem.productName}`,
        });
      }
      dbItem.quantity -= item.quantity;
      await dbItem.save();

      
    }
  }

  if (status === 'Delivered' && prevStatus !== 'Delivered') {
    for (const item of order.orderItems) {
      await IssuanceLog.create({
        itemId: item.item._id,
        userId: order.user._id,
        quantity: item.quantity,
        issuedBy: req.user._id,  
        issuedAt: new Date(),
      });
    }
  }

  // Send notification emails on 'Processing' or 'Delivered'
  if (['Processing', 'Delivered'].includes(status) && order.user.email) {
    const subject = `Your Order has been ${status}`;
    const text = `Hello ${order.user.UserName || ''},\n\nYour order with ID ${order._id} is now marked as ${status}.\n\nThank you for shopping with us!\n\n- Your Team`;
    await sendEmail({ to: order.user.email, subject, text });
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
})
export {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getReorder
};
