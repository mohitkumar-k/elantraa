import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Seo from '../components/Seo'
import { useProducts } from '../hooks/useStoreData'
import { useWishlist } from '../hooks/useWishlist'

function WishlistPage() {
  const { wishlist } = useWishlist()
  const { products } = useProducts()
  const items = products.filter((product) => wishlist.some((wish) => wish.id === product.id))

  return (
    <>
      <Seo title="Wishlist" />
      <section className="container-shell page-section">
        <h1 className="heading-display mb-8 text-4xl text-ink">My Wishlist</h1>
        {items.length === 0 ? (
          <div className="glass-card p-8 text-sm text-muted">
            No saved styles yet. <Link to="/" className="font-semibold text-brand">Browse new arrivals</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default WishlistPage
