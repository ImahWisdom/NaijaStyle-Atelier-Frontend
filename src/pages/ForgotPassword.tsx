import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft } from 'react-icons/fi'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email address.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Something went wrong.'); return }
      setSent(true)
    } catch {
      setError('Cannot connect to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#faf9f7]">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gray-400 hover:text-black transition-colors mb-10">
          <FiArrowLeft size={13} /> Back to Login
        </Link>

        <Link to="/" className="font-display text-xl tracking-[0.2em] uppercase mb-12 block text-center">
          NaijaStyle <span className="text-gold">Atelier</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiMail size={28} className="text-gold" />
            </div>
            <h1 className="font-display text-3xl font-light mb-3">Check your email</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              We've sent a 6-digit reset code to <span className="font-medium text-black">{email}</span>.
              It expires in 15 minutes.
            </p>
            <Link
              to={`/reset-password?email=${encodeURIComponent(email)}`}
              className="btn-primary inline-block"
            >
              Enter Reset Code
            </Link>
            <p className="text-gray-400 text-xs mt-6">
              Didn't receive it? Check your spam folder or{' '}
              <button onClick={() => setSent(false)} className="text-gold hover:underline">try again</button>.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-light mb-2">Forgot Password?</h1>
            <p className="text-gray-500 text-sm mb-10">
              Enter the email address you used to create your account and we'll send you a reset code.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
              <div>
                <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  className="input-field"
                  autoFocus
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary text-center disabled:opacity-50">
                {loading ? 'Sending code...' : 'Send Reset Code'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
