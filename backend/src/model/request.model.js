import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      quantity: { type: Number, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
},{timestamps:true});

export const Request = mongoose.model('Request', RequestSchema);
