
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import crypto from 'crypto'
import { sendEmail } from '../index.js'
import { renderEmail, pill } from '../emailTemplates.js'

const router = Router()

// Seed demo users on first call if not present
async function ensureDemoUsers() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@demo.com'
  const userEmail = process.env.USER_EMAIL || 'user@demo.com'
  if (!await User.findOne({ email: adminEmail })) {
    await User.create({ email: adminEmail, passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10), role: 'admin' })
  }
  if (!await User.findOne({ email: userEmail })) {
    await User.create({ email: userEmail, passwordHash: bcrypt.hashSync(process.env.USER_PASSWORD || 'user123', 10), role: 'user' })
  }
}


// Register new user
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already in use' })
  const passwordHash = bcrypt.hashSync(password, 10)
  const user = await User.create({ email, passwordHash, role: 'user', name })
  res.json({ message: 'Registered', user: { id: user._id, email: user.email, role: user.role } })
})

router.post('/login', async (req, res) => {
  await ensureDemoUsers()
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ error: 'Invalid credentials' })
  const ok = bcrypt.compareSync(password, user.passwordHash)
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user._id, email: user.email, role: user.role } })
})

export default router

// Forgot password: issue token and email link
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.json({ ok: true }) // don't reveal existence
  const token = crypto.randomBytes(24).toString('hex')
  user.resetToken = token
  user.resetTokenExp = new Date(Date.now() + 1000*60*30) // 30 minutes
  await user.save()
  const baseUrl = process.env.CLIENT_BASE_URL || 'http://localhost:5173'
  const link = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
  const html = renderEmail({
    subjectEmoji: '🔐',
    title: 'Password Reset',
    subtitle: pill('Expires in 30 minutes', '#8d5524', '#fff1cc'),
    contentHtml: `<p style="margin:0 0 12px 0;color:#3a2a19">Click the link below to reset your password:</p>
      <p style="margin:0 0 12px 0"><a href="${link}" style="background:#8d5524;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none">Reset Password</a></p>
      <div style="font-size:12px;color:#7a5a36">If you didn't request this, you can ignore this email.</div>`
  })
  try { await sendEmail({ subject: 'Password Reset', html, to: email }) } catch {}
  res.json({ ok: true })
})

// Reset password: verify token and set new password
router.post('/reset-password', async (req, res) => {
  const { email, token, password } = req.body
  const user = await User.findOne({ email, resetToken: token, resetTokenExp: { $gt: new Date() } })
  if (!user) return res.status(400).json({ error: 'Invalid or expired token' })
  user.passwordHash = bcrypt.hashSync(password, 10)
  user.resetToken = undefined
  user.resetTokenExp = undefined
  await user.save()
  res.json({ ok: true })
})
