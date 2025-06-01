import mongoose from 'mongoose';

const IssuanceLogSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issuedAt: { type: Date, default: Date.now }
},{timestamps:true});

export const IssuanceLog = mongoose.model('IssuanceLog', IssuanceLogSchema);
