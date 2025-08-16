import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../../api'
import Notification from '../../Notification'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [products, setProducts] = useState([])
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' })
  const token = localStorage.getItem('token')

  function load() {
  axios.get(API_BASE + '/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setBookings(r.data))
  axios.get(API_BASE + '/products').then(r => setProducts(r.data))
  }

  useEffect(() => { load() }, [])

  async function handleAction(id, action) {
    try {
  await axios.patch(API_BASE + `/bookings/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      load()
      if (action === 'accept') {
        setNotif({ show: true, message: 'Booking accepted', type: 'success' })
      } else {
        setNotif({ show: true, message: 'Booking rejected', type: 'error' })
      }
    } catch (e) {
      setNotif({ show: true, message: 'Action failed', type: 'error' })
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this booking?')) return
    try {
  await axios.delete(API_BASE + '/bookings/' + id, {
        headers: { Authorization: `Bearer ${token}` }
      })
      load()
      setNotif({ show: true, message: 'Booking deleted', type: 'error' })
    } catch (e) {
      setNotif({ show: true, message: 'Delete failed', type: 'error' })
    }
  }

  function getProduct(productId) {
    return products.find(p => p._id === (productId && productId.toString && productId.toString())) || {}
  }

  return (
    <div className="card">
      <Notification {...notif} onClose={() => setNotif(n => ({ ...n, show: false }))} />
      <h2 className="text-xl font-bold mb-4">Bookings</h2>
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input className="p-2 rounded-lg border" placeholder="Search name or email" onChange={(e)=>{
          const q = e.target.value.toLowerCase();
          axios.get(API_BASE + '/bookings', { headers: { Authorization: `Bearer ${token}` }})
            .then(r => setBookings(r.data.filter(b => (b.name+b.email).toLowerCase().includes(q))))
        }} />
        <select className="p-2 rounded-lg border" onChange={(e)=>{
          const val = e.target.value
          axios.get(API_BASE + '/bookings', { headers: { Authorization: `Bearer ${token}` }})
            .then(r => setBookings(val==='all'? r.data : r.data.filter(b => b.status===val)))
        }}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button className="btn" onClick={load}>Reset</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="p-2">User Details</th>
              <th className="p-2">Order Details</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => {
              const prod = getProduct(b.productId)
              return (
                <tr key={b._id} className="border-t align-top">
                  <td className="p-2 whitespace-pre-line">
                    <b>Name:</b> {b.name}
                    <br /><b>Email:</b> {b.email}
                    {b.phone && (<><br /><b>Phone:</b> {b.phone}</>)}
                    {b.message && (<><br /><b>Message:</b> {b.message}</>)}
                  </td>
                  <td className="p-2 whitespace-pre-line">
                    <b>Product:</b> {prod.title || '-'}
                    <br /><b>Category:</b> {prod.category || '-'}
                    <br /><b>Price:</b> {prod.price ? `₹ ${prod.price}` : '-'}
                    {prod.dimensions && (<><br /><b>Dimensions:</b> {prod.dimensions}</>)}
                    {prod.description && (<><br /><b>Description:</b> {prod.description}</>)}
                  </td>
                  <td className="p-2">{b.status}</td>
                  <td className="p-2">
                    {b.status === 'pending' && (
                      <>
                        <button className="btn btn-primary mr-2" onClick={()=>handleAction(b._id, 'accept')}>Accept</button>
                        <button className="btn mr-2" onClick={()=>handleAction(b._id, 'reject')}>Reject</button>
                      </>
                    )}
                    <button className="btn btn-danger" onClick={()=>handleDelete(b._id)}>Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
