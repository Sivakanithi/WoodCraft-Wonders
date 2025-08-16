
import { Router } from 'express'
import Booking from '../models/Booking.js'
import Product from '../models/Product.js'
import { sendEmail } from '../index.js'
import { auth } from '../middleware/auth.js'
import { renderEmail, infoTable, pill, button, orderSummaryCard, sectionCard } from '../emailTemplates.js'

const router = Router()


// Create booking
router.post('/', async (req, res) => {
  try {
    const { productId, name, email, phone, message } = req.body
    const booking = await Booking.create({ productId, name, email, phone, message })

    // email notify admin
    const product = await Product.findById(productId)
    const subject = `🪵 New Booking: ${product?.title || 'a product'} by ${name}`
    const adminHtml = renderEmail({
      subjectEmoji: '🪵',
      title: 'New Booking Received',
      subtitle: pill('Admin Notification', '#fff', '#8d5524'),
      contentHtml: `
        ${orderSummaryCard({ product, booking })}
        ${sectionCard({
          title: 'Customer Details',
          bodyHtml: infoTable([
            ['👤 Name:', name],
            ['📧 Email:', email],
            ['📞 Phone:', phone],
            ['💬 Message:', message || '-'],
          ])
        })}
        ${button('Open Admin Dashboard', (process.env.ADMIN_DASHBOARD_URL || '#'))}
      `
    })
    // Always send to admin email
    try { await sendEmail({ subject, html: adminHtml, to: process.env.EMAIL_TO }) } catch {}

    res.json(booking)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' })
  }
})

// Get all bookings (admin)
router.get('/', auth('admin'), async (_req, res) => {
  const list = await Booking.find().sort({ createdAt: -1 })
  res.json(list)
})

// Get bookings for logged-in user
router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  let userEmail
  try {
    const jwt = (await import('jsonwebtoken')).default
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
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
router.patch('/:id/:action', auth('admin'), async (req, res) => {
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
        subtitle: pill('Thank you for choosing us', '#fff', '#2e7d32'),
        contentHtml: `
          ${orderSummaryCard({ product, booking })}
          ${button('View Your Orders', (process.env.USER_ORDERS_URL || '#'))}
          <div style="color:#5c4326;font-size:13px;margin-top:10px">We will contact you soon to confirm delivery timelines.</div>
        `
      })
    } else {
      subject = `Order Update: ${product?.title || 'a product'} was not approved`
      html = renderEmail({
        subjectEmoji: '❌',
        title: 'Booking Rejected',
        contentHtml: `
          ${orderSummaryCard({ product, booking })}
          <p style="color:#5c4326;margin:10px 0 0">Sorry, your booking for <b>${product?.title}</b> was not approved.</p>
          ${button('Browse other products', (process.env.CLIENT_BASE_URL || '#'))}
        `
      })
    }
  // (removed duplicate else block)
  // Always send acceptance/rejection to user
  try { await sendEmail({ subject, html, to: booking.email }) } catch {}
  res.json(booking)
})

// (removed duplicate GET '/')


// Delete booking by ID (admin)
router.delete('/:id', auth('admin'), async (req, res) => {
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
