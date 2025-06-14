import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ItemSchema = new Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  avatar: { type: [String] },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price:{required:true,
    type:Number

  },
  stock: {
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
    default: 15
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},{timestamps:true});

const Item = model('Item', ItemSchema);

export default Item;
