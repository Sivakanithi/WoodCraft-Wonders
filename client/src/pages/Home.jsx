
import { Link } from 'react-router-dom'
import { photos } from '../assets'
import { categoryImages, categoriesList } from '../categoryImages'

export default function Home() {
  const categories = categoriesList
  return (
    <div className="space-y-10">
      {/* Hero Section with Logo, App Name, and Wooden Background */}
  <section className="relative flex flex-col items-center justify-center min-h-[60vh] bg-center bg-cover rounded-2xl shadow-lg overflow-hidden" style={{backgroundImage: `url(${photos.home?.heroBg || photos.gallery?.heroBg || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'})`}}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-amber-900/60 z-0" />
        <div className="relative z-10 flex flex-col items-center text-center text-white py-16 px-4">
          <img src={photos.gallery.logo || '/logo.jpg'} alt="Tailored Carpenter Workshop Logo" className="w-20 h-20 mb-4 drop-shadow-lg rounded-full border-4 border-amber-300 bg-white object-cover" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2 drop-shadow-lg">WoodCraft Wonders</h1>
          <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-6 drop-shadow">Custom wooden furniture, doors, cupboards, sofasets, and more—crafted with passion and precision.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/works" className="btn btn-primary">See Our Works</Link>
            <Link to="/contact" className="btn">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* Scroll-down Cards Section */}
      <section className="grid md:grid-cols-2 gap-8 mt-10">
        <div className="card flex flex-col items-center justify-center text-center bg-amber-50">
          <img src={photos.home.worksCard} alt="Works" className="gallery-img mb-3" />
          <h2 className="text-xl font-bold mb-2">Our Works</h2>
          <p className="mb-4">Explore our portfolio of custom furniture and wooden creations, crafted for homes and businesses.</p>
          <Link to="/works" className="btn btn-primary">Browse Works</Link>
        </div>
        <div className="card flex flex-col items-center justify-center text-center bg-amber-50">
          <img src={photos.home.contactCard} alt="Contact" className="gallery-img mb-3" />
          <h2 className="text-xl font-bold mb-2">Contact Us</h2>
          <p className="mb-4">Have a project in mind? Get in touch for a free consultation and quote from our expert team.</p>
          <Link to="/contact" className="btn btn-primary">Contact</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4 mt-10">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c) => (
            <div key={c.name} className="card text-center">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-stone-100">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="font-medium">{c.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
