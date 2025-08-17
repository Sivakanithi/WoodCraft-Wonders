import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../../api'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [broken, setBroken] = useState({}) // track image load failures by product id
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'Doors', dimensions: '', imageUrl: '' })
  const token = localStorage.getItem('token')
  const CLD_CLOUD = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const CLD_PRESET = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  function load() {
    axios.get(API_BASE + '/products').then(r => setProducts(r.data))
  }

  useEffect(() => { load() }, [])

  async function addProduct(e) {
    e.preventDefault()
    try {
      const file = e.target.image.files && e.target.image.files[0]
      // If Cloudinary config exists and a file is chosen, upload directly to Cloudinary
      if (file && CLD_CLOUD && CLD_PRESET) {
        const up = new FormData()
        up.append('file', file)
        up.append('upload_preset', CLD_PRESET)
        const resp = await fetch(`https://api.cloudinary.com/v1_1/${CLD_CLOUD}/image/upload`, { method: 'POST', body: up })
        const data = await resp.json()
        if (!resp.ok || !data.secure_url) {
          throw new Error(data.error?.message || 'Cloudinary upload failed')
        }
        const payload = { ...form, imageUrl: data.secure_url }
        await axios.post(API_BASE + '/products', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        // Fallback: send multipart to our API (dev/local usage)
        const fd = new FormData()
        // Normalize Google Drive links to direct file URL if user pasted a viewer link
        let normalized = { ...form }
        const driveMatch = /https?:\/\/drive\.google\.com\/file\/d\/([^/]+)\//i.exec(normalized.imageUrl || '')
        if (driveMatch) {
          normalized.imageUrl = `https://drive.google.com/uc?id=${driveMatch[1]}`
        }
        Object.entries(normalized).forEach(([k,v]) => fd.append(k, v))
        if (file) fd.append('image', file)
        await axios.post(API_BASE + '/products', fd, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setForm({ title: '', description: '', price: '', category: 'Doors', dimensions: '', imageUrl: '' })
      e.target.reset()
      load()
      alert('Product added')
    } catch (err) {
      console.error(err); alert('Failed to add')
    }
  }

  async function remove(id) {
    if (!confirm('Delete?')) return
  await axios.delete(API_BASE + '/products/' + id, {
      headers: { Authorization: `Bearer ${token}` }
    })
    load()
  }

  return (
    <div>
      <form onSubmit={addProduct} className="card" encType="multipart/form-data">
        <h3 className="text-lg font-semibold mb-4">Add Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="text-sm text-stone-600">Title</label>
            <input className="mt-1 p-3 rounded-xl border w-full" placeholder="Elegant teak door" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          </div>
          <div>
            <label className="text-sm text-stone-600">Price</label>
            <input className="mt-1 p-3 rounded-xl border w-full" placeholder="₹ 15000" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
          </div>
          <div>
            <label className="text-sm text-stone-600">Dimensions</label>
            <input className="mt-1 p-3 rounded-xl border w-full" placeholder="6ft x 3ft" value={form.dimensions} onChange={e=>setForm({...form, dimensions:e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-stone-600">Category</label>
            <select className="mt-1 p-3 rounded-xl border w-full" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
              {['Doors','Cupboards','Sofa Sets','Chairs & Tables','Custom Designs'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-stone-600">Description</label>
            <textarea className="mt-1 p-3 rounded-xl border w-full" rows={3} placeholder="Short description about the product" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-stone-600">Image</label>
            <input type="file" name="image" className="mt-1 w-full" accept="image/*" />
            <div className="text-xs text-stone-500 mt-1">Or paste an image URL below (direct URL recommended). For Google Drive, paste the share link; we’ll try to convert it.</div>
            <input
              className="mt-2 p-3 rounded-xl border w-full"
              placeholder="https://example.com/image.jpg or Google Drive link"
              value={form.imageUrl}
              onChange={e=>setForm({...form, imageUrl:e.target.value})}
            />
            {(CLD_CLOUD && CLD_PRESET) ? (
              <div className="text-[11px] text-green-700 mt-1">Uploads will be stored on Cloudinary (free tier supported).</div>
            ) : (
              <div className="text-[11px] text-amber-700 mt-1">Tip: Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in client env to store files persistently without a server disk.</div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="btn btn-primary" type="submit">Add Product</button>
        </div>
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Products</h2>
  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {products.map(p => (
            <div key={p._id} className="card">
              <div className="h-28 sm:h-32 rounded-xl overflow-hidden bg-stone-100 mb-2 flex items-center justify-center">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    className="object-cover w-full h-full"
                    onError={(e)=>{ setBroken(b=>({...b,[p._id]:true})); e.currentTarget.src='https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&w=800&q=60' }}
                  />
                ) : 'No Image'}
              </div>
              <div className="font-bold">{p.title}</div>
              <div className="text-sm text-stone-600">{p.category}</div>
              <div className="mt-2">₹ {p.price}</div>
              {p.imageUrl && (
                <div className="mt-2 text-xs break-all">
                  <span className="text-stone-500">Image URL: </span>
                  <a className="text-amber-700 hover:underline" href={p.imageUrl} target="_blank" rel="noreferrer">{p.imageUrl}</a>
                  {broken[p._id] && <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">not reachable</span>}
                </div>
              )}
              <button onClick={()=>remove(p._id)} className="btn mt-2">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
