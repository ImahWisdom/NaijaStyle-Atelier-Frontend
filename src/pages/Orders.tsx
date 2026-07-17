import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiPackage } from 'react-icons/fi'

interface OrderItem {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  items: OrderItem[]
  total: number
  reference: string
  status: string
  createdAt: string
}

export default function Orders() {
  const { token, isLoggedIn } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/orders/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Could not load your orders.')
        return res.json()
      })
      .then(setOrders)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [token, isLoggedIn])

  if (!isLoggedIn) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
      <FiPackage size={56} className="text-gray-200 mb-6" />
      <h1 className="font-display text-4xl font-light mb-3">Order History</h1>
      <p className="text-gray-500 text-sm mb-8">
        <Link to="/login" className="text-gold underline">Log in</Link> to see your past orders.
      </p>
    </div>
  )

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl md:text-5xl font-light mb-12">Your Orders</h1>

        {loading ? (
          <div className="animate-pulse text-gray-300 font-display text-2xl">Loading...</div>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage size={48} className="text-gray-200 mb-6 mx-auto" />
            <p className="text-gray-400 text-lg font-display mb-6">No orders yet</p>
            <Link to="/shop" className="btn-primary">Browse Collection</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map(order => (
              <div key={order._id} className="border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-5 pb-5 border-b border-gray-100">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">
                      {new Date(order.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-400">Ref: {order.reference}</p>
                  </div>
                  <span className={`self-start text-[10px] font-medium tracking-widest uppercase px-3 py-1 ${
                    order.status === 'paid' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex flex-col gap-4 mb-5">
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
                  <span className="text-xs tracking-widest uppercase text-gray-500">Total</span>
                  <span className="font-body font-semibold text-lg">₦{order.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
