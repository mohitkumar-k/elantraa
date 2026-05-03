import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import RazorpayButton from '../components/RazorpayButton'
import Seo from '../components/Seo'
import TrustBlocks from '../components/TrustBlocks'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { saveOrder } from '../firebase/services'
import { formatPrice, normalizeSizeLabel } from '../utils/format'

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

  if (items.length === 0) {
    return (
      <>
        <Seo title="Checkout" />
        <section className="container-shell page-section">
          <div className="mx-auto max-w-2xl border-y border-[#DED4C5] py-10 text-center sm:py-14">
            <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-[#8E7E67]">Secure checkout</p>
            <h1 className="mt-4 text-[2.05rem] font-semibold uppercase leading-none tracking-[-0.05em] text-[#1F170E] sm:text-5xl">
              Your bag is empty
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#6E5F4C] sm:text-base sm:leading-7">
              Add your selected pieces to the cart before checkout. Your delivery details and payment options will appear here once your bag has items.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/cart" className="btn-secondary">
                Return to cart
              </Link>
              <Link to="/" className="btn-primary">
                Explore collection
              </Link>
            </div>
          </div>
          <TrustBlocks />
        </section>
      </>
    )
  }

  return (
    <>
      <Seo title="Checkout" />
      <section className="container-shell page-section">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border border-[#DED4C5] bg-white p-5 sm:p-8">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.34em] text-[#8E7E67]">Secure checkout</p>
            <h1 className="mb-6 text-[2.05rem] font-semibold uppercase leading-none tracking-[-0.05em] text-[#1F170E] sm:text-5xl">Checkout</h1>
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
                  <span className="mb-2 block text-sm text-[#6E5F4C]">{label}</span>
                  <input
                    type="text"
                    value={address[key]}
                    onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))}
                    className="w-full border border-[#DED4C5] bg-white px-4 py-3 text-[#1F170E] outline-none focus:border-[#24190D]"
                  />
                </label>
              ))}
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1F170E]">Payment Method</p>
              <div className="flex flex-wrap gap-3">
                {[
                  ['razorpay', 'Razorpay: Card, UPI, Netbanking, Wallets'],
                  ['cod', 'Cash on Delivery'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`border px-4 py-2 text-sm ${
                      address.paymentMethod === value ? 'border-[#24190D] bg-[#24190D] text-white' : 'border-[#DED4C5] bg-white text-[#1F170E]'
                    }`}
                    onClick={() => setAddress((current) => ({ ...current, paymentMethod: value }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-fit border border-[#DED4C5] bg-white p-5 sm:p-6 lg:sticky lg:top-28">
            <h2 className="mb-5 text-base font-semibold uppercase tracking-[0.2em] text-[#1F170E] sm:mb-6">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex items-center gap-3 border-b border-[#EEE5D9] pb-4 last:border-b-0">
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="h-16 w-14 rounded-[8px] object-cover" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium uppercase leading-snug tracking-[-0.01em] text-[#1F170E]">{item.name}</p>
                    <p className="mt-1 text-[#6E5F4C]">Size {normalizeSizeLabel(item.size)} | Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#1F170E]">{formatPrice(item.salePrice * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 text-sm text-[#6E5F4C]">
              <div className="flex justify-between">
                <span>MRP Total</span>
                <span>{formatPrice(mrpTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-brand">- {formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between border-t border-[#DED4C5] pt-4 font-semibold text-[#1F170E]">
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
            <TrustBlocks compact />
          </div>
        </div>
      </section>
    </>
  )
}

export default CheckoutPage
