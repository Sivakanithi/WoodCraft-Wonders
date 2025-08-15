// Centralized category image mapping for easy customization across the app
// Tip: You can switch these URLs to local assets by importing from '../assets'
import { photos } from './assets'
export const categoryImages = {
  Doors: photos.category?.Doors || photos.category?.doors || 'https://images.pexels.com/photos/277667/pexels-photo-277667.jpeg?auto=compress&cs=tinysrgb&w=400', // wooden plank front door
  Cupboards: photos.category?.Cupboards || photos.category?.cupboards || 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
  'Sofa Sets': photos.category?.['Sofa Sets'] || photos.category?.Sofasets || photos.category?.SofaSets || 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=400&q=80',
  'Chairs & Tables': photos.category?.['Chairs & Tables'] || photos.category?.Chairs || photos.category?.chairs || 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80',
  // Filled wooden items image for Custom Designs
  'Custom Designs': photos.category?.['Custom Designs'] || photos.category?.Custom || photos.category?.custom || 'https://images.pexels.com/photos/725678/pexels-photo-725678.jpeg?auto=compress&cs=tinysrgb&w=400',
}

export const categoriesList = Object.entries(categoryImages).map(([name, img]) => ({ name, img }))


