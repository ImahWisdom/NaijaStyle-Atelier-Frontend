interface ToastProps {
  message: string
  type?: 'success' | 'error'
}

export default function Toast({ message, type = 'success' }: ToastProps) {
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] toast-enter px-6 py-3 text-sm font-body tracking-wide shadow-lg ${
      type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'
    }`}>
      {message}
    </div>
  )
}
