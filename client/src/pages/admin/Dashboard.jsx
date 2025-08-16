

import { useState } from 'react'
import { photos } from '../../assets'
import AdminProducts from './AdminProducts'
import AdminBookings from './AdminBookings'

export default function Dashboard() {
  const [tab, setTab] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const admin = JSON.parse(localStorage.getItem('user') || 'null')
  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
  <div className="max-w-6xl mx-auto py-2 sm:py-4 px-1 sm:px-0">
      <div className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur supports-[backdrop-filter]:bg-stone-50/70">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2 gap-2 sm:gap-4 relative">
          <div className="flex items-center gap-3">
            <img src={photos.gallery.logo || '/logo.jpg'} alt="Logo" className="w-9 h-9 rounded-full border-2 border-amber-600 bg-white object-cover" />
            <h1 className="text-lg sm:text-2xl font-bold text-amber-800">WoodCraft Wonders Admin</h1>
          </div>
          <nav className="flex flex-wrap gap-1 rounded-lg border bg-white p-1 shadow w-full sm:w-auto justify-center sm:justify-end">
            {['home','products','bookings','profile'].map(k => (
              <button key={k} onClick={()=>setTab(k)}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm capitalize ${tab===k? 'bg-amber-600 text-white shadow': 'text-stone-700 hover:bg-stone-100'}`}>
                {k}
              </button>
            ))}
          </nav>
          <div className="relative">
            <button onClick={()=>setMenuOpen(m=>!m)} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-stone-100">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                {(admin?.name || admin?.email || '?').charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:block text-sm max-w-[140px] truncate">{admin?.name || admin?.email}</span>
              <svg className="w-4 h-4 text-stone-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-xl p-4 z-50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    {(admin?.name || admin?.email || '?').charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div className="font-semibold leading-tight">{admin?.name || 'Admin'}</div>
                    <div className="text-xs text-stone-600">{admin?.email}</div>
                  </div>
                </div>
                <button className="btn w-full" onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {tab==='home' && (
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border-4 border-amber-700 shadow-xl">
            {/* Full-cover background */}
            <img
              src="https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&w=1600&q=60"
              alt="Wood background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-amber-900/20" />
            {/* Foreground content */}
            <div className="relative p-8 sm:p-12">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-700 shadow bg-white overflow-hidden flex items-center justify-center">
                    <img src={photos.gallery.logo || '/logo.jpg'} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-50 drop-shadow">
                  WoodCraft Wonders
                </h2>
                <p className="mt-2 text-amber-50/90 max-w-2xl">
                  Welcome, Admin! Manage your catalog and customer bookings with ease. Use the navigation above to switch between sections.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  <div className="rounded-xl bg-white/90 border border-amber-200 p-4 text-center">
                    <div className="text-sm text-stone-500">Section</div>
                    <div className="font-semibold">Products</div>
                  </div>
                  <div className="rounded-xl bg-white/90 border border-amber-200 p-4 text-center">
                    <div className="text-sm text-stone-500">Section</div>
                    <div className="font-semibold">Bookings</div>
                  </div>
                  <div className="rounded-xl bg-white/90 border border-amber-200 p-4 text-center">
                    <div className="text-sm text-stone-500">Section</div>
                    <div className="font-semibold">Profile</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
