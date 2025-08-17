
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

// Helper to convert image paths to absolute URLs consistently
function toAbsoluteImageUrl(img, base) {
  if (!img || typeof img !== 'string') return img
  // Already absolute (http or https)
  if (/^https?:\/\//i.test(img)) return img
  // If someone stored a full localhost URL, normalize to base
  if (/^https?:\/\/localhost(?::\d+)?\//i.test(img)) {
    const normBase = String(base || '').replace(/\/+$/, '')
    const tail = img.split(/localhost(?::\d+)?/i)[1] || ''
    return `${normBase}${tail.startsWith('/') ? '' : '/'}${tail}`
  }
  // Strip leading slashes to avoid double slashes when joining
  const cleaned = img.replace(/^\/+/, '')
  // Ensure we only ever serve from /uploads
  const rel = cleaned.startsWith('uploads/') ? cleaned : `uploads/${cleaned}`
  // Ensure base has no trailing slash
  const normBase = String(base || '').replace(/\/+$/, '')
  return `${normBase}/${rel}`
}

router.get('/', async (req, res) => {
  const items = await Product.find().sort({ createdAt: -1 })
  const base = process.env.PUBLIC_BASE_URL || process.env.BASE_URL || `${req.protocol}://${req.get('host')}`
  const patched = items.map(it => {
    const obj = it.toObject()
    obj.imageUrl = toAbsoluteImageUrl(obj.imageUrl, base)
    return obj
  })
  res.json(patched)
})

router.get('/:id', async (req, res) => {
  const item = await Product.findById(req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  const base = process.env.PUBLIC_BASE_URL || process.env.BASE_URL || `${req.protocol}://${req.get('host')}`
  const obj = item.toObject()
  obj.imageUrl = toAbsoluteImageUrl(obj.imageUrl, base)
  res.json(obj)
})

router.post('/', auth('admin'), upload.single('image'), async (req, res) => {
  const body = req.body
  const base = process.env.PUBLIC_BASE_URL || process.env.BASE_URL || `${req.protocol}://${req.get('host')}`
  const imageUrl = req.file ? `${base.replace(/\/+$/, '')}/uploads/${req.file.filename}` : toAbsoluteImageUrl(body.imageUrl, base)
  const created = await Product.create({ ...body, price: Number(body.price), imageUrl })
  // Return with absolute URL normalized
  const obj = created.toObject()
  obj.imageUrl = toAbsoluteImageUrl(obj.imageUrl, base)
  res.json(obj)
})

router.delete('/:id', auth('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

export default router
