import { FiEye, FiHeart, FiShoppingBag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { getDiscountPercent, formatPrice } from '../utils/format'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toggleWishlist, hasInWishlist } = useWishlist()
  const discount = getDiscountPercent(product.mrp, product.salePrice)

  return (
    <div className="group overflow-hidden rounded-[28px] border border-[#f0dde5] bg-white">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        {discount > 0 && (
          <div className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
            {discount}% OFF
          </div>
        )}
        <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-100 sm:translate-x-5 sm:opacity-0 sm:transition sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
          <Link to={`/product/${product.id}`} className="rounded-full bg-white p-2.5 shadow-sm">
            <FiEye />
          </Link>
          <button
            type="button"
            className={`rounded-full p-2.5 shadow-sm ${hasInWishlist(product.id) ? 'bg-brand text-white' : 'bg-white'}`}
            onClick={() => toggleWishlist(product)}
          >
            <FiHeart />
          </button>
          <button
            type="button"
            className="rounded-full bg-white p-2.5 shadow-sm"
            onClick={() => addToCart(product, product.sizes?.[0], 1)}
          >
            <FiShoppingBag />
          </button>
        </div>
      </div>
      <div className="space-y-2 p-5">
        <Link to={`/product/${product.id}`} className="line-clamp-1 text-base font-semibold text-[#24151d]">
          {product.name}
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-brand">{formatPrice(product.salePrice)}</span>
          <span className="text-[#917c86] line-through">{formatPrice(product.mrp)}</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
