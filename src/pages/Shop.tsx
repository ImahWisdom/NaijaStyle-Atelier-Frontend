import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories } from '../data/products'
import { useProducts } from '../utils/useProducts'
import ProductCard from '../components/ProductCard'
import { FiFilter, FiX } from 'react-icons/fi'

const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Name A–Z']

export default function Shop() {
  const { products, loading, error } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCat = searchParams.get('category') || 'All'
  const [selectedCategory, setSelectedCategory] = useState(initialCat)
  const [sort, setSort] = useState('Featured')
  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = selectedCategory === 'All' ? [...products] : products.filter(p => p.category === selectedCategory)
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'Price: Low to High') list.sort((a, b) => a.price - b.price)
    else if (sort === 'Price: High to Low') list.sort((a, b) => b.price - a.price)
    else if (sort === 'Name A–Z') list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [products, selectedCategory, sort, search])

  const selectCategory = (cat: string) => {
    setSelectedCategory(cat)
    setSearchParams(cat === 'All' ? {} : { category: cat })
    setFiltersOpen(false)
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="bg-[#f5f0eb] py-14 text-center">
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Explore</p>
        <h1 className="section-title">Our Collection</h1>
        <p className="text-gray-500 mt-4 text-sm font-body">{loading ? '...' : `${filtered.length} pieces`}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <input
            type="text" placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-b border-gray-300 bg-transparent py-2 px-0 text-sm w-full md:w-64 focus:outline-none focus:border-gold transition-colors placeholder-gray-400"
          />
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="md:hidden flex items-center gap-2 text-xs tracking-widest uppercase border border-gray-300 px-4 py-2">
              <FiFilter size={13} /> Filters
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="border-b border-gray-300 bg-transparent py-2 text-xs tracking-wide uppercase focus:outline-none focus:border-gold cursor-pointer ml-auto">
              {sortOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-10">
          <aside className="hidden md:block w-44 shrink-0">
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-5">Categories</p>
            <div className="flex flex-col gap-3">
              {categories.map(cat => (
                <button key={cat} onClick={() => selectCategory(cat)}
                  className={`text-left text-sm font-body transition-colors ${selectedCategory === cat ? 'text-gold font-medium' : 'text-gray-600 hover:text-black'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {filtersOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-64 bg-white p-8 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <p className="text-xs tracking-widest uppercase">Categories</p>
                  <button onClick={() => setFiltersOpen(false)}><FiX /></button>
                </div>
                {categories.map(cat => (
                  <button key={cat} onClick={() => selectCategory(cat)}
                    className={`block text-left w-full py-3 text-sm border-b border-gray-100 transition-colors ${selectedCategory === cat ? 'text-gold font-medium' : 'text-gray-600'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[3/4] w-full mb-4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-400">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg font-display">No products found</p>
                <button onClick={() => { setSearch(''); selectCategory('All') }} className="mt-4 text-xs tracking-widest uppercase text-gold hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
                {filtered.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
