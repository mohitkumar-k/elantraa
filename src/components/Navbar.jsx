import { useState } from 'react'
import { FiHeart, FiMail, FiMenu, FiPhone, FiSearch, FiShoppingBag, FiUser, FiX } from 'react-icons/fi'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useCategoriesData } from '../hooks/useStoreData'

const mobileLinks = [
  { label: 'Wishlist', href: '/wishlist', icon: FiHeart },
  { label: 'Login / Register', href: '/auth', icon: FiUser },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const { user } = useAuth()
  const { categories } = useCategoriesData()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#f0dde5] bg-white/90 backdrop-blur">
        <div className="container-shell flex h-16 items-center gap-2 sm:h-18 sm:gap-3">
          <button
            type="button"
            className="inline-flex shrink-0 rounded-full p-2 text-lg lg:hidden"
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

          <Link
            to="/"
            className="heading-display min-w-0 flex-1 truncate text-center text-[2rem] font-semibold tracking-[0.18em] text-brand sm:text-4xl sm:tracking-[0.28em] lg:flex-none lg:text-left lg:tracking-[0.4em]"
          >
            ELANTRAA
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
            <button type="button" className="hidden rounded-full p-2 text-lg sm:inline-flex" aria-label="Search">
              <FiSearch />
            </button>
            <Link to="/wishlist" className="rounded-full p-1.5 text-base sm:p-2 sm:text-lg" aria-label="Wishlist">
              <FiHeart />
            </Link>
            <Link
              to={user ? '/profile' : '/auth'}
              className="rounded-full p-1.5 text-base sm:p-2 sm:text-lg"
              aria-label="Account"
            >
              <FiUser />
            </Link>
            <Link
              to="/cart"
              className="relative rounded-full p-1.5 text-base sm:p-2 sm:text-lg"
              aria-label="Cart"
            >
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
          <aside className="fixed left-0 top-0 z-50 flex h-full w-[82%] max-w-sm fade-in-up flex-col overflow-hidden bg-white">
            <div className="flex border-b border-[#e8e2dd]">
              <div className="flex flex-1">
                <button
                  type="button"
                  className="px-6 py-5 text-[11px] font-medium uppercase tracking-[0.1em] text-[#24151d]"
                >
                  Menu
                </button>
              </div>
              <button
                type="button"
                className="flex w-24 items-center justify-center bg-[#1f1f1f] text-[34px] text-white"
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
                  className="block border-b border-[#ece5df] px-6 py-5 text-[13px] font-normal text-[#24151d]"
                >
                  {category.name}
                </Link>
              ))}
              {mobileLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 border-b border-[#ece5df] px-6 py-5 text-[13px] font-normal text-[#24151d]"
                >
                  <link.icon className="text-[18px]" />
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="px-6 py-8">
                <p className="mb-4 text-[14px] font-medium text-[#24151d]">Need help?</p>
                <div className="space-y-3 text-[13px] text-[#7a7470]">
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
    </>
  )
}

export default Navbar
