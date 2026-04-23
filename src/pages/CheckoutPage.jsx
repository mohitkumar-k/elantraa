import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import RazorpayButton from '../components/RazorpayButton'
import Seo from '../components/Seo'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { saveOrder } from '../firebase/services'
import { formatPrice } from '../utils/format'

const defaultAddress = {
  name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  paymentMethod: 'razorpay',
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, total, mrpTotal, discount, clearCart } = useCart()
  const [address, setAddress] = useState({
    ...defaultAddress,
    name: user?.displayName || '',
    phone: '',
  })
  const [saving, setSaving] = useState(false)

  const isReady = useMemo(
    () =>
      items.length > 0 &&
      address.name &&
      address.phone &&
      address.address &&
      address.city &&
      address.state &&
      address.pincode,
    [address, items.length],
  )

  async function finalizeOrder(paymentDetails = {}) {
    if (!isReady) {
      toast.error('Please complete your delivery details')
      return
    }

    setSaving(true)
    const order = await saveOrder({
      userId: user?.uid || 'guest',
      items,
      address,
      total,
      mrpTotal,
      discount,
      status: 'Pending',
      paymentId: paymentDetails.razorpay_payment_id || paymentDetails.paymentId || 'COD',
      paymentOrderId: paymentDetails.razorpay_order_id || null,
      signature: paymentDetails.razorpay_signature || null,
    })
    clearCart()
    toast.success('Order placed successfully')
    navigate('/orders', { state: { highlightOrderId: order.id } })
    setSaving(false)
  }

  return (
    <>
      <Seo title="Checkout" />
      <section className="container-shell page-section">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-card p-6 sm:p-8">
            <h1 className="heading-display mb-6 text-4xl text-[#24151d]">Checkout</h1>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['name', 'Name'],
                ['phone', 'Phone'],
                ['address', 'Address'],
                ['city', 'City'],
                ['state', 'State'],
                ['pincode', 'Pincode'],
              ].map(([key, label]) => (
                <label key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
                  <span className="mb-2 block text-sm text-[#6f5160]">{label}</span>
                  <input
                    type="text"
                    value={address[key]}
                    onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))}
                    className="w-full rounded-[18px] border border-[#f0dde5] bg-white px-4 py-3 outline-none focus:border-brand"
                  />
                </label>
              ))}
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]">Payment Method</p>
              <div className="flex flex-wrap gap-3">
                {[
                  ['razorpay', 'Razorpay: Card, UPI, Netbanking, Wallets'],
                  ['cod', 'Cash on Delivery'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm ${
                      address.paymentMethod === value ? 'border-brand bg-brand text-white' : 'border-[#f0dde5] bg-white'
                    }`}
                    onClick={() => setAddress((current) => ({ ...current, paymentMethod: value }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card h-fit p-6">
            <h2 className="mb-6 text-lg font-semibold uppercase tracking-[0.18em]">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex items-center gap-3 rounded-[20px] bg-[#fff6f8] p-3">
                  <img src={item.image} alt={item.name} className="h-16 w-14 rounded-[14px] object-cover" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-[#24151d]">{item.name}</p>
                    <p className="text-[#6f5160]">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-brand">{formatPrice(item.salePrice * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 text-sm text-[#6f5160]">
              <div className="flex justify-between">
                <span>MRP Total</span>
                <span>{formatPrice(mrpTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-brand">- {formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between font-semibold text-[#24151d]">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            {address.paymentMethod === 'razorpay' ? (
              <RazorpayButton
                amount={total}
                customer={{ name: address.name, phone: address.phone, email: user?.email }}
                onSuccess={finalizeOrder}
                className="btn-primary mt-6 w-full"
              >
                {saving ? 'PROCESSING...' : 'PAY WITH RAZORPAY'}
              </RazorpayButton>
            ) : (
              <button type="button" className="btn-secondary mt-6 w-full" onClick={() => finalizeOrder({ paymentId: 'COD' })}>
                {saving ? 'PROCESSING...' : 'PLACE COD ORDER'}
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default CheckoutPage
