import { useMemo, useState } from 'react'
import { FiHeart, FiShare2, FiTruck } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import ImageGallery from '../components/ImageGallery'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ProductCard from '../components/ProductCard'
import RazorpayButton from '../components/RazorpayButton'
import Seo from '../components/Seo'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useProduct, useProducts } from '../hooks/useStoreData'
import { formatPrice, getDeliveryEstimate } from '../utils/format'

const trustBadges = ['Cash on Delivery', 'Free Shipping', 'Ships on Time', '2 Days Easy Return']

function ProductPage() {
  const { productId } = useParams()
  const { product, loading } = useProduct(productId)
  const { products } = useProducts()
  const { addToCart } = useCart()
  const { toggleWishlist, hasInWishlist } = useWishlist()
  const [size, setSize] = useState('Free Size')
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState('description')

  const related = useMemo(() => {
    if (!product) return []
    return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)
  }, [product, products])

  if (loading) {
    return (
      <section className="container-shell page-section">
        <LoadingSkeleton cards={2} />
      </section>
    )
  }

  if (!product) return null

  const savings = product.mrp - product.salePrice

  return (
    <>
      <Seo title={product.name} description={product.description} />

      <section className="container-shell page-section">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ImageGallery images={product.images} />
          <div className="glass-card p-6 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand">{product.category}</p>
            <h1 className="heading-display text-4xl text-[#24151d] sm:text-5xl">{product.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-semibold text-brand">{formatPrice(product.salePrice)}</span>
              <span className="text-base text-[#8f7783] line-through">{formatPrice(product.mrp)}</span>
              <span className="rounded-full bg-[#24151d] px-4 py-2 text-xs font-semibold tracking-[0.15em] text-white">
                SAVE {formatPrice(savings)}
              </span>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]">Size</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm ${
                      size === item ? 'border-brand bg-brand text-white' : 'border-[#f0dde5] bg-white'
                    }`}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]">Quantity</p>
              <div className="inline-flex items-center rounded-full border border-[#f0dde5] bg-white">
                <button type="button" className="px-4 py-2" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                  -
                </button>
                <span className="px-5 py-2">{quantity}</span>
                <button type="button" className="px-4 py-2" onClick={() => setQuantity((value) => value + 1)}>
                  +
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button type="button" className="btn-primary w-full" onClick={() => addToCart(product, size, quantity)}>
                ADD TO CART
              </button>
              <RazorpayButton
                amount={product.salePrice * quantity}
                customer={{}}
                className="inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold tracking-[0.18em] text-white"
                onSuccess={() => toast.success('Payment completed. Continue through checkout for saved order flow.')}
              >
                BUY NOW
              </RazorpayButton>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className={`rounded-full border px-4 py-2 text-sm ${hasInWishlist(product.id) ? 'border-brand text-brand' : 'border-[#f0dde5]'}`}
                onClick={() => toggleWishlist(product)}
              >
                <span className="inline-flex items-center gap-2">
                  <FiHeart /> Wishlist
                </span>
              </button>
              <button
                type="button"
                className="rounded-full border border-[#f0dde5] px-4 py-2 text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Product link copied')
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <FiShare2 /> Share
                </span>
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustBadges.map((badge) => (
                <div key={badge} className="rounded-[20px] border border-[#f0dde5] bg-white px-4 py-3 text-sm text-[#6f5160]">
                  {badge}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] bg-[#fff5f8] p-4 text-sm text-[#6f5160]">
              <p className="flex items-center gap-2 font-medium text-[#24151d]">
                <FiTruck /> Delivery by {getDeliveryEstimate(7)}
              </p>
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap gap-3 border-b border-[#f0dde5] pb-4">
                {['description', 'size guide', 'return policy'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm ${tab === item ? 'bg-brand text-white' : 'bg-[#fff5f8] text-[#6f5160]'}`}
                    onClick={() => setTab(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="pt-5 text-sm leading-7 text-[#6f5160]">
                {tab === 'description' && <p>{product.description}</p>}
                {tab === 'size guide' && (
                  <p>True-to-size fit. If you prefer more ease in festive styles, choose one size up.</p>
                )}
                {tab === 'return policy' && (
                  <p>Eligible for exchange or return within 2 days of delivery for unworn pieces with tags intact.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell page-section">
        <h2 className="heading-display mb-8 text-4xl text-[#24151d]">Related Products</h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </>
  )
}

export default ProductPage
