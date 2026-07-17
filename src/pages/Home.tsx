import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../utils/useProducts'
import ProductCard from '../components/ProductCard'
import { FiArrowRight } from 'react-icons/fi'

const categoryImages: Record<string, string> = {
  Dresses: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
  Jackets: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
  Shirts:  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
  Accessories: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
}
const categoryNames = ['Dresses', 'Jackets', 'Shirts', 'Accessories']

export default function Home() {
  const { products, loading } = useProducts()
  const bestsellers = products.filter(p => p.badge === 'Bestseller').slice(0, 4)
  const newArrivals = products.filter(p => p.badge === 'New').slice(0, 4)

  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [subMessage, setSubMessage] = useState('')

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubStatus('loading')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Something went wrong.')
      setSubStatus('success')
      setSubMessage(data.message || 'Subscribed successfully!')
      setEmail('')
    } catch (err: any) {
      setSubStatus('error')
      setSubMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=90)` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 md:pb-28 w-full">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4 animate-fade-up">New Collection 2025</p>
          <h1 className="font-display text-6xl md:text-8xl font-light text-white leading-none mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Elevate<br />Your Style
          </h1>
          <p className="text-white/70 text-base md:text-lg mb-10 max-w-md font-body font-light animate-fade-up" style={{ animationDelay: '200ms' }}>
            Discover exclusive fashion that blends African elegance with contemporary luxury.
          </p>
          <div className="flex gap-4 flex-wrap animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Link to="/shop" className="btn-primary">Explore Collection</Link>
            <Link to="/about" className="border border-white text-white text-sm tracking-widest uppercase px-8 py-3 hover:bg-white hover:text-black transition-all duration-300">Our Story</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="section-title">Shop by<br />Category</h2>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase text-gray-500 hover:text-gold transition-colors">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryNames.map((cat, i) => (
            <Link key={cat} to={`/shop?category=${cat}`}
              className="group relative overflow-hidden aspect-[3/4]" style={{ animationDelay: `${i * 100}ms` }}>
              <img src={categoryImages[cat]} alt={cat} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-end p-5">
                <div>
                  <p className="text-white font-display text-2xl font-light">{cat}</p>
                  <p className="text-gold text-xs tracking-widest uppercase mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop <FiArrowRight size={12} />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      {(loading || bestsellers.length > 0) && (
        <section className="bg-[#f5f0eb] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
              <h2 className="section-title">Bestsellers</h2>
              <Link to="/shop" className="text-xs tracking-widest uppercase text-gray-500 hover:text-gold transition-colors flex items-center gap-2">See All <FiArrowRight size={14} /></Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse"><div className="bg-gray-200 aspect-[3/4]" /><div className="h-3 bg-gray-200 mt-4 w-1/2" /></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {bestsellers.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Banner */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80)` }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-6">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Limited Time</p>
          <h2 className="font-display text-5xl md:text-6xl font-light mb-6">New Season.<br />New You.</h2>
          <p className="text-white/70 mb-10 font-body font-light">Fresh arrivals from our latest collection are here.</p>
          <Link to="/shop" className="btn-primary">Shop New Arrivals</Link>
        </div>
      </section>

      {/* New Arrivals */}
      {(loading || newArrivals.length > 0) && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/shop" className="text-xs tracking-widest uppercase text-gray-500 hover:text-gold transition-colors flex items-center gap-2">View All <FiArrowRight size={14} /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse"><div className="bg-gray-200 aspect-[3/4]" /><div className="h-3 bg-gray-200 mt-4 w-1/2" /></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {newArrivals.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-black text-white py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Stay Connected</p>
          <h2 className="font-display text-4xl font-light mb-4">Join the Atelier</h2>
          <p className="text-gray-400 text-sm mb-8 font-body">Get exclusive access to new collections and special offers.</p>
          <form onSubmit={handleSubscribe} className="flex gap-0 border border-gray-700">
            <input type="email" placeholder="Your email address" value={email}
              onChange={e => setEmail(e.target.value)} required
              className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none" />
            <button type="submit" disabled={subStatus === 'loading'}
              className="bg-gold text-black px-6 py-3 text-xs tracking-widest uppercase font-medium hover:bg-gold-dark transition-colors disabled:opacity-60">
              {subStatus === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
          {subMessage && (
            <p className={`mt-4 text-sm ${subStatus === 'error' ? 'text-red-400' : 'text-gold'}`}>{subMessage}</p>
          )}
        </div>
      </section>
    </div>
  )
}
