
import { Router } from 'express'
import Product from '../models/Product.js'
import multer from 'multer'
import path from 'path'
import { auth } from '../middleware/auth.js'

const router = Router()

// Simple local upload (replace with Cloudinary in production)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_'))
})
const upload = multer({ storage })

router.get('/', async (_req, res) => {
  const items = await Product.find().sort({ createdAt: -1 })
  res.json(items)
})

router.get('/:id', async (req, res) => {
  const item = await Product.findById(req.params.id)
  res.json(item)
})

router.post('/', auth('admin'), upload.single('image'), async (req, res) => {
  const body = req.body
  const imageUrl = req.file ? `${process.env.BASE_URL || ('http://localhost:'+ (process.env.PORT||4000))}/uploads/${req.file.filename}` : undefined
  const created = await Product.create({ ...body, price: Number(body.price), imageUrl })
  res.json(created)
})

router.delete('/:id', auth('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

export default router
