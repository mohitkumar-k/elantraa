import { useState } from 'react'
import { FiHeart, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from 'react-icons/fi'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useCategoriesData } from '../hooks/useStoreData'

const mobileLinks = [
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Login / Register', href: '/auth' },
  { label: 'Return / Exchange Request', href: '/profile' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const { user } = useAuth()
  const { categories } = useCategoriesData()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#f0dde5] bg-white/90 backdrop-blur">
        <div className="container-shell flex h-18 items-center justify-between gap-3">
          <button
            type="button"
            className="inline-flex rounded-full p-2 text-xl lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <FiMenu />
          </button>

          <div className="hidden items-center gap-6 text-sm tracking-[0.16em] text-[#6f5160] lg:flex">
            {categories.map((category) => (
              <NavLink key={category.slug} to={`/category/${category.slug}`}>
                {category.name}
              </NavLink>
            ))}
          </div>

          <Link to="/" className="heading-display text-3xl font-semibold tracking-[0.4em] text-brand sm:text-4xl">
            ELANTRAA
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <button type="button" className="rounded-full p-2 text-lg" aria-label="Search">
              <FiSearch />
            </button>
            <Link to="/wishlist" className="rounded-full p-2 text-lg" aria-label="Wishlist">
              <FiHeart />
            </Link>
            <Link to={user ? '/profile' : '/auth'} className="rounded-full p-2 text-lg" aria-label="Account">
              <FiUser />
            </Link>
            <Link to="/cart" className="relative rounded-full p-2 text-lg" aria-label="Cart">
              <FiShoppingBag />
              {count > 0 && (
                <span className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
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
            className="fixed inset-0 z-40 bg-black/35"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <aside className="fixed left-0 top-0 z-50 flex h-full w-[82%] max-w-sm fade-in-up flex-col bg-[#fffaf7] p-6">
            <div className="mb-8 flex items-center justify-between">
              <span className="heading-display text-2xl tracking-[0.28em] text-brand">ELANTRAA</span>
              <button type="button" className="rounded-full p-2 text-xl" onClick={() => setOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="space-y-5 text-sm uppercase tracking-[0.18em] text-[#4a2a39]">
              {categories.map((category) => (
                <Link key={category.slug} to={`/category/${category.slug}`} onClick={() => setOpen(false)}>
                  {category.name}
                </Link>
              ))}
              {mobileLinks.map((link) => (
                <Link key={link.label} to={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto rounded-[24px] bg-white p-5 text-sm text-[#6f5160] shadow-sm">
              <p className="mb-2 font-semibold text-[#24151d]">Phone</p>
              <p>+91 98765 43210</p>
            </div>
          </aside>
        </>
      )}
    </>
  )
}

export default Navbar
