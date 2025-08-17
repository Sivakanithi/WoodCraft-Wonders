
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { API_BASE } from '../api'
import { useForm } from 'react-hook-form'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    axios.get(API_BASE + '/products/' + id).then(r => setProduct(r.data))
  }, [id])

  const onSubmit = async (data) => {
    try {
      data.productId = id
  await axios.post(API_BASE + '/bookings', data)
      alert('Booking submitted! We will contact you soon.')
      reset()
    } catch (e) {
      console.error(e)
      alert('Booking failed.')
    }
  }

  if (!product) return <div>Loading...</div>

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="card">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="rounded-xl w-full object-cover"
          onError={(e)=>{ e.currentTarget.src = 'https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&w=1200&q=60' }}
        />
        <h1 className="text-2xl font-bold mt-3">{product.title}</h1>
        <p className="text-stone-700 mt-2">{product.description}</p>
        <div className="mt-2 text-sm">Dimensions: {product.dimensions || 'N/A'}</div>
        <div className="mt-2 font-semibold text-brand-700">₹ {product.price}</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <h2 className="text-xl font-bold mb-4">Book this item</h2>
        <input className="w-full mb-3 p-3 rounded-xl border" placeholder="Your Name" {...register('name', { required: true })} />
        <input className="w-full mb-3 p-3 rounded-xl border" placeholder="Email" type="email" {...register('email', { required: true })} />
        <input className="w-full mb-3 p-3 rounded-xl border" placeholder="Phone Number" {...register('phone', { required: true })} />
        <textarea className="w-full mb-3 p-3 rounded-xl border" placeholder="Message / Requirements" rows={4} {...register('message')} />
        <button className="btn btn-primary" type="submit">Submit Booking</button>
      </form>
    </div>
  )
}
