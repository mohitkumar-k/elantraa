import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import TrustBlocks from '../components/TrustBlocks'
import { useCart } from '../hooks/useCart'
import { formatPrice, normalizeSizeLabel } from '../utils/format'

function CartPage() {
  const { items, mrpTotal, total, discount, removeFromCart, updateQuantity } = useCart()

  return (
    <>
      <Seo title="Cart" />
      <section className="container-shell page-section">
        <div className="mb-6 border-b border-[#DED4C5] pb-5 sm:mb-8 sm:pb-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-[#8E7E67]">Your Bag</p>
          <h1 className="mt-3 text-[2.05rem] font-semibold uppercase leading-none tracking-[-0.05em] text-[#1F170E] min-[390px]:text-[2.35rem] sm:text-5xl">
            Shopping Cart
          </h1>
        </div>

        <div className="grid gap-7 sm:gap-10 lg:grid-cols-[minmax(0,1.25fr)_360px]">
          <div>
            <div className="space-y-0 border-y border-[#DED4C5]">
              {items.length === 0 && (
                <div className="bg-white py-8 text-sm text-[#6E5F4C]">
                  Your cart is empty. <Link to="/" className="font-semibold text-brand">Continue shopping</Link>
                </div>
              )}
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 border-b border-[#EEE5D9] py-4 last:border-b-0 sm:gap-4 sm:py-5">
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="h-28 w-20 rounded-[10px] object-cover min-[390px]:h-32 min-[390px]:w-24 sm:h-36 sm:w-28" />
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold uppercase leading-snug tracking-[-0.02em] text-[#1F170E] min-[390px]:text-base">{item.name}</h2>
                    <p className="mt-1.5 text-xs text-[#6E5F4C] min-[390px]:text-sm">Size: {normalizeSizeLabel(item.size)}</p>
                    <p className="mt-1.5 text-sm font-medium text-[#1F170E] min-[390px]:text-base">{formatPrice(item.salePrice)}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2.5 sm:mt-3 sm:gap-3">
                      <div className="inline-flex items-center border border-[#DED4C5] text-[#1F170E]">
                        <button type="button" className="px-3 py-1.5 sm:py-2" onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>
                          -
                        </button>
                        <span className="border-x border-[#DED4C5] px-3.5 py-1.5 text-sm sm:px-4 sm:py-2">{item.quantity}</span>
                        <button type="button" className="px-3 py-1.5 sm:py-2" onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <button type="button" className="text-sm text-[#6E5F4C] underline underline-offset-4 transition hover:text-[#1F170E]" onClick={() => removeFromCart(item.id, item.size)}>
                        Remove item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-fit border border-[#DED4C5] bg-white p-5 sm:p-6 lg:sticky lg:top-28">
            <h2 className="mb-5 text-base font-semibold uppercase tracking-[0.2em] text-[#1F170E] sm:mb-6">Price Summary</h2>
            <div className="space-y-4 text-sm text-[#6E5F4C]">
              <div className="flex justify-between">
                <span>MRP Total</span>
                <span>{formatPrice(mrpTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-brand">- {formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between border-t border-[#DED4C5] pt-4 text-base font-semibold text-[#1F170E]">
                <span>Final Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap border border-[#24190D] bg-[#24190D] px-4 py-4 text-[12px] font-semibold uppercase tracking-[0.06em] !text-white transition hover:bg-[#3A2A16] min-[390px]:text-sm"
            >
              Proceed to Checkout
            </Link>
            <TrustBlocks compact />
          </div>
        </div>
      </section>
    </>
  )
}

export default CartPage
