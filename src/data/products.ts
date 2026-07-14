// Types shared across frontend and admin
export type Product = {
  _id: string
  name: string
  category: string
  price: number
  image: string
  images: string[]
  description: string
  details: string[]
  badge?: string
  inStock: boolean
  createdAt?: string
}

export const categories = ['All', 'Dresses', 'Jackets', 'Shirts', 'Accessories']
