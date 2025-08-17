
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

// Helper to normalize external URLs (e.g., Google Drive) to direct image links
function normalizeExternalUrl(u) {
  if (!u || typeof u !== 'string') return u
  try {
    if (/drive\.google\.com/i.test(u)) {
      const m1 = u.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
      const m2 = u.match(/[?&]id=([a-zA-Z0-9_-]+)/)
      const id = (m1 && m1[1]) || (m2 && m2[1])
  if (id) return `https://drive.google.com/uc?export=view&id=${id}`
    }
  } catch {}
  return u
}

// Helper to convert image paths to absolute URLs consistently
function toAbsoluteImageUrl(img, base) {
  if (!img || typeof img !== 'string') return img
  // Normalize known external providers first
  img = normalizeExternalUrl(img)
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
    const norm = normalizeExternalUrl(obj.imageUrl)
    // Route drive links via proxy for reliability
    obj.imageUrl = /drive\.google\.com/i.test(norm)
      ? `${base.replace(/\/+$/, '')}/api/proxy-image?url=${encodeURIComponent(norm)}`
      : toAbsoluteImageUrl(norm, base)
    return obj
  })
  res.json(patched)
})

router.get('/:id', async (req, res) => {
  const item = await Product.findById(req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  const base = process.env.PUBLIC_BASE_URL || process.env.BASE_URL || `${req.protocol}://${req.get('host')}`
  const obj = item.toObject()
  {
    const norm = normalizeExternalUrl(obj.imageUrl)
    obj.imageUrl = /drive\.google\.com/i.test(norm)
      ? `${base.replace(/\/+$/, '')}/api/proxy-image?url=${encodeURIComponent(norm)}`
      : toAbsoluteImageUrl(norm, base)
  }
  res.json(obj)
})

router.post('/', auth('admin'), upload.single('image'), async (req, res) => {
  const body = req.body
  const base = process.env.PUBLIC_BASE_URL || process.env.BASE_URL || `${req.protocol}://${req.get('host')}`
  // Prefer uploaded file; else allow external imageUrl passed in body
  let imageUrl
  if (req.file) {
    imageUrl = `${base.replace(/\/+$/, '')}/uploads/${req.file.filename}`
  } else if (body.imageUrl) {
    const ext = normalizeExternalUrl(body.imageUrl)
    imageUrl = /^https?:\/\//i.test(ext) ? ext : toAbsoluteImageUrl(ext, base)
  }
  const created = await Product.create({ ...body, price: Number(body.price), imageUrl })
  // Return with absolute URL normalized
  const obj = created.toObject()
  {
    const norm = normalizeExternalUrl(obj.imageUrl)
    obj.imageUrl = /drive\.google\.com/i.test(norm)
      ? `${base.replace(/\/+$/, '')}/api/proxy-image?url=${encodeURIComponent(norm)}`
      : toAbsoluteImageUrl(norm, base)
  }
  res.json(obj)
})

router.delete('/:id', auth('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

export default router
