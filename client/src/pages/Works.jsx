
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../api'
import { Link } from 'react-router-dom'
import { categoryImages } from '../categoryImages'

export default function Works() {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
  axios.get(API_BASE + '/products').then(r => setProducts(r.data))
  }, [])

  // Category images
  const categories = Object.keys(categoryImages)

  // For 2 categories per row
  const categoryRows = []
  for (let i = 0; i < categories.length; i += 2) {
    categoryRows.push(categories.slice(i, i + 2))
  }

  const filteredProducts = products.filter(p => p.category === selectedCategory)

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-2 text-amber-900">Our Works</h1>
      <p className="mb-8 text-lg text-stone-700">Discover our craftsmanship: Explore a variety of custom wooden products, each with unique styles and details, available for booking. Your request will be reviewed by our admin and you’ll receive a confirmation email upon approval.</p>

      {/* Category selector or back button */}
      {selectedCategory === null ? (
  <div className="mb-8 flex flex-col gap-2 sm:gap-4">
          {categoryRows.map((row, idx) => (
            <div key={idx} className="flex flex-col xs:flex-row gap-2 sm:gap-8 justify-center items-center">
              {row.map((cat, i) => (
                <div
                  key={cat}
                  className="relative flex flex-col items-center justify-center w-full xs:w-[220px] sm:w-[320px] md:w-[400px] h-[220px] sm:h-[320px] md:h-[400px] rounded-2xl border-4 shadow-xl transition-all duration-150 overflow-hidden p-0 bg-white border-stone-200 hover:border-amber-400 mb-2 xs:mb-0 cursor-pointer"
                  role="button"
                  aria-label={`View ${cat}`}
                  tabIndex={0}
                  onClick={() => setSelectedCategory(cat)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedCategory(cat) }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <img src={categoryImages[cat]} alt={cat} className="object-cover w-full h-full" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full flex justify-center">
                    <span className="font-semibold text-amber-900 text-base sm:text-xl bg-white/90 px-2 sm:px-6 py-2 sm:py-3 rounded-t-xl shadow-lg w-full text-center border-t-2 border-amber-300">{cat}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {/* Back button for category view */}
      {selectedCategory !== null && (
        <button
          className="mb-6 px-6 py-2 rounded-lg bg-amber-100 text-amber-900 font-semibold shadow hover:bg-amber-200 transition"
          onClick={() => setSelectedCategory(null)}
        >
          ← Back to Categories
        </button>
      )}

      {/* Products for selected category */}
      {selectedCategory !== null && (
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <img src={categoryImages[selectedCategory]} alt={selectedCategory} className="w-16 h-16 object-cover rounded-xl shadow border-2 border-amber-300 bg-white" />
            <h2 className="text-2xl font-bold text-amber-800">{selectedCategory}</h2>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-stone-400 mb-4">No products in this category.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(p => (
                <div key={p._id} className="card flex flex-col items-center p-0 overflow-hidden">
                  <div className="w-full aspect-square bg-stone-100 flex items-center justify-center">
                    <img
                      src={p.imageUrl ? p.imageUrl : categoryImages[selectedCategory]}
                      alt={p.title}
                      className="object-cover w-full h-full"
                      onError={(e)=>{ e.currentTarget.src = categoryImages[selectedCategory]; }}
                    />
                  </div>
                  <div className="p-4 w-full flex flex-col flex-1">
                    <div className="font-bold text-lg mb-1 text-center">{p.title}</div>
                    <div className="text-sm text-stone-600 mb-2 text-center">{p.description}</div>
                    <div className="text-xs text-stone-500 mb-2 text-center">Style: {p.style || 'Standard'}</div>
                    <div className="mt-2 text-brand-700 font-semibold text-center">₹ {p.price}</div>
                    <div className="mt-3 flex gap-2 justify-center">
                      <Link to={`/product/${p._id}`} className="btn btn-primary">View & Book</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
