import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'Doors', dimensions: '' })
  const token = localStorage.getItem('token')

  function load() {
    axios.get(import.meta.env.VITE_API_BASE + '/products').then(r => setProducts(r.data))
  }

  useEffect(() => { load() }, [])

  async function addProduct(e) {
    e.preventDefault()
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k, v))
      if (e.target.image.files[0]) fd.append('image', e.target.image.files[0])
      await axios.post(import.meta.env.VITE_API_BASE + '/products', fd, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setForm({ title: '', description: '', price: '', category: 'Doors', dimensions: '' })
      e.target.reset()
      load()
      alert('Product added')
    } catch (err) {
      console.error(err); alert('Failed to add')
    }
  }

  async function remove(id) {
    if (!confirm('Delete?')) return
    await axios.delete(import.meta.env.VITE_API_BASE + '/products/' + id, {
      headers: { Authorization: `Bearer ${token}` }
    })
    load()
  }

  return (
    <div>
      <form onSubmit={addProduct} className="card grid md:grid-cols-2 gap-4" encType="multipart/form-data">
        <input className="p-3 rounded-xl border" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        <input className="p-3 rounded-xl border" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
        <input className="p-3 rounded-xl border" placeholder="Dimensions" value={form.dimensions} onChange={e=>setForm({...form, dimensions:e.target.value})} />
        <select className="p-3 rounded-xl border" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
          {['Doors','Cupboards','Sofa Sets','Chairs & Tables','Custom Designs'].map(c => <option key={c}>{c}</option>)}
        </select>
        <textarea className="p-3 rounded-xl border md:col-span-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
        <input type="file" name="image" className="md:col-span-2" accept="image/*" />
        <button className="btn btn-primary md:col-span-2" type="submit">Add Product</button>
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Products</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p._id} className="card">
              <div className="h-32 rounded-xl overflow-hidden bg-stone-100 mb-2 flex items-center justify-center">
                {p.imageUrl ? <img src={p.imageUrl} className="object-cover w-full h-full" /> : 'No Image'}
              </div>
              <div className="font-bold">{p.title}</div>
              <div className="text-sm text-stone-600">{p.category}</div>
              <div className="mt-2">₹ {p.price}</div>
              <button onClick={()=>remove(p._id)} className="btn mt-2">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
