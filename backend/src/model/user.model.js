import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone:{type:String,required:true},
  address:{
    type:String,
    
  },
  avatar:{type:String},
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', ''], default: 'user' },
  createdAt: { type: Date, default: Date.now }
},{timestamps:true});

export const User = mongoose.model('User', UserSchema);
