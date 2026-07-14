import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct, useProducts } from '../utils/useProducts'
import { useCart } from '../context/CartContext'
import Toast from '../components/Toast'
import ProductCard from '../components/ProductCard'
import { FiArrowLeft, FiShoppingBag, FiCheck } from 'react-icons/fi'

export default function ProductDetail() {
  const { id } = useParams()
  const { product, loading } = useProduct(id)
  const { products } = useProducts()
  const { addToCart } = useCart()
  const [toast, setToast] = useState('')
  const [activeImg, setActiveImg] = useState(0)

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="animate-pulse text-gray-300 font-display text-3xl">Loading...</div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="font-display text-3xl text-gray-400">Product not found</p>
      <Link to="/shop" className="mt-6 text-xs tracking-widest uppercase text-gold hover:underline">← Back to Shop</Link>
    </div>
  )

  const related = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4)

  const handleAdd = () => {
    addToCart(product)
    setToast('Added to cart!')
    setTimeout(() => setToast(''), 2000)
  }

  const allImages = product.images?.length ? product.images : [product.image]

  return (
    <div className="min-h-screen pt-24">
      {toast && <Toast message={toast} />}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gray-500 hover:text-gold transition-colors mb-10">
          <FiArrowLeft size={14} /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="flex gap-4">
            {allImages.length > 1 && (
              <div className="flex flex-col gap-3 w-20">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`aspect-square overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-gold' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 aspect-[3/4] overflow-hidden bg-gray-100">
              <img src={allImages[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex flex-col">
            {product.badge && (
              <span className="self-start bg-gold text-black text-[10px] font-medium tracking-widest uppercase px-2 py-1 mb-4">{product.badge}</span>
            )}
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">{product.category}</p>
            <h1 className="font-display text-4xl md:text-5xl font-light leading-tight mb-4">{product.name}</h1>
            <p className="text-2xl font-body font-medium text-gray-900 mb-6">₦{product.price.toLocaleString()}</p>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 font-body">{product.description}</p>

            {!product.inStock ? (
              <div className="border border-gray-200 text-gray-400 text-xs tracking-widest uppercase py-4 text-center mb-8">Out of Stock</div>
            ) : (
              <button onClick={handleAdd} className="btn-primary flex items-center justify-center gap-3 mb-8 w-full md:w-auto">
                <FiShoppingBag size={16} /> Add to Cart
              </button>
            )}

            {product.details?.length > 0 && (
              <div className="border-t border-gray-100 pt-6">
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">Product Details</p>
                <ul className="flex flex-col gap-2">
                  {product.details.map((d, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-body">
                      <FiCheck size={13} className="text-gold shrink-0" /> {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="section-title mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}