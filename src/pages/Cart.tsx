import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { payWithPaystack, generateReference } from '../utils/paystack'
import Toast from '../components/Toast'

export default function Cart() {
  const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart, cartTotal } = useCart()
  const { isLoggedIn, user, token } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [emailError, setEmailError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const saveOrder = async (reference: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email,
          userId: user?.id || null,
          items: cart.map(i => ({ productId: i._id, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
          total: cartTotal,
          reference,
        }),
      })
    } catch { /* silently fail — payment already succeeded */ }
  }

  const handleCheckout = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError('')
    setProcessing(true)
    const reference = generateReference()

    payWithPaystack({
      email, amount: cartTotal, reference,
      onSuccess: async (ref) => {
        await saveOrder(ref.reference)
        setProcessing(false)
        clearCart()
        showToast(`Payment successful! Ref: ${ref.reference.slice(-8)}`)
      },
      onClose: () => {
        setProcessing(false)
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
              {processing ? 'Opening Paystack…' : (<>Pay with Paystack <FiArrowRight size={14} /></>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}