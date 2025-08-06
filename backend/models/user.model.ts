import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String }, // optional
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'buyer'], required: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
