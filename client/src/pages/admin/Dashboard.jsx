

import { useState } from 'react'
import AdminProducts from './AdminProducts'
import AdminBookings from './AdminBookings'

export default function Dashboard() {
  const [tab, setTab] = useState('home')
  const admin = JSON.parse(localStorage.getItem('user') || 'null')
  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <div className="max-w-6xl mx-auto py-4">
      <div className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur supports-[backdrop-filter]:bg-stone-50/70">
        <div className="flex items-center justify-between py-3">
          <h1 className="text-2xl font-bold">Admin</h1>
          <nav className="flex items-center gap-1 rounded-lg border bg-white p-1 shadow">
            {['home','products','bookings','profile'].map(k => (
              <button key={k} onClick={()=>setTab(k)}
                className={`px-4 py-2 rounded-md text-sm capitalize ${tab===k? 'bg-amber-600 text-white shadow': 'text-stone-700 hover:bg-stone-100'}`}>
                {k}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {tab==='home' && (
        <div className="card">Welcome, Admin! Use the tabs to manage products and bookings.</div>
      )}
  {tab==='products' && <AdminProducts />}
  {tab==='bookings' && <AdminBookings />}
      {tab==='profile' && (
        <div className="card max-w-md">
          <h2 className="text-xl font-bold mb-4">Admin Profile</h2>
          <div className="mb-3">
            <div className="text-sm text-stone-600">Name</div>
            <div className="font-medium">{admin?.name || '-'}</div>
          </div>
          <div className="mb-4">
            <div className="text-sm text-stone-600">Email</div>
            <div className="font-medium">{admin?.email}</div>
          </div>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  )
}
