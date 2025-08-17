import { useForm } from 'react-hook-form'
import axios from 'axios'
import { API_BASE } from '../api'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Notification from '../Notification'

export default function Register() {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' })

  const onSubmit = async (data) => {
    try {
      await axios.post(API_BASE + '/auth/register', data)
      setNotif({ show: true, message: 'Registration successful! Please login.', type: 'success' })
      setTimeout(() => navigate('/login'), 1200)
    } catch (e) {
      setNotif({ show: true, message: 'Registration failed. Email may already be in use.', type: 'error' })
    }
  }
  return (
    <div className="max-w-md mx-auto card">
      <Notification {...notif} onClose={() => setNotif(n => ({ ...n, show: false }))} />
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input className="w-full p-3 rounded-xl border" placeholder="Name" {...register('name', { required: true })} />
        <input className="w-full p-3 rounded-xl border" placeholder="Email" type="email" {...register('email', { required: true })} />
        <input className="w-full p-3 rounded-xl border" placeholder="Password" type="password" {...register('password', { required: true })} />
        <button className="btn btn-primary w-full" type="submit">Register</button>
      </form>
      <p className="text-sm mt-4">Already have an account? <a href="/login" className="text-brand-700">Login</a></p>
    </div>
  )
}
