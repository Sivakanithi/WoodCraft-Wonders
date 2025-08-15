// Centralized asset imports.
// How to use:
// 1) Drop images into this folder.
// 2) Import them below and assign to the maps.
// 3) In components, import { photos } from '../assets' and use photos.owners.NAME etc.

// Owners (About page)
// Replace these imports with your actual files once added
// Example: import nanna from './nanna.jpg'

// Auto-import available images from this folder
// This avoids build failures if some files are missing.
const imageMap = import.meta.glob('./**/*.{png,jpg,jpeg,webp,svg}', { eager: true, import: 'default' })

// Helper to pick the first existing image from candidates
function pick(...candidates) {
  for (const key of candidates) {
    if (key in imageMap) return imageMap[key]
  }
  return undefined
}

export const ownersPhotos = {
  srinivasarao: pick('./nanna.jpg', './owner-nanna.jpg'),
  sankarachari: pick('./babai.jpg', './sankar.jpg', './owner-sankar.jpg'),
}

// Category or gallery photos can be mapped here too if you want to centralize further
export const galleryPhotos = {
  // door1: someDoorImage,
  // custom1: someCustomImage,
  logo: pick('./logo.jpg', './logo.png', './logo.svg'),
}

// Centralized category images (auto-detected if files exist)
export const categoryPhotos = {
  Doors: pick('./doors.jpg', './Doors.jpg', './door.jpg'),
  Cupboards: pick('./cupboard.jpg', './Cupboards.jpg', './wardrobe.jpg'),
  Sofasets: pick('./Sofaset.jpg', './sofaset.jpg', './sofa-sets.jpg', './sofas.jpg'),
  Chairs: pick('./Chairs.jpg', './chairs.jpg', './chairs-tables.jpg'),
  Custom: pick('./Custom Designs.jpg', './custom-designs.jpg', './custom.jpg'),
  // Aliases matching UI category names
  'Sofa Sets': pick('./Sofaset.jpg', './sofaset.jpg', './sofa-sets.jpg', './sofas.jpg'),
  'Chairs & Tables': pick('./Chairs.jpg', './chairs.jpg', './chairs-tables.jpg'),
  'Custom Designs': pick('./Custom Designs.jpg', './custom-designs.jpg', './custom.jpg'),
}

export const photos = {
  owners: ownersPhotos,
  gallery: galleryPhotos,
  category: categoryPhotos,
  // Home page images: replace with local imports when you have files
  // Example:
  // import heroBg from './hero.jpg'
  // import homeWorks from './home-works.jpg'
  // import homeContact from './home-contact.jpg'
  // Then set: home: { heroBg, worksCard: homeWorks, contactCard: homeContact }
  home: {
    heroBg: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    worksCard: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80',
    contactCard: 'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=400&q=80',
  },
}
