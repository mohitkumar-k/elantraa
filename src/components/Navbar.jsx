import { useMemo, useState } from 'react'
import { FiHeart, FiMail, FiMenu, FiPhone, FiSearch, FiShoppingBag, FiUser, FiX } from 'react-icons/fi'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo-trimmed.png'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useCategoriesData, useProducts } from '../hooks/useStoreData'
import { formatPrice, slugify } from '../utils/format'
import { getProductCoverImage } from '../utils/productImages'

const mobileLinks = [
  { label: 'Wishlist', href: '/wishlist', icon: FiHeart },
  { label: 'Login / Register', href: '/auth', icon: FiUser },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { count } = useCart()
  const { user } = useAuth()
  const { categories } = useCategoriesData()
  const { products } = useProducts()

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return products.slice(0, 6)

    return products
      .filter((product) =>
        [product.name, product.category, product.color, product.fabric]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term)),
      )
      .slice(0, 8)
  }, [products, searchTerm])

  function closeSearch() {
    setSearchOpen(false)
    setSearchTerm('')
  }

  function submitSearch(event) {
    event.preventDefault()
    const term = searchTerm.trim()
    closeSearch()
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/search')
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-[rgba(251,250,247,0.92)] backdrop-blur-xl">
        <div className="container-shell flex h-16 items-center gap-2 sm:h-[74px] sm:gap-3">
          <button
            type="button"
            className="inline-flex shrink-0 rounded-full border border-line bg-white/85 p-2 text-lg text-ink shadow-[0_10px_24px_rgba(33,26,19,0.06)] lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <FiMenu />
          </button>

          <div className="hidden items-center gap-6 text-[13px] tracking-[0.14em] text-muted lg:flex">
            {categories.map((category) => (
              <NavLink
                key={category.slug}
                to={`/category/${category.slug}`}
                className={({ isActive }) =>
                  `relative pb-1 transition after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-center after:bg-brand after:transition after:duration-300 ${
                    isActive ? 'text-ink after:scale-x-100' : 'text-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100'
                  }`
                }
              >
                {category.name}
              </NavLink>
            ))}
          </div>

          <Link
            to="/"
            className="flex min-w-0 flex-1 items-center justify-center px-2 lg:flex-none lg:justify-start"
            aria-label="ELANTRAA home"
          >
            <img
              src={logo}
              alt="ELANTRAA"
              className="h-8 w-auto max-w-[190px] object-contain sm:h-11 sm:max-w-[240px] lg:h-11 lg:max-w-[270px]"
            />
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              className="inline-flex rounded-full border border-line bg-white/85 p-2 text-lg text-ink shadow-[0_10px_24px_rgba(33,26,19,0.05)] transition hover:border-brand"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <FiSearch />
            </button>
            <Link
              to="/wishlist"
              className="hidden rounded-full border border-line bg-white/85 p-1.5 text-base text-ink shadow-[0_10px_24px_rgba(33,26,19,0.05)] transition hover:-translate-y-0.5 hover:border-brand sm:inline-flex sm:p-2 sm:text-lg"
              aria-label="Wishlist"
            >
              <FiHeart />
            </Link>
            <Link
              to={user ? '/profile' : '/auth'}
              className="hidden rounded-full border border-line bg-white/85 p-1.5 text-base text-ink shadow-[0_10px_24px_rgba(33,26,19,0.05)] transition hover:-translate-y-0.5 hover:border-brand sm:inline-flex sm:p-2 sm:text-lg"
              aria-label="Account"
            >
              <FiUser />
            </Link>
            <Link
              to="/cart"
              className="relative hidden rounded-full border border-line bg-white/85 p-1.5 text-base text-ink shadow-[0_10px_24px_rgba(33,26,19,0.05)] transition hover:-translate-y-0.5 hover:border-brand sm:inline-flex sm:p-2 sm:text-lg"
              aria-label="Cart"
            >
              <FiShoppingBag />
              {count > 0 && (
                <span className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white shadow-[0_8px_16px_rgba(168,121,22,0.22)]">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-[rgba(33,26,19,0.34)] backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <aside className="fixed left-0 top-0 z-50 flex h-full w-[82%] max-w-sm fade-in-up flex-col overflow-hidden bg-[linear-gradient(180deg,#fbfaf7_0%,#ffffff_100%)] shadow-[0_20px_70px_rgba(33,26,19,0.18)]">
            <div className="flex border-b border-line">
              <div className="flex flex-1">
                <button
                  type="button"
                  className="px-6 py-5 text-[11px] font-medium uppercase tracking-[0.22em] text-ink"
                >
                  Menu
                </button>
              </div>
              <button
                type="button"
                className="flex w-24 items-center justify-center bg-ink text-[34px] text-white"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line px-6 py-5 text-[13px] font-medium tracking-[0.08em] text-ink"
                >
                  {category.name}
                </Link>
              ))}
              {mobileLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 border-b border-line px-6 py-5 text-[13px] font-medium tracking-[0.08em] text-ink"
                >
                  <link.icon className="text-[18px]" />
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="px-6 py-8">
                <p className="mb-4 text-[14px] font-medium text-ink">Need help?</p>
                <div className="space-y-3 text-[13px] text-muted">
                  <a href="tel:+919015342951" className="flex items-center gap-3 underline underline-offset-4">
                    <FiPhone className="text-[16px]" />
                    <span>+91 90153 42951</span>
                  </a>
                  <a
                    href="mailto:elantraa.01@gmail.com"
                    className="flex items-center gap-3 underline underline-offset-4"
                  >
                    <FiMail className="text-[16px]" />
                    <span>elantraa.01@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="Search products">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(33,26,19,0.42)] backdrop-blur-[2px]"
            onClick={closeSearch}
            aria-label="Close search"
          />
          <div className="absolute inset-x-4 top-20 mx-auto max-w-2xl overflow-hidden bg-white shadow-[0_24px_70px_rgba(33,26,19,0.2)] sm:top-24">
            <form onSubmit={submitSearch} className="flex items-center gap-3 border-b border-[#DED4C5] px-4 py-3 sm:px-5">
              <FiSearch className="shrink-0 text-xl text-[#6E5F4C]" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                autoFocus
                placeholder="Search sarees, lehengas, colors..."
                className="min-w-0 flex-1 bg-transparent py-2 text-base text-[#1F170E] outline-none placeholder:text-[#8E7E67]"
              />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DED4C5] text-xl text-[#1F170E]"
                onClick={closeSearch}
                aria-label="Close search"
              >
                <FiX />
              </button>
            </form>

            <div className="max-h-[62vh] overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-[#EEE5D9]">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id || slugify(product.name)}`}
                      className="flex items-center gap-3 px-4 py-3 transition hover:bg-surface sm:px-5"
                      onClick={closeSearch}
                    >
                      <img
                        src={getProductCoverImage(product)}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="h-16 w-12 rounded-[8px] object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold uppercase tracking-[-0.01em] text-[#1F170E]">
                          {product.name}
                        </span>
                        <span className="mt-1 block text-xs capitalize text-[#6E5F4C]">
                          {String(product.category || '').replace(/-/g, ' ')}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-[#1F170E]">
                        {formatPrice(product.salePrice)}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1F170E]">No styles found</p>
                  <p className="mt-2 text-sm leading-6 text-[#6E5F4C]">Try searching by product name, category, color, or fabric.</p>
                </div>
              )}
            </div>
            <div className="border-t border-[#DED4C5] bg-white px-4 py-3 sm:px-5">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center border border-[#24190D] bg-[#24190D] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                onClick={() => {
                  const term = searchTerm.trim()
                  closeSearch()
                  navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/search')
                }}
              >
                View all results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
