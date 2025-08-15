
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import Notification from '../Notification'

export default function Login() {
  const { register, handleSubmit, reset } = useForm()
  const navigate = useNavigate()
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' })
  const [showPass, setShowPass] = useState(false)
  const [fpOpen, setFpOpen] = useState(false)
  const [fpEmail, setFpEmail] = useState('')

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(import.meta.env.VITE_API_BASE + '/auth/login', data)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setNotif({ show: true, message: 'Logged in!', type: 'success' })
      setTimeout(() => navigate(res.data.user.role === 'admin' ? '/admin' : '/'), 1200)
    } catch (e) {
      setNotif({ show: true, message: 'Login failed', type: 'error' })
    }
  }
  return (
    <div className="max-w-md mx-auto card">
      <Notification {...notif} onClose={() => setNotif(n => ({ ...n, show: false }))} />
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input className="w-full p-3 rounded-xl border" placeholder="Email" type="email" {...register('email', { required: true })} />
        <div className="relative">
          <input className="w-full p-3 rounded-xl border pr-12" placeholder="Password" type={showPass ? 'text' : 'password'} {...register('password', { required: true })} />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-amber-700"
            aria-label={showPass ? 'Hide password' : 'Show password'}
            title={showPass ? 'Hide password' : 'Show password'}
            onClick={() => setShowPass(s=>!s)}
          >
            {showPass ? (
              // Eye off icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 15.338 6.828 18.25 12 18.25c1.57 0 2.973-.262 4.209-.73" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.228 6.228C7.79 5.287 9.744 4.75 12 4.75c5.172 0 8.774 2.912 10.066 6.25-.43 1.142-1.108 2.23-2.011 3.17M3 3l18 18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 9.88a3.25 3.25 0 104.24 4.24" />
              </svg>
            ) : (
              // Eye icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.75 12 4.75c4.64 0 8.577 2.76 9.964 6.928.07.214.07.43 0 .644C20.577 16.49 16.64 19.25 12 19.25c-4.64 0-8.577-2.76-9.964-6.928z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>
        </div>
        <button className="btn btn-primary w-full" type="submit">Login</button>
      </form>
      <div className="mt-3 text-right">
        <button className="text-sm text-amber-700 hover:underline" onClick={() => setFpOpen(true)}>Forgot password?</button>
      </div>
      <p className="text-sm mt-4">Demo admin: admin@demo.com / password: admin123</p>
      <p className="text-sm">Demo user: user@demo.com / password: user123</p>

      {fpOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-3">Reset your password</h2>
            <p className="text-sm text-stone-600 mb-3">Enter your email to receive a reset link.</p>
            <input value={fpEmail} onChange={e=>setFpEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full p-3 rounded-xl border mb-3" />
            <div className="flex gap-2 justify-end">
              <button className="btn" onClick={()=> setFpOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={async ()=>{
                try {
                  await axios.post(import.meta.env.VITE_API_BASE + '/auth/forgot-password', { email: fpEmail })
                  setNotif({ show: true, message: 'Reset link sent if email exists', type: 'success' })
                  setFpOpen(false)
                  setFpEmail('')
                } catch {
                  setNotif({ show: true, message: 'Failed to send reset email', type: 'error' })
                }
              }}>Send link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
