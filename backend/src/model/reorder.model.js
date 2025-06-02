import mongoose from 'mongoose';

const reorderSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 1,
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  status: {
    type: String,
    enum: ['pending', 'ordered', 'received', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orderedAt: Date,
  receivedAt: Date,
},{timestamps:true});

export default mongoose.model('Reorder', reorderSchema);
