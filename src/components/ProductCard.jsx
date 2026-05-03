import { FiHeart, FiShoppingBag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { getDiscountPercent, formatPrice, normalizeSizeLabel, slugify } from '../utils/format'
import { getProductCoverImage } from '../utils/productImages'

function ProductCard({ product, variant = 'default' }) {
  const { addToCart } = useCart()
  const { toggleWishlist, hasInWishlist } = useWishlist()
  const discount = getDiscountPercent(product.mrp, product.salePrice)
  const inWishlist = hasInWishlist(product.id)
  const isArrivalReference = variant === 'arrival-reference'
  const isTrendingReference = variant === 'trending-reference'
  const isCategoryReference = variant === 'category-reference'
  const productLabel = String(product.category || '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
  const productHref = `/product/${product.id || slugify(product.name)}`
  const isReferenceCard = isArrivalReference || isTrendingReference || isCategoryReference
  const imageClass = isReferenceCard
    ? 'h-[225px] rounded-[14px] min-[390px]:h-[245px] sm:h-[340px] sm:rounded-[16px] lg:h-[360px]'
    : 'h-[290px] rounded-[14px] min-[390px]:h-[320px] sm:h-[430px] sm:rounded-[16px]'
  const titleClass = isReferenceCard
    ? 'line-clamp-2 text-[14px] font-medium leading-[1.28] sm:text-[16px]'
    : 'line-clamp-2 text-[18px] font-medium leading-[1.2] sm:text-[21px]'

  return (
    <div
      className={`group overflow-hidden transition duration-300 ${
        isReferenceCard
          ? 'bg-transparent'
          : 'border border-[#DED4C5] bg-white p-3 hover:-translate-y-1'
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          isReferenceCard ? 'rounded-[14px] sm:rounded-[16px]' : 'rounded-[14px] sm:rounded-[16px]'
        }`}
      >
        <Link to={productHref}>
          <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(25,18,7,0.01),rgba(25,18,7,0.12))] opacity-0 transition duration-500 group-hover:opacity-100" />
          <img
            src={getProductCoverImage(product)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`w-full object-cover transition duration-500 group-hover:scale-105 ${imageClass}`}
          />
        </Link>
        {discount > 0 && (
          <div
            className="absolute left-3 top-3 z-20 rounded-full bg-[rgba(33,26,19,0.88)] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_14px_26px_rgba(33,26,19,0.2)] sm:px-3 sm:text-[11px]"
          >
            {discount}% off
          </div>
        )}
        <button
          type="button"
          className={`absolute right-3 top-3 z-20 rounded-full border border-white/55 bg-white/92 p-2 text-[18px] shadow-[0_10px_24px_rgba(33,26,19,0.12)] backdrop-blur transition hover:text-brand sm:p-2.5 sm:text-[20px] ${
            inWishlist ? 'text-brand' : 'text-ink'
          }`}
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle wishlist"
        >
          <FiHeart />
        </button>
      </div>
      <div
        className={
          isReferenceCard
            ? 'px-0.5 pb-1 pt-2.5 sm:pt-4'
            : 'px-1 pb-1 pt-3 sm:pt-4'
        }
      >
        {isCategoryReference && (
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted sm:text-[11px]">{productLabel}</p>
        )}
        <Link
          to={productHref}
          className={`block min-h-[2.55em] text-ink transition hover:text-brand ${titleClass}`}
        >
          {product.name}
        </Link>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:mt-2">
          <span className={`${isReferenceCard ? 'text-[15px] sm:text-[17px]' : 'text-[17px] sm:text-[19px]'} font-semibold text-ink`}>
            {formatPrice(product.salePrice)}
          </span>
          {product.mrp > product.salePrice && (
            <span className="text-[12px] text-muted/70 line-through sm:text-[13px]">{formatPrice(product.mrp)}</span>
          )}
        </div>
        <button
          type="button"
          className="mt-2.5 inline-flex h-9 w-full items-center justify-center gap-2 border border-[#24190D] bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#24190D] transition hover:bg-[#24190D] hover:text-white sm:mt-3 sm:h-11 sm:text-xs lg:translate-y-1.5 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100"
          onClick={() => addToCart(product, normalizeSizeLabel(product.sizes?.[0]), 1)}
        >
          <FiShoppingBag className="text-[15px]" />
          <span className="hidden min-[390px]:inline">Add to cart</span>
          <span className="min-[390px]:hidden">Add</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
