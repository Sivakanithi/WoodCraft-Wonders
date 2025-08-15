
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'
import { photos } from './assets'
export default function Navbar() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [menuOpen, setMenuOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onStorage = () => setUser(JSON.parse(localStorage.getItem('user') || 'null'))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Close profile menu on route change
  useEffect(() => {
    if (menuOpen) setMenuOpen(false)
  }, [location.pathname])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/'
  }

  async function toggleMenu() {
    const next = !menuOpen
    setMenuOpen(next)
    if (next && user && orders.length === 0) {
      try {
        setLoadingOrders(true)
        const token = localStorage.getItem('token')
        const r = await axios.get(import.meta.env.VITE_API_BASE + '/bookings/user', {
          headers: { Authorization: `Bearer ${token}` }
        })
        // show latest 3
        setOrders(r.data.slice(0,3))
      } catch (_) {
        setOrders([])
      } finally {
        setLoadingOrders(false)
      }
    }
  }

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
  <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
    <img src={photos.gallery.logo || '/logo.jpg'} alt="WoodCraft Wonders Logo" className="w-8 h-8 rounded-full border-2 border-amber-700 bg-white shadow object-cover" />
    <span style={{ fontFamily: 'serif', letterSpacing: '2px', textShadow: '1px 1px 2px #b8860b' }}>WoodCraft Wonders</span>
  </Link>
        <div className="flex gap-4 items-center relative">
          <Link to="/" className="hover:text-brand-600 transition">Home</Link>
          <Link to="/about" className="hover:text-brand-600 transition">About</Link>
          <Link to="/works" className="hover:text-brand-600 transition">Works</Link>
          <Link to="/contact" className="hover:text-brand-600 transition">Contact</Link>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="btn btn-primary ml-2">Admin</Link>}
              <button onClick={toggleMenu} className="ml-2 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  {(user.name || user.email || '?').charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:block max-w-[120px] truncate text-left">
                  {user.name || user.email}
                </span>
                <svg className="w-4 h-4 text-stone-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border rounded-xl shadow-xl p-4 z-50">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      {(user.name || user.email || '?').charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <div className="font-semibold leading-tight">{user.name || 'User'}</div>
                      <div className="text-xs text-stone-600">{user.email}</div>
                    </div>
                  </div>
                  <div className="border-t my-3"/>
                  <div className="mb-2 font-medium">Recent Orders</div>
                  <div className="max-h-48 overflow-auto -mx-1 px-1">
                    {loadingOrders ? (
                      <div className="text-sm text-stone-500">Loading…</div>
                    ) : orders.length === 0 ? (
                      <div className="text-sm text-stone-500">No orders yet.</div>
                    ) : (
                      orders.map(o => (
                        <div key={o._id} className="py-2 border-b last:border-none">
                          <div className="text-sm font-medium">{o.productId?.title || 'Product'}</div>
                          <div className="text-xs text-stone-600 flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ${o.status==='approved'?'bg-green-50 text-green-700 border-green-200':o.status==='rejected'?'bg-red-50 text-red-700 border-red-200':'bg-amber-50 text-amber-800 border-amber-200'}`}>{o.status}</span>
                            <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link to="/dashboard" className="btn btn-primary flex-1" onClick={()=>setMenuOpen(false)}>Dashboard</Link>
                    <button className="btn flex-1" onClick={logout}>Logout</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary ml-2">Login</Link>
              <Link to="/register" className="btn ml-2">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
