
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import bookingRoutes from './routes/bookings.js'
import { renderEmail, infoTable, pill } from './emailTemplates.js'
import { auth } from './middleware/auth.js'
import fs from 'fs'

const app = express()
// Ensure Express respects X-Forwarded-* headers (needed on Render/behind proxy)
app.set('trust proxy', 1)
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
// Ensure uploads directory exists
try { if (!fs.existsSync('uploads')) fs.mkdirSync('uploads', { recursive: true }) } catch {}
app.use('/uploads', express.static('uploads'))

const PORT = process.env.PORT || 4000

// Connect Mongo
const MONGO_URI = process.env.MONGO_URI
const MONGO_DB_NAME = process.env.MONGO_DB_NAME // optional; recommended on Render
mongoose.connect(MONGO_URI, MONGO_DB_NAME ? { dbName: MONGO_DB_NAME } : {})
  .then(()=> console.log('MongoDB connected'))
  .catch(err=> console.warn('MongoDB connection failed:', err.message, '\nProceeding without DB — some features may not work.'))

app.get('/', (_req, res) => res.send('Carpenter Workshop API'))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/bookings', bookingRoutes)

// Simple contact form route
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body || {}
  try {
    const html = renderEmail({
      subjectEmoji: '📩',
      title: 'New Contact Message',
      subtitle: pill('Contact Form', '#fff', '#8d5524'),
      contentHtml: infoTable([
        ['👤 Name:', name],
        ['📧 Email:', email],
        ['📞 Phone:', phone],
        ['💬 Message:', message],
      ])
    })
    await sendEmail({ subject: `New contact from ${name}`, html })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// Email helper
import nodemailer from 'nodemailer'
async function sendEmail({ subject, html, to }) {
  // Build transport from env
  const { EMAIL_USER, EMAIL_PASS, EMAIL_FROM, EMAIL_TO, EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, SMTP_URL, EMAIL_SERVICE } = process.env
  if (!(SMTP_URL || EMAIL_HOST || (EMAIL_USER && EMAIL_PASS))) {
    console.log('Email disabled. Set either SMTP_URL, or EMAIL_HOST(+PORT) with EMAIL_USER/EMAIL_PASS, or Gmail EMAIL_USER/EMAIL_PASS.')
    return
  }
  let transporter
  try {
    if (SMTP_URL) {
      transporter = nodemailer.createTransport(SMTP_URL)
    } else if (EMAIL_HOST) {
      transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT ? Number(EMAIL_PORT) : 587,
        secure: String(EMAIL_SECURE||'').toLowerCase() === 'true' || (EMAIL_PORT && Number(EMAIL_PORT) === 465),
        auth: EMAIL_USER && EMAIL_PASS ? { user: EMAIL_USER, pass: EMAIL_PASS } : undefined
      })
    } else {
      // Default to Gmail service using app password
      transporter = nodemailer.createTransport({
        service: EMAIL_SERVICE || 'gmail',
        auth: { user: EMAIL_USER, pass: EMAIL_PASS }
      })
    }
  } catch (e) {
    console.error('Email transport creation failed:', e?.message || e)
    return
  }
  const mail = {
    from: EMAIL_FROM || EMAIL_USER,
    to: to || EMAIL_TO || EMAIL_USER,
    subject: subject || '(no subject)',
    html: html || '<div>No content</div>'
  }
  try {
    // Optional verify (fast failure if creds invalid)
    await transporter.verify().catch(()=>{})
    const info = await transporter.sendMail(mail)
    console.log('Email sent:', info && (info.response || info.messageId))
    console.log('To:', mail.to)
    console.log('Subject:', mail.subject)
  } catch (err) {
    console.error('Email send error:', err && (err.response || err.message || err))
    console.error('Email details:', { to: mail.to, subject: mail.subject })
  }
}
export { sendEmail }

app.listen(PORT, () => console.log('API running on port', PORT))

// Admin-only test email endpoint to validate configuration
app.post('/api/admin/test-email', auth('admin'), async (req, res) => {
  try {
    const to = (req.body && req.body.to) || process.env.EMAIL_TO || process.env.EMAIL_USER
    const html = renderEmail({
      subjectEmoji: '✉️',
      title: 'Test Email',
      subtitle: pill('Admin Triggered', '#fff', '#8d5524'),
      contentHtml: infoTable([
        ['Environment:', process.env.RENDER ? 'Render' : 'Local'],
        ['To:', to],
        ['Transport:', process.env.SMTP_URL ? 'SMTP_URL' : (process.env.EMAIL_HOST ? 'SMTP_HOST' : (process.env.EMAIL_SERVICE || 'gmail'))]
      ])
    })
    await sendEmail({ subject: 'Test email from WoodCraft Wonders', html, to })
    res.json({ ok: true, to })
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) })
  }
})

// Lightweight image proxy for whitelisted hosts (e.g., Google Drive thumbnails)
app.get('/api/proxy-image', async (req, res) => {
  try {
    const raw = req.query.url
    if (!raw || typeof raw !== 'string') return res.status(400).send('Missing url')
    let url
    try { url = new URL(raw) } catch { return res.status(400).send('Invalid url') }
    const allow = ['drive.google.com', 'lh3.googleusercontent.com', 'lh4.googleusercontent.com', 'lh5.googleusercontent.com', 'lh6.googleusercontent.com']
    if (!allow.includes(url.hostname)) return res.status(403).send('Host not allowed')
    const r = await fetch(url, { redirect: 'follow' })
    if (!r.ok) return res.status(r.status).send('Upstream error')
    const ct = r.headers.get('content-type') || 'image/jpeg'
    res.setHeader('Content-Type', ct)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    const buf = Buffer.from(await r.arrayBuffer())
    res.send(buf)
  } catch (e) {
    res.status(500).send('Proxy error')
  }
})
