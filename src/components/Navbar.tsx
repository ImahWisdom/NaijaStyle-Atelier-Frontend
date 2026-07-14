import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiShoppingBag, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const { isLoggedIn, user, logout } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const navBase = isHome && !scrolled
    ? 'bg-transparent text-white'
    : 'bg-white text-black shadow-sm border-b border-gray-100'

  const linkClass = isHome && !scrolled
    ? 'text-white/80 hover:text-white'
    : 'text-gray-600 hover:text-black'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBase}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-display text-xl font-light tracking-[0.2em] uppercase">
            NaijaStyle <span className="text-gold font-medium">Atelier</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
              <Link
                key={path}
                to={path}
                className={`text-xs tracking-widest uppercase font-body transition-colors ${linkClass} ${location.pathname === path ? 'text-gold' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-5">
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-4">
                <span className={`text-xs tracking-wide font-body ${isHome && !scrolled ? 'text-white/70' : 'text-gray-500'}`}>
                  Hi, {user?.name.split(' ')[0]}
                </span>
                <button onClick={logout} className={`transition-colors ${linkClass}`} title="Logout">
                  <FiLogOut size={17} />
                </button>
              </div>
            ) : (
              <Link to="/login" className={`hidden md:block transition-colors ${linkClass}`} title="Login">
                <FiUser size={18} />
              </Link>
            )}

            <Link to="/cart" className="relative">
              <FiShoppingBag size={20} className={`transition-colors ${isHome && !scrolled ? 'text-white hover:text-gold' : 'text-black hover:text-gold'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className={`md:hidden transition-colors ${isHome && !scrolled ? 'text-white' : 'text-black'}`}
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="relative ml-auto w-72 h-full bg-white flex flex-col pt-8 pb-12 px-8 shadow-2xl animate-fade-in">
            <button onClick={() => setMenuOpen(false)} className="self-end mb-10 text-gray-400 hover:text-black">
              <FiX size={24} />
            </button>
            <div className="flex flex-col gap-8">
              {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
                <Link key={path} to={path} className="font-display text-3xl font-light text-gray-800 hover:text-gold transition-colors">
                  {label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-8 flex flex-col gap-4">
                {isLoggedIn ? (
                  <button onClick={logout} className="text-sm text-gray-500 tracking-widest uppercase text-left hover:text-gold">
                    Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="text-sm text-gray-500 tracking-widest uppercase hover:text-gold">Login</Link>
                    <Link to="/signup" className="btn-primary text-center">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
