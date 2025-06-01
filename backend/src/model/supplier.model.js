import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const supplierSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  itemsSupplied: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Item' 
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
},{timestamps:true});

const Supplier = model('Supplier', supplierSchema);

export default Supplier;
