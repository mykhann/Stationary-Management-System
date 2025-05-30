import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  quantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Item = mongoose.model('Item', ItemSchema);
