import { photos } from './assets'

export default function Footer() {
  return (
    <footer className="bg-stone-100 mt-10 pt-8 pb-4 border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <img src={photos.gallery.logo || '/logo.jpg'} alt="Tailored Carpenter Workshop Logo" className="w-10 h-10 rounded-full border-2 border-amber-300 bg-white object-cover" />
          <span className="font-bold text-lg text-brand-700">WoodCraft Wonders</span>
        </div>
        <nav className="flex gap-4 text-stone-600 text-sm">
          <a href="/" className="hover:text-brand-700">Home</a>
          <a href="/about" className="hover:text-brand-700">About</a>
          <a href="/works" className="hover:text-brand-700">Works</a>
          <a href="/contact" className="hover:text-brand-700">Contact</a>
        </nav>
        <div className="text-stone-500 text-xs text-center md:text-right">
          <div>1-136  Main Street, Rajulagumada, Andhra Pradesh, India</div>
          <div>Email: sivakanithi8848@gmail.com | Phone: +91 9494781431</div>
          <div>&copy; {new Date().getFullYear()} WoodCraft Wonders. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
