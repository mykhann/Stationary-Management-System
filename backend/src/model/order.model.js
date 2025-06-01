import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash on Delivery', 'Credit Card', 'Paypal', 'Stripe'],
  },
  orderStatus: {
    type: String,
    default: 'Processing',
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
