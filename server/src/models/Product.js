
import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  dimensions: String,
  category: String,
  price: Number,
  imageUrl: String
}, { timestamps: true })

export default mongoose.model('Product', productSchema)
