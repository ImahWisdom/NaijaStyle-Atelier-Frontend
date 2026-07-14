import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80" alt="About" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Our Story</p>
            <h1 className="font-display text-5xl md:text-6xl font-light">About Us</h1>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="section-title mb-8">Born from African Elegance</h2>
        <p className="text-gray-600 leading-relaxed text-base font-body mb-6">
          NaijaStyle Atelier was founded with a singular vision — to celebrate the richness of African fashion and bring it to the world stage. We believe that style is a language, and ours speaks of heritage, pride, and modern sophistication.
        </p>
        <p className="text-gray-600 leading-relaxed text-base font-body">
          Every piece in our collection is carefully curated to reflect quality craftsmanship and timeless elegance. From flowing gowns to tailored jackets, we dress individuals who refuse to blend in.
        </p>
      </section>

      {/* Values */}
      <section className="bg-[#f5f0eb] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title text-center mb-14">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Quality', desc: 'Every piece is selected with uncompromising attention to material quality and construction.' },
              { title: 'Heritage', desc: 'We draw inspiration from African culture, weaving tradition into contemporary fashion.' },
              { title: 'Community', desc: 'We support and celebrate the African fashion ecosystem — designers, artisans, and creators.' },
            ].map(v => (
              <div key={v.title} className="text-center">
                <div className="w-12 h-px bg-gold mx-auto mb-6" />
                <h3 className="font-display text-2xl font-light mb-4">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-body">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Ready to shop?</p>
        <h2 className="section-title mb-8">Explore Our Collection</h2>
        <Link to="/shop" className="btn-primary">Shop Now</Link>
      </section>
    </div>
  )
}
