import { FiEye, FiHeart, FiMaximize2, FiShoppingBag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { getDiscountPercent, formatPrice, slugify } from '../utils/format'
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

  return (
    <div
      className={`group overflow-hidden transition duration-300 ${
        isReferenceCard
          ? 'bg-transparent'
          : 'rounded-[24px] border border-[rgba(201,162,39,0.15)] bg-[rgba(255,255,255,0.86)] p-3 shadow-[0_18px_50px_rgba(168,132,31,0.08)] backdrop-blur hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(168,132,31,0.12)]'
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          isReferenceCard ? 'rounded-[20px]' : 'rounded-[20px]'
        }`}
      >
        <Link to={productHref}>
          <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(25,18,7,0.02),rgba(25,18,7,0.16))] opacity-0 transition duration-500 group-hover:opacity-100" />
          <img
            src={getProductCoverImage(product)}
            alt={product.name}
            className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
              isReferenceCard
                ? 'h-[220px] rounded-[20px] sm:h-[290px]'
                : 'h-[300px] rounded-[20px] sm:h-[360px]'
            }`}
          />
        </Link>
        {discount > 0 && (
          <div
            className={`absolute right-3 top-3 z-20 rounded-full bg-[rgba(123,91,23,0.88)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_26px_rgba(91,67,16,0.24)] ${
              isReferenceCard ? 'sm:px-3.5 sm:py-2.5' : 'right-4 top-4 sm:px-4'
            }`}
          >
            {discount}% off
          </div>
        )}
        <button
          type="button"
          className={`absolute z-20 rounded-full border border-white/40 bg-white/88 text-[#8C6920] shadow-[0_10px_24px_rgba(91,67,16,0.12)] backdrop-blur transition ${
            isReferenceCard
              ? `left-3 top-3 p-2 text-[18px] ${inWishlist ? 'text-brand' : 'text-[#8C6920]'}`
              : `left-4 top-4 p-2.5 text-[22px] ${inWishlist ? 'text-brand' : 'text-[#8C6920]'}`
          }`}
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle wishlist"
        >
          <FiHeart />
        </button>
        {(isTrendingReference || isCategoryReference) && (
          <button
            type="button"
            className="absolute left-3 top-[3.8rem] z-20 rounded-full border border-white/35 bg-white/88 p-2 text-[17px] text-[#8C6920] shadow-[0_10px_24px_rgba(91,67,16,0.12)] backdrop-blur"
            aria-label="Expand product view"
          >
            <FiMaximize2 />
          </button>
        )}
        {isReferenceCard ? (
          <div className="absolute bottom-3 right-3 z-20 flex w-10 flex-col overflow-hidden rounded-[999px] border border-white/45 bg-white/90 shadow-[0_14px_30px_rgba(91,67,16,0.14)] backdrop-blur sm:w-11">
            <Link
              to={productHref}
              className="flex h-10 items-center justify-center text-[18px] text-[#8C6920] sm:h-11 sm:text-[19px]"
              aria-label="View product"
            >
              <FiEye />
            </Link>
            <button
              type="button"
              className="flex h-10 items-center justify-center border-t border-[#EBD28B] text-[18px] text-[#8C6920] sm:h-11 sm:text-[19px]"
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
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/92 text-[24px] text-[#8C6920] shadow-[0_18px_34px_rgba(91,67,16,0.14)] backdrop-blur"
              aria-label="View product"
            >
              <FiEye />
            </Link>
            <button
              type="button"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/92 text-[24px] text-[#8C6920] shadow-[0_18px_34px_rgba(91,67,16,0.14)] backdrop-blur"
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
          isReferenceCard
            ? 'space-y-1 px-1 pb-1 pt-4'
            : 'space-y-2 px-2 pb-2 pt-5'
        }
      >
        {isCategoryReference && (
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#B08E39] sm:text-xs">{productLabel}</p>
        )}
        <Link
          to={productHref}
          className={`text-[#A8841F] ${
            isArrivalReference || isTrendingReference
              ? 'line-clamp-1 text-[15px] font-medium tracking-[-0.02em] sm:text-[17px]'
              : isCategoryReference
                ? 'line-clamp-2 text-[15px] font-semibold leading-[1.28] tracking-[-0.02em] sm:text-[17px]'
                : 'line-clamp-1 text-[20px] font-medium tracking-[-0.04em] sm:text-[24px]'
          }`}
        >
          {product.name}
        </Link>
        {isArrivalReference || isTrendingReference ? (
          <div className="space-y-1">
            <div className="text-[12px] uppercase tracking-[0.16em] text-[#BAA15A]">Signature pick</div>
            <div className="flex items-center gap-2">
              <div className="text-[15px] font-semibold text-[#8C6920] sm:text-[17px]">{formatPrice(product.salePrice)}</div>
              <div className="text-[12px] text-[#C9A227] line-through sm:text-sm">{formatPrice(product.mrp)}</div>
            </div>
          </div>
        ) : isCategoryReference ? (
          <div className="space-y-1 pt-0.5">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#BAA15A]">Crafted occasionwear</div>
            <div className="flex items-center gap-2">
              <div className="text-[13px] font-semibold text-[#8C6920] sm:text-[15px]">{formatPrice(product.salePrice)}</div>
              <div className="text-[11px] text-[#C9A227] line-through sm:text-[13px]">{formatPrice(product.mrp)}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#BAA15A]">Elevated festive edit</p>
            <div className="flex items-center gap-3 text-base sm:text-lg">
              <span className="font-semibold text-[#8C6920]">{formatPrice(product.salePrice)}</span>
              <span className="text-[#C9A227] line-through">{formatPrice(product.mrp)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
