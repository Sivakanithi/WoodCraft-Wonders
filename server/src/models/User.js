
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  resetToken: { type: String },
  resetTokenExp: { type: Date }
}, { timestamps: true })

export default mongoose.model('User', userSchema)
