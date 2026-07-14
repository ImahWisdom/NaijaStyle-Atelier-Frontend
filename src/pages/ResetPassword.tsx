import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const emailFromUrl = searchParams.get('email') || ''

  const [form, setForm] = useState({ email: emailFromUrl, otp: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.otp || !form.password || !form.confirm) {
      setError('Please fill in all fields.'); return
    }
    if (form.otp.length !== 6) { setError('Please enter the 6-digit code.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: form.otp, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Reset failed.'); return }
      navigate('/login?reset=success')
    } catch {
      setError('Cannot connect to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#faf9f7]">
      <div className="w-full max-w-md">
        <Link to="/forgot-password" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gray-400 hover:text-black transition-colors mb-10">
          <FiArrowLeft size={13} /> Back
        </Link>

        <Link to="/" className="font-display text-xl tracking-[0.2em] uppercase mb-12 block text-center">
          NaijaStyle <span className="text-gold">Atelier</span>
        </Link>

        <h1 className="font-display text-3xl font-light mb-2">Reset Password</h1>
        <p className="text-gray-500 text-sm mb-10">
          Enter the 6-digit code we sent to your email along with your new password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email — editable in case they came directly */}
          {!emailFromUrl && (
            <div>
              <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => { setForm({ ...form, email: e.target.value }); setError('') }}
                className="input-field"
              />
            </div>
          )}

          {/* OTP */}
          <div>
            <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">6-Digit Reset Code</label>
            <input
              type="text"
              placeholder="e.g. 482916"
              maxLength={6}
              value={form.otp}
              onChange={e => { setForm({ ...form, otp: e.target.value.replace(/\D/g, '') }); setError('') }}
              className="input-field tracking-[0.5em] text-center text-lg"
            />
          </div>

          {/* New password */}
          <div>
            <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => { setForm({ ...form, password: e.target.value }); setError('') }}
                className="input-field pr-8"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                {showPassword ? <BsEyeSlash size={17} /> : <BsEye size={17} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat new password"
                value={form.confirm}
                onChange={e => { setForm({ ...form, confirm: e.target.value }); setError('') }}
                className="input-field pr-8"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                {showConfirm ? <BsEyeSlash size={17} /> : <BsEye size={17} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary text-center disabled:opacity-50 mt-2">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Remembered your password?{' '}
          <Link to="/login" className="text-gold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
