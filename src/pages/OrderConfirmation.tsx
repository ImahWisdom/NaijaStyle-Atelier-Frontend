import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'

interface OrderItem {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  email: string
  items: OrderItem[]
  total: number
  reference: string
  status: string
  createdAt: string
}

export default function OrderConfirmation() {
  const { reference } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!reference) return
    fetch(`${import.meta.env.VITE_API_URL}/api/orders/reference/${reference}`)
      .then(res => {
        if (!res.ok) throw new Error("We couldn't find that order yet.")
        return res.json()
      })
      .then(setOrder)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [reference])

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="animate-pulse text-gray-300 font-display text-3xl">Loading...</div>
    </div>
  )

  if (error || !order) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
      <FiXCircle size={56} className="text-red-300 mb-6" />
      <h1 className="font-display text-3xl font-light mb-3">We couldn't confirm this order</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        If your payment went through but this page can't find it yet, please check
        your email for a receipt, or contact us with reference{' '}
        <span className="font-medium">{reference}</span>.
      </p>
      <Link to="/shop" className="btn-primary">Back to Shop</Link>
    </div>
  )

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <FiCheckCircle size={56} className="text-green-500 mb-6 mx-auto" />
        <h1 className="font-display text-4xl font-light mb-3">Thank you for your order!</h1>
        <p className="text-gray-500 text-sm mb-2">A receipt has been sent to {order.email}</p>
        <p className="text-xs text-gray-400 mb-12">Reference: {order.reference}</p>

        <div className="border border-gray-200 p-6 text-left">
          <div className="flex flex-col gap-4 mb-6">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-16 h-20 bg-gray-100 shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-body text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <span className="text-xs tracking-widest uppercase text-gray-500">Total Paid</span>
            <span className="font-body font-semibold text-lg">₦{order.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link to="/shop" className="btn-primary text-center">Continue Shopping</Link>
          <Link to="/orders" className="text-xs tracking-widest uppercase text-gray-500 hover:text-gold transition-colors self-center">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  )
}
