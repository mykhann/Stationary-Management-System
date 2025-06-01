import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ItemSchema = new Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  images: { type: [String], default: [] },
  description: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    enum: ['pcs', 'pack', 'box', 'dozen'],
    default: 'pcs'
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  supplier: {
    type: Schema.Types.ObjectId,

    ref: 'Supplier'
  },
  reorderLevel: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},{timestamps:true});

const Item = model('Item', ItemSchema);

export default Item;
