import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isObscured, setIsObscured] = useState<boolean>(true)
  const [isConfirm, setIsConfirm] = useState<boolean>(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirm) { setError('Please fill in all fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Signup failed.') }
      else { login(data.token, data.user); navigate('/') }
    } catch {
      setError('Cannot connect to server. Is the backend running?')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-end p-12">
          <p className="font-display text-4xl font-light text-white">Join the<br />Atelier family.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-xl tracking-[0.2em] uppercase mb-12 block text-center">
            NaijaStyle <span className="text-gold">Atelier</span>
          </Link>

          <h1 className="font-display text-3xl font-light mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm mb-10">
            Already have one?{' '}
            <Link to="/login" className="text-gold hover:underline">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={isObscured ? 'password' : 'text'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pr-8"
                />
                <button
                  type="button"
                  onClick={() => setIsObscured(!isObscured)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  aria-label={isObscured ? 'Show password' : 'Hide password'}
                >
                  {isObscured ? <BsEyeSlash size={17} /> : <BsEye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  name="confirm"
                  type={isConfirm ? 'password' : 'text'}
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={handleChange}
                  className="input-field pr-8"
                />
                <button
                  type="button"
                  onClick={() => setIsConfirm(!isConfirm)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  aria-label={isConfirm ? 'Show password' : 'Hide password'}
                >
                  {isConfirm ? <BsEyeSlash size={17} /> : <BsEye size={17} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary text-center disabled:opacity-50 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}