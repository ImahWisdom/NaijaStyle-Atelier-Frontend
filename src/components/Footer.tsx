import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <p className="font-display text-2xl font-light tracking-[0.2em] uppercase mb-4">
              NaijaStyle <span className="text-gold">Atelier</span>
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Celebrating African elegance through fashion. We curate the finest pieces for the modern style-conscious individual.
            </p>
            <div className="flex gap-4 mt-6">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-gold transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-5">Shop</p>
            <div className="flex flex-col gap-3">
              {['Dresses', 'Jackets', 'Shirts', 'Accessories'].map(c => (
                <Link key={c} to={`/shop?category=${c}`} className="text-sm text-gray-400 hover:text-gold transition-colors">
                  {c}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-5">Company</p>
            <div className="flex flex-col gap-3">
              {[['About', '/about'], ['Contact', '/contact'], ['Login', '/login'], ['Sign Up', '/signup']].map(([label, path]) => (
                <Link key={path} to={path} className="text-sm text-gray-400 hover:text-gold transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs tracking-wide">
            © {new Date().getFullYear()} NaijaStyle Atelier. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">Secured payments by Paystack</p>
        </div>
      </div>
    </footer>
  )
}
