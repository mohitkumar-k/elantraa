import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { FiEye, FiHeart, FiMaximize2, FiShoppingBag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { getDiscountPercent, formatPrice, slugify } from '../utils/format'

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, index) => {
    const starNumber = index + 1

    if (rating >= starNumber) {
      return <FaStar key={starNumber} />
    }

    if (rating >= starNumber - 0.5) {
      return <FaStarHalfAlt key={starNumber} />
    }

    return <FaRegStar key={starNumber} />
  })
}

function ProductCard({ product, variant = 'default', rating = 0, reviewCount = 0 }) {
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

  return (
    <div
      className={`group overflow-hidden bg-white ${
        isArrivalReference || isTrendingReference || isCategoryReference ? '' : 'rounded-[18px]'
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          isArrivalReference || isTrendingReference || isCategoryReference ? 'rounded-[16px]' : ''
        }`}
      >
        <Link to={productHref}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
              isArrivalReference || isTrendingReference || isCategoryReference
                ? 'h-[220px] rounded-[16px] sm:h-[280px]'
                : 'h-[280px] rounded-[18px] sm:h-[320px]'
            }`}
          />
        </Link>
        {discount > 0 && (
          <>
            {isArrivalReference || isTrendingReference || isCategoryReference ? (
              <div className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff5a14] text-sm font-medium text-white sm:h-14 sm:w-14 sm:text-base">
                -{discount}%
              </div>
            ) : (
              <div className="absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff5a14] text-xl font-medium text-white shadow-[0_10px_22px_rgba(255,90,20,0.28)] sm:h-[72px] sm:w-[72px]">
                -{discount}%
              </div>
            )}
          </>
        )}
        <button
          type="button"
          className={`absolute rounded-full transition ${
            isArrivalReference || isTrendingReference || isCategoryReference
              ? `left-2.5 top-2.5 p-0 text-[20px] ${inWishlist ? 'text-[#ff5a14]' : 'text-white'}`
              : `left-4 top-4 p-1 text-[28px] ${inWishlist ? 'text-brand' : 'text-white'}`
          }`}
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle wishlist"
        >
          <FiHeart />
        </button>
        {(isTrendingReference || isCategoryReference) && (
          <button
            type="button"
            className="absolute left-2.5 top-14 rounded-full p-0 text-[19px] text-white"
            aria-label="Expand product view"
          >
            <FiMaximize2 />
          </button>
        )}
        {isArrivalReference || isTrendingReference || isCategoryReference ? (
          <div className="absolute bottom-2.5 right-2.5 flex w-9 flex-col overflow-hidden rounded-[999px] bg-white shadow-[0_8px_20px_rgba(36,21,29,0.16)] sm:w-10">
            <Link
              to={productHref}
              className="flex h-9 items-center justify-center text-[18px] text-[#24151d] sm:h-10 sm:text-[19px]"
              aria-label="View product"
            >
              <FiEye />
            </Link>
            <button
              type="button"
              className="flex h-9 items-center justify-center border-t border-[#efe8e4] text-[18px] text-[#24151d] sm:h-10 sm:text-[19px]"
              onClick={() => addToCart(product, product.sizes?.[0], 1)}
              aria-label="Add to cart"
            >
              <FiShoppingBag />
            </button>
          </div>
        ) : (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Link
              to={productHref}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[26px] text-[#24151d] shadow-[0_10px_24px_rgba(36,21,29,0.18)]"
              aria-label="View product"
            >
              <FiEye />
            </Link>
            <button
              type="button"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[26px] text-[#24151d] shadow-[0_10px_24px_rgba(36,21,29,0.18)]"
              onClick={() => addToCart(product, product.sizes?.[0], 1)}
              aria-label="Add to cart"
            >
              <FiShoppingBag />
            </button>
          </div>
        )}
      </div>
      <div
        className={
          isArrivalReference || isTrendingReference || isCategoryReference
            ? 'space-y-0.5 px-0 pb-1 pt-3'
            : 'space-y-1 px-1 pb-2 pt-4 sm:px-0'
        }
      >
        {isCategoryReference && <p className="text-[11px] text-[#8f8884] sm:text-xs">{productLabel}</p>}
        <Link
          to={productHref}
          className={`text-[#24151d] ${
            isArrivalReference || isTrendingReference
              ? 'line-clamp-1 text-[14px] font-normal sm:text-base'
              : isCategoryReference
                ? 'line-clamp-2 text-[15px] font-semibold leading-[1.22] sm:text-[17px]'
                : 'line-clamp-1 text-[19px] font-medium tracking-[-0.03em] sm:text-[22px]'
          }`}
        >
          {product.name}
        </Link>
        {isArrivalReference || isTrendingReference ? (
          <div className="space-y-0.5">
            <div className="text-[13px] text-[#7e7672] line-through sm:text-sm">{formatPrice(product.mrp)}</div>
            <div className="text-[14px] font-medium text-[#d63a63] sm:text-base">{formatPrice(product.salePrice)}</div>
          </div>
        ) : isCategoryReference ? (
          <div className="space-y-0.5 pt-0.5">
            <div className="text-[11px] text-[#86807c] line-through sm:text-[13px]">{formatPrice(product.mrp)}</div>
            <div className="text-[12px] font-medium text-[#d63a63] sm:text-[14px]">{formatPrice(product.salePrice)}</div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-base sm:text-lg">
            <span className="font-semibold text-[#d63a63]">{formatPrice(product.salePrice)}</span>
            <span className="text-[#8b807d] line-through">{formatPrice(product.mrp)}</span>
          </div>
        )}
        {isTrendingReference && (
          <div className="flex items-center gap-1 pt-1 text-[12px] text-[#f4c20d] sm:text-[13px]">
            {renderStars(rating)}
            <span className="ml-1 text-[#8a827d]">{reviewCount} reviews</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
