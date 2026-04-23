import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/format'

function CartPage() {
  const { items, mrpTotal, total, discount, removeFromCart, updateQuantity } = useCart()

  return (
    <>
      <Seo title="Cart" />
      <section className="container-shell page-section">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card p-6">
            <h1 className="heading-display mb-6 text-4xl text-[#24151d]">Shopping Cart</h1>
            <div className="space-y-5">
              {items.length === 0 && (
                <div className="rounded-[24px] bg-[#fff5f8] p-6 text-sm text-[#6f5160]">
                  Your cart is empty. <Link to="/" className="font-semibold text-brand">Continue shopping</Link>
                </div>
              )}
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 rounded-[24px] border border-[#f0dde5] p-4">
                  <img src={item.image} alt={item.name} className="h-28 w-24 rounded-[18px] object-cover" />
                  <div className="flex-1">
                    <h2 className="font-semibold text-[#24151d]">{item.name}</h2>
                    <p className="mt-1 text-sm text-[#6f5160]">Size: {item.size}</p>
                    <p className="mt-1 text-sm font-semibold text-brand">{formatPrice(item.salePrice)}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-[#f0dde5]">
                        <button type="button" className="px-3 py-1.5" onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>
                          -
                        </button>
                        <span className="px-4 py-1.5 text-sm">{item.quantity}</span>
                        <button type="button" className="px-3 py-1.5" onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <button type="button" className="text-sm text-[#8a727d]" onClick={() => removeFromCart(item.id, item.size)}>
                        Remove item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card h-fit p-6">
            <h2 className="mb-6 text-lg font-semibold uppercase tracking-[0.18em]">Price Summary</h2>
            <div className="space-y-4 text-sm text-[#6f5160]">
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
              <div className="flex justify-between border-t border-[#f0dde5] pt-4 text-base font-semibold text-[#24151d]">
                <span>Final Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary mt-6 w-full">
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default CartPage
