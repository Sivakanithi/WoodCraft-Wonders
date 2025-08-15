
import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  email: String,
  phone: String,
  message: String,
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' }
}, { timestamps: true })

export default mongoose.model('Booking', bookingSchema)
