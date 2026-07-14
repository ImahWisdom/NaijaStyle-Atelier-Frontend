import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'
import { Product } from '../data/products'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

interface Props { product: Product; index?: number }

export default function ProductCard({ product, index = 0 }: Props) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group relative card-hover" style={{ animationDelay: `${index * 80}ms` }}>
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
          <img src={product.image} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-gold text-black text-[10px] font-medium tracking-widest uppercase px-2 py-1">{product.badge}</span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-xs tracking-widest uppercase text-gray-500">Out of Stock</span>
            </div>
          )}
          {product.inStock && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button onClick={handleAdd}
                className="w-full bg-black text-white text-xs tracking-widest uppercase py-3 flex items-center justify-center gap-2 hover:bg-gold hover:text-black transition-colors">
                <FiShoppingBag size={14} /> {added ? 'Added!' : 'Quick Add'}
              </button>
            </div>
          )}
        </div>
        <div className="pt-4 pb-2">
          <p className="text-[11px] tracking-widest uppercase text-gray-400 mb-1">{product.category}</p>
          <h3 className="font-display text-lg font-light text-gray-900 group-hover:text-gold transition-colors leading-tight">{product.name}</h3>
          <p className="mt-1 text-sm font-body font-medium text-gray-800">₦{product.price.toLocaleString()}</p>
        </div>
      </Link>
    </div>
  )
}