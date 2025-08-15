import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'
import Notification from '../Notification'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { register, handleSubmit, watch } = useForm({ defaultValues: { email: params.get('email') || '' } })
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const token = params.get('token') || ''

  const onSubmit = async (data) => {
    try {
      await axios.post(import.meta.env.VITE_API_BASE + '/auth/reset-password', { email: data.email, token, password: data.password })
      setNotif({ show: true, message: 'Password reset successful. Please login.', type: 'success' })
      setTimeout(()=> navigate('/login'), 1200)
    } catch {
      setNotif({ show: true, message: 'Invalid or expired link', type: 'error' })
    }
  }

  const pwd = watch('password')

  return (
    <div className="max-w-md mx-auto card">
      <Notification {...notif} onClose={() => setNotif(n => ({ ...n, show: false }))} />
      <h1 className="text-xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input className="w-full p-3 rounded-xl border" placeholder="Email" type="email" {...register('email', { required: true })} />
        <div className="relative">
          <input
            className="w-full p-3 rounded-xl border pr-12"
            placeholder="New password"
            type={showPass ? 'text' : 'password'}
            {...register('password', { required: true, minLength: 6 })}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-amber-700"
            aria-label={showPass ? 'Hide password' : 'Show password'}
            title={showPass ? 'Hide password' : 'Show password'}
            onClick={() => setShowPass(s => !s)}
          >
            {showPass ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 15.338 6.828 18.25 12 18.25c1.57 0 2.973-.262 4.209-.73" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.228 6.228C7.79 5.287 9.744 4.75 12 4.75c5.172 0 8.774 2.912 10.066 6.25-.43 1.142-1.108 2.23-2.011 3.17M3 3l18 18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 9.88a3.25 3.25 0 104.24 4.24" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.75 12 4.75c4.64 0 8.577 2.76 9.964 6.928.07.214.07.43 0 .644C20.577 16.49 16.64 19.25 12 19.25c-4.64 0-8.577-2.76-9.964-6.928z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>
        </div>
        <div className="relative">
          <input
            className="w-full p-3 rounded-xl border pr-12"
            placeholder="Confirm password"
            type={showConfirm ? 'text' : 'password'}
            {...register('confirm', { validate: v => v === pwd || 'Passwords do not match' })}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-amber-700"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
            title={showConfirm ? 'Hide password' : 'Show password'}
            onClick={() => setShowConfirm(s => !s)}
          >
            {showConfirm ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 15.338 6.828 18.25 12 18.25c1.57 0 2.973-.262 4.209-.73" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.228 6.228C7.79 5.287 9.744 4.75 12 4.75c5.172 0 8.774 2.912 10.066 6.25-.43 1.142-1.108 2.23-2.011 3.17M3 3l18 18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 9.88a3.25 3.25 0 104.24 4.24" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.75 12 4.75c4.64 0 8.577 2.76 9.964 6.928.07.214.07.43 0 .644C20.577 16.49 16.64 19.25 12 19.25c-4.64 0-8.577-2.76-9.964-6.928z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>
        </div>
        <button className="btn btn-primary w-full" type="submit">Update Password</button>
      </form>
    </div>
  )
}
