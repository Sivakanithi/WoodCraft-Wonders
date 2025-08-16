
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

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
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
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email disabled. Set EMAIL_USER and EMAIL_PASS to enable.')
    return
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  })
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: to || process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject, html
    })
    console.log('Email sent:', info.response)
    console.log('To:', to || process.env.EMAIL_TO || process.env.EMAIL_USER)
    console.log('Subject:', subject)
  } catch (err) {
    console.error('Email send error:', err)
    console.error('Email details:', { to, subject })
  }
}
export { sendEmail }

app.listen(PORT, () => console.log('API running on port', PORT))
