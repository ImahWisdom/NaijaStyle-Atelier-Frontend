import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { payWithPaystack, generateReference } from '../utils/paystack'
import Toast from '../components/Toast'

const PENDING_KEY = 'naijastyle_pending_reference'
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export default function Cart() {
  const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart, cartTotal } = useCart()
  const { isLoggedIn, user, token } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(user?.email || '')
  const [emailError, setEmailError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const paymentSucceededRef = useRef(false)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Ask the backend to independently confirm with Paystack whether this
  // reference actually succeeded, then record the order. Safe to call more
  // than once with the same reference — it just returns the existing order.
  //
  // Retries with backoff because Paystack's popup can report "success" on
  // the client a few seconds before their own verify API reflects that same
  // status server-side — especially for bank transfer/USSD/mobile money,
  // which aren't instant the way card payments are. Without retrying, that
  // brief gap looked like a hard failure even though the payment was fine.
  const verifyAndFinalize = async (reference: string, { silent = false } = {}) => {
    const delays = [0, 2000, 3000, 4000, 5000] // ~14s of retries total
    let lastError = 'Could not confirm payment.'

    for (let attempt = 0; attempt < delays.length; attempt++) {
      if (attempt > 0) {
        setConfirming(true)
        await sleep(delays[attempt])
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ reference }),
        })
        const data = await res.json()
        if (!res.ok) { lastError = data.message || lastError; continue }

        paymentSucceededRef.current = true
        window.localStorage.removeItem(PENDING_KEY)
        clearCart()
        navigate(`/order-confirmation/${reference}`)
        return true
      } catch {
        lastError = 'Could not reach the server to confirm payment.'
      }
    }

    // All retries exhausted — the reference stays in localStorage, so if the
    // webhook finishes recording it in the background (or the user reopens
    // the site later), it'll still be picked up automatically.
    if (!silent) {
      showToast(
        `We're still confirming your payment. Don't worry — your reference (${reference.slice(-8)}) is saved, and your order will appear automatically once confirmed. Refresh in a minute, or contact support if it doesn't.`,
        'error'
      )
    }
    return false
  }

  // On page load: if a payment was left mid-flight (e.g. the page reloaded
  // right after a bank transfer/USSD payment before we could confirm it),
  // automatically re-check it with the backend so the user doesn't lose
  // their confirmation just because the tab refreshed.
  useEffect(() => {
    const pending = window.localStorage.getItem(PENDING_KEY)
    if (pending) verifyAndFinalize(pending, { silent: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCheckout = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError('')
    setProcessing(true)
    paymentSucceededRef.current = false
    const reference = generateReference()
    window.localStorage.setItem(PENDING_KEY, reference)

    payWithPaystack({
      email, amount: cartTotal, reference,
      metadata: {
        userId: user?.id || null,
        items: cart.map(i => ({ productId: i._id, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
      },
      onSuccess: async (ref) => {
        await verifyAndFinalize(ref.reference)
        setProcessing(false)
        setConfirming(false)
      },
      onClose: () => {
        // Paystack can fire onClose right after a successful payment too
        // (the popup closes either way) — don't show "cancelled" if the
        // payment actually went through.
        if (paymentSucceededRef.current) return
        setProcessing(false)
        setConfirming(false)
        showToast('Payment cancelled.', 'error')
      },
    })
  }

  if (cart.length === 0) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
      {toast && <Toast message={toast.msg} type={toast.type} />}
      <FiShoppingBag size={56} className="text-gray-200 mb-6" />
      <h1 className="font-display text-4xl font-light mb-3">Your cart is empty</h1>
      <p className="text-gray-500 text-sm mb-8">Looks like you haven't added anything yet.</p>
      <Link to="/shop" className="btn-primary">Browse Collection</Link>
    </div>
  )

  return (
    <div className="min-h-screen pt-24">
      {toast && <Toast message={toast.msg} type={toast.type} />}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl md:text-5xl font-light mb-12">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="hidden md:grid grid-cols-12 text-xs tracking-widest uppercase text-gray-400 pb-4 border-b border-gray-100">
              <span className="col-span-6">Product</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            {cart.map(item => (
              <div key={item._id} className="grid grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                  <Link to={`/product/${item._id}`} className="shrink-0 w-20 h-24 overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </Link>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">{item.category}</p>
                    <Link to={`/product/${item._id}`} className="font-display text-lg font-light hover:text-gold transition-colors">
                      {item.name}
                    </Link>
                    <button onClick={() => removeFromCart(item._id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors mt-2">
                      <FiTrash2 size={11} /> Remove
                    </button>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-center text-sm font-body">
                  ₦{item.price.toLocaleString()}
                </div>
                <div className="col-span-5 md:col-span-2 flex items-center justify-center gap-3 border border-gray-200 px-3 py-2 w-fit mx-auto">
                  <button onClick={() => decreaseQuantity(item._id)} className="text-gray-400 hover:text-black transition-colors"><FiMinus size={13} /></button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="text-gray-400 hover:text-black transition-colors"><FiPlus size={13} /></button>
                </div>
                <div className="col-span-3 md:col-span-2 text-right text-sm font-body font-medium">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-4">
              <Link to="/shop" className="text-xs tracking-widest uppercase text-gray-500 hover:text-gold transition-colors">← Continue Shopping</Link>
              <button onClick={clearCart} className="text-xs tracking-widest uppercase text-gray-400 hover:text-red-500 transition-colors">Clear Cart</button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-[#f5f0eb] p-8 h-fit">
            <h2 className="font-display text-2xl font-light mb-6">Order Summary</h2>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₦{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t border-gray-200 my-5" />
            <div className="flex justify-between font-body font-semibold text-lg mb-8">
              <span>Total</span>
              <span>₦{cartTotal.toLocaleString()}</span>
            </div>

            <div className="mb-2">
              <label className="text-xs tracking-widest uppercase text-gray-500 block mb-2">Email for receipt</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => { setEmail(e.target.value); setEmailError('') }}
                className="w-full border-b border-gray-400 bg-transparent py-2 text-sm focus:outline-none focus:border-gold transition-colors placeholder-gray-400"
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            {!isLoggedIn && (
              <p className="text-xs text-gray-500 mt-3 mb-4">
                <Link to="/login" className="text-gold underline">Login</Link> to save your order history.
              </p>
            )}

            <button onClick={handleCheckout} disabled={processing}
              className="w-full bg-black text-white text-xs tracking-widest uppercase py-4 flex items-center justify-center gap-3 hover:bg-gold hover:text-black transition-all duration-300 mt-6 disabled:opacity-50">
              {confirming ? 'Confirming your payment…' : processing ? 'Opening Paystack…' : (<>Pay with Paystack <FiArrowRight size={14} /></>)}
            </button>
            {confirming && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                Please don't close this page — confirming your payment with Paystack.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}