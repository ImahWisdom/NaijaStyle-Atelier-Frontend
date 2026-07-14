import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to send message.'); return }
      setSent(true)
    } catch {
      setError('Cannot connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="bg-[#f5f0eb] py-14 text-center">
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Get in Touch</p>
        <h1 className="section-title">Contact Us</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="font-display text-3xl font-light mb-8">We'd love to hear from you</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-10 font-body">
            Whether you have a question about an order, need styling advice, or just want to say hello — we're here for you.
          </p>
          <div className="flex flex-col gap-6">
            {[
              { icon: FiMail, label: 'Email', value: 'codewisdom5@gmail.com' },
              { icon: FiPhone, label: 'Phone', value: '+234 818 354 7260' },
              { icon: FiMapPin, label: 'Location', value: 'Lagos, Nigeria' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-gold" />
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">{label}</p>
                  <p className="text-sm text-gray-800 font-body">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/2348183547260?text=Hi%20NaijaStyle%20Atelier!%20I'd%20like%20to%20ask%20a%20question."
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 hover:bg-[#1ebe57] transition-colors"
          >
            <FaWhatsapp size={18} /> Chat on WhatsApp
          </a>
        </div>

        <div>
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 bg-gold/10 flex items-center justify-center mb-6">
                <FiMail size={28} className="text-gold" />
              </div>
              <h3 className="font-display text-2xl font-light mb-3">Message Sent!</h3>
              <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
              <div>
                <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">Name</label>
                <input
                  type="text" placeholder="Your name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field" required
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">Email</label>
                <input
                  type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field" required
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">Message</label>
                <textarea
                  rows={5} placeholder="Your message..." value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder-gray-400 resize-none"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary self-start disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
