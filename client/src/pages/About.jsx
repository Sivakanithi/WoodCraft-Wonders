import { photos } from '../assets'

export default function About() {
  const owners = [
    { name: 'srinivasarao', role: 'Founder & Master Carpenter', img: photos.owners.srinivasarao },
    { name: 'sankarachari', role: 'Co-Founder & Designer', img: photos.owners.sankarachari },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-16 px-4 py-10 bg-white/80 rounded-2xl shadow-lg">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-amber-900 drop-shadow-lg tracking-tight">About WoodCraft Wonders</h1>
        <p className="text-xl text-stone-700 mb-8">With over 20 years of experience, our workshop is a trusted name in custom woodwork and furniture design in Chennai and beyond. We blend traditional craftsmanship with modern techniques to deliver unique, durable, and beautiful pieces for homes and businesses.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-3 text-amber-800">Our Journey</h2>
          <p className="text-lg mb-4">Founded by Siva Kanithi, a master carpenter with a passion for woodwork since childhood, our workshop started as a small family business. Over the years, we have grown into a team of skilled artisans and designers, taking on projects ranging from bespoke doors and wardrobes to luxury sofasets and office interiors.</p>
          <h2 className="text-2xl font-bold mt-8 mb-2 text-amber-800">What We Do</h2>
          <ul className="list-disc pl-6 text-lg text-stone-700">
            <li>Custom doors, cupboards, and wardrobes</li>
            <li>Designer sofasets, chairs, and tables</li>
            <li>Modular kitchens and storage solutions</li>
            <li>Office and commercial woodwork</li>
            <li>Restoration and repair of antique furniture</li>
            <li>Custom designs for unique spaces</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <img
            src={photos.category?.Doors || 'https://images.pexels.com/photos/277667/pexels-photo-277667.jpeg?auto=compress&cs=tinysrgb&w=600'}
            alt="Custom Door"
            className="gallery-img shadow-xl"
            loading="lazy"
          />
          <img
            src={photos.category?.Cupboards || 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80'}
            alt="Cupboard"
            className="gallery-img shadow-xl"
            loading="lazy"
          />
          <img
            src={photos.category?.['Sofa Sets'] || photos.category?.Sofasets || 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=600&q=80'}
            alt="Sofa Set"
            className="gallery-img shadow-xl"
            loading="lazy"
          />
        </div>
      </div>
      <div className="my-10">
        <h2 className="text-3xl font-bold mb-3 text-amber-800">Our Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <img src={photos.home?.heroBg || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'} alt="Wooden Hall" className="gallery-img shadow-xl" loading="lazy" />
          <img src={photos.home?.worksCard || 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80'} alt="Wooden Table" className="gallery-img shadow-xl" loading="lazy" />
          <img src={photos.home?.contactCard || 'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=600&q=80'} alt="Wooden Interior" className="gallery-img shadow-xl" loading="lazy" />
        </div>
        <p className="text-lg text-stone-700 mt-6">Every project is a collaboration with our clients, ensuring their vision and needs are at the heart of every piece we create. Our attention to detail, use of premium materials, and commitment to customer satisfaction set us apart.</p>
      </div>
      <div className="my-10">
        <h2 className="text-3xl font-bold mb-3 text-amber-800">Why Choose Us?</h2>
        <ul className="list-disc pl-6 text-lg text-stone-700">
          <li>20+ years of experience</li>
          <li>Skilled, passionate team</li>
          <li>Premium, sustainable materials</li>
          <li>On-time delivery and transparent pricing</li>
          <li>Personalized service and aftercare</li>
        </ul>
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-4 text-amber-900">Meet Our Owners</h2>
        <div className="flex flex-wrap justify-center gap-6">
      {owners.map(owner => (
            <div key={owner.name} className="owner-card">
              <div className="mt-6 md:mt-10 w-40 md:w-48 aspect-square rounded-xl overflow-hidden bg-stone-100">
                <img
                  src={(typeof owner.img === 'string' && (owner.img.startsWith('http') || owner.img.startsWith('/'))) ? owner.img : (owner.img ? owner.img : '')}
                  alt={owner.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a placeholder if the provided path doesn't exist
                    e.currentTarget.onerror = null
                    e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Photo'
                  }}
                />
              </div>
              <div className="font-bold mt-2 text-lg">{owner.name}</div>
              <div className="text-sm text-stone-600">{owner.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
