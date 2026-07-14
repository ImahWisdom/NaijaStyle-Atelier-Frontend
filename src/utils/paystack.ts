import PaystackPop from '@paystack/inline-js'

interface PaystackOptions {
  email: string
  amount: number
  reference: string
  onSuccess: (ref: { reference: string }) => void
  onClose?: () => void
}

export function payWithPaystack({ email, amount, reference, onSuccess, onClose }: PaystackOptions) {
  const paystack = new PaystackPop()
  paystack.newTransaction({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string,
    email,
    amount: Math.round(amount * 100),
    reference,
    currency: 'NGN',                  // ← add this line
    onSuccess,
    onClose: onClose ?? (() => {}),
  })
}

export function generateReference() {
  return `naijastyle_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}