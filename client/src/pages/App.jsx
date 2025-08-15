

import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-center bg-cover bg-fixed" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80)'}}>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
