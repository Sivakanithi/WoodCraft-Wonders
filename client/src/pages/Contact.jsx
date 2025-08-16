
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { API_BASE } from '../api'

export default function Contact() {
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = async (data) => {
    try {
  await axios.post(API_BASE + '/contact', data)
      alert('Message sent! We will get back to you soon.')
      reset()
    } catch (e) {
      console.error(e)
      alert('Failed to send. Try again later.')
    }
  }
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <h2 className="text-xl font-bold mb-4">Contact Us</h2>
        <input className="w-full mb-3 p-3 rounded-xl border" placeholder="Name" {...register('name', { required: true })} />
        <input className="w-full mb-3 p-3 rounded-xl border" placeholder="Email" type="email" {...register('email', { required: true })} />
        <input className="w-full mb-3 p-3 rounded-xl border" placeholder="Mobile" {...register('phone')} />
        <textarea className="w-full mb-3 p-3 rounded-xl border" placeholder="Message" rows={4} {...register('message', { required: true })} />
        <button className="btn btn-primary" type="submit">Send</button>
      </form>
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Find Us</h2>
  <p>1-136 Main Street, Rajulagumada, Vizianagaram District,<br />
  Andhra Pradesh, Pincode 532461</p>
        <div className="mt-4 rounded-xl overflow-hidden">
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=india&t=&z=5&ie=UTF8&iwloc=&output=embed"
            className="w-full h-64 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
