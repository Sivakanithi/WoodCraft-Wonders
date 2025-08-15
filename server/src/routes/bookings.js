
import { Router } from 'express'
import Booking from '../models/Booking.js'
import Product from '../models/Product.js'
import { sendEmail } from '../index.js'
import { renderEmail, infoTable, pill } from '../emailTemplates.js'

const router = Router()


// Create booking
router.post('/', async (req, res) => {
  const { productId, name, email, phone, message } = req.body
  const booking = await Booking.create({ productId, name, email, phone, message })

  // email notify admin
  const product = await Product.findById(productId)
    const subject = `🪵 New Booking: ${product?.title || 'a product'} by ${name}`
    const html = renderEmail({
      subjectEmoji: '🪵',
      title: 'New Booking Received',
      subtitle: pill('Admin Notification', '#fff', '#8d5524'),
      contentHtml: infoTable([
        ['🧰 Product:', `${product?.title} (${productId})`],
        ['📂 Category:', product?.category],
        ['💰 Price:', product?.price ? `₹${product.price}` : '-'],
        ['👤 Name:', name],
        ['📧 Email:', email],
        ['📞 Phone:', phone],
        ['💬 Message:', message || '-'],
      ])
    })
  // Always send to admin email
  try { await sendEmail({ subject, html, to: process.env.EMAIL_TO }) } catch {}

  res.json(booking)
})

// Get all bookings (admin)
router.get('/', async (_req, res) => {
  const list = await Booking.find().sort({ createdAt: -1 })
  res.json(list)
})

// Get bookings for logged-in user
router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  let userId, userEmail
  try {
    const jwt = (await import('jsonwebtoken')).default
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    userId = decoded.id
    userEmail = decoded.email
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
  const list = await Booking.find({ email: userEmail })
    .sort({ createdAt: -1 })
    .populate('productId', 'title category')
  res.json(list)
})

// Accept or reject booking (admin)
router.patch('/:id/:action', async (req, res) => {
  const { id, action } = req.params
  if (!['accept','reject'].includes(action)) return res.status(400).json({ error: 'Invalid action' })
  const booking = await Booking.findById(id)
  if (!booking) return res.status(404).json({ error: 'Booking not found' })
  booking.status = action === 'accept' ? 'approved' : 'rejected'
  await booking.save()

  // Email notify user
  const product = await Product.findById(booking.productId)
  let subject, html
    if (action === 'accept') {
      subject = `🪵 Order Confirmed: ${product?.title || 'a product'} | WoodCraft Wonders`
      html = renderEmail({
        subjectEmoji: '✅',
        title: 'Your Order is Confirmed!',
        contentHtml: infoTable([
          ['🧰 Product:', product?.title],
          ['📂 Category:', product?.category],
          ['💰 Price:', product?.price ? `₹${product.price}` : '-'],
          ['👤 Name:', booking.name],
          ['📧 Email:', booking.email],
          ['📞 Phone:', booking.phone],
          ['💬 Message:', booking.message || '-'],
        ])
      })
    } else {
      subject = `Order Update: ${product?.title || 'a product'} was not approved`
      html = renderEmail({
        subjectEmoji: '❌',
        title: 'Booking Rejected',
        contentHtml: `<p style="color:#5c4326;margin:0">Sorry, your booking for <b>${product?.title}</b> was not approved.</p>`
      })
    }
  // (removed duplicate else block)
  // Always send acceptance/rejection to user
  try { await sendEmail({ subject, html, to: booking.email }) } catch {}
  res.json(booking)
})

router.get('/', async (_req, res) => {
  const list = await Booking.find().sort({ createdAt: -1 })
  res.json(list)
})


// Delete booking by ID (admin)
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  // console.log('DELETE/api/bookings/:id called with id:', id)
  // console.log('id:this', id);
  const deleted = await Booking.findByIdAndDelete(id)
  if (deleted) {
    console.log('Booking deleted:', deleted)
    res.json({ ok: true })
  } else {
    console.log('Booking not found for id:', id)
    res.status(404).json({ ok: false, error: 'Booking not found' })
  }
})

export default router
