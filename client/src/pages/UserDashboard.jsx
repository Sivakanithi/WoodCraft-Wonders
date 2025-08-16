import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../api'

function ProfileSection({ bookings, onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <div className="mb-4">
        <div className="text-sm text-stone-600">Name</div>
        <div className="font-medium">{user?.name || '-'}</div>
      </div>
      <div className="mb-4">
        <div className="text-sm text-stone-600">Email</div>
        <div className="font-medium">{user?.email}</div>
      </div>
      <div className="mb-4">
        <div className="text-sm text-stone-600">Orders</div>
        <div className="font-medium">{bookings.length}</div>
      </div>
      <button className="btn" onClick={onLogout}>Logout</button>
    </div>
  )
}

export default function UserDashboard() {
  const [bookings, setBookings] = useState([])
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')
  const [tab, setTab] = useState('dashboard')

  useEffect(() => {
      if (!user) return
      axios.get(API_BASE + '/bookings/user', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setBookings(r.data))
  }, [user, token])

  if (!user) return <div className="card max-w-md mx-auto">Please login to view your dashboard.</div>

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
  <div className="max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-0">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.name || user.email}</h1>
      <div className="flex flex-col xs:flex-row gap-2 xs:gap-4 mb-4 sm:mb-6">
        <button className={`btn ${tab==='dashboard'?'btn-primary':''}`} onClick={()=>setTab('dashboard')}>Dashboard</button>
        <button className={`btn ${tab==='profile'?'btn-primary':''}`} onClick={()=>setTab('profile')}>Profile</button>
      </div>

      {tab==='dashboard' && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Your Orders</h2>
          {bookings.length === 0 ? (
            <div className="text-stone-400">No orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[400px] w-full text-xs sm:text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id} className="border-t">
                      <td className="p-2">{b.productId?.title || '-'}</td>
                      <td className="p-2">{b.status}</td>
                      <td className="p-2">{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab==='profile' && (
        <ProfileSection bookings={bookings} onLogout={logout} />
      )}
    </div>
  )
}
