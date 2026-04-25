import { useState } from 'react'
import { FiHeart, FiMail, FiMenu, FiPhone, FiSearch, FiShoppingBag, FiUser, FiX } from 'react-icons/fi'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo-trimmed.png'
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
      <header className="sticky top-0 z-40 border-b border-[rgba(201,162,39,0.18)] bg-[rgba(255,251,243,0.92)] backdrop-blur-xl">
        <div className="container-shell flex h-16 items-center gap-2 sm:h-[74px] sm:gap-3">
          <button
            type="button"
            className="inline-flex shrink-0 rounded-full border border-[rgba(201,162,39,0.22)] bg-white/80 p-2 text-lg text-[#8C6920] shadow-[0_10px_24px_rgba(168,132,31,0.08)] lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <FiMenu />
          </button>

          <div className="hidden items-center gap-6 text-[13px] tracking-[0.18em] text-[#A8841F] lg:flex">
            {categories.map((category) => (
              <NavLink
                key={category.slug}
                to={`/category/${category.slug}`}
                className={({ isActive }) =>
                  `relative pb-1 transition after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-center after:bg-[#C9A227] after:transition after:duration-300 ${
                    isActive ? 'text-[#7B5B17] after:scale-x-100' : 'text-[#B08E39] after:scale-x-0 hover:text-[#8C6920] hover:after:scale-x-100'
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
              className="hidden rounded-full border border-[rgba(201,162,39,0.18)] bg-white/80 p-2 text-lg text-[#8C6920] shadow-[0_10px_24px_rgba(168,132,31,0.06)] sm:inline-flex"
              aria-label="Search"
            >
              <FiSearch />
            </button>
            <Link
              to="/wishlist"
              className="rounded-full border border-[rgba(201,162,39,0.18)] bg-white/80 p-1.5 text-base text-[#8C6920] shadow-[0_10px_24px_rgba(168,132,31,0.06)] transition hover:-translate-y-0.5 sm:p-2 sm:text-lg"
              aria-label="Wishlist"
            >
              <FiHeart />
            </Link>
            <Link
              to={user ? '/profile' : '/auth'}
              className="rounded-full border border-[rgba(201,162,39,0.18)] bg-white/80 p-1.5 text-base text-[#8C6920] shadow-[0_10px_24px_rgba(168,132,31,0.06)] transition hover:-translate-y-0.5 sm:p-2 sm:text-lg"
              aria-label="Account"
            >
              <FiUser />
            </Link>
            <Link
              to="/cart"
              className="relative rounded-full border border-[rgba(201,162,39,0.18)] bg-white/80 p-1.5 text-base text-[#8C6920] shadow-[0_10px_24px_rgba(168,132,31,0.06)] transition hover:-translate-y-0.5 sm:p-2 sm:text-lg"
              aria-label="Cart"
            >
              <FiShoppingBag />
              {count > 0 && (
                <span className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A8841F] px-1 text-[10px] font-semibold text-white shadow-[0_8px_16px_rgba(168,132,31,0.22)]">
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
            className="fixed inset-0 z-40 bg-[rgba(90,64,10,0.28)] backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <aside className="fixed left-0 top-0 z-50 flex h-full w-[82%] max-w-sm fade-in-up flex-col overflow-hidden bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_100%)] shadow-[0_20px_70px_rgba(90,64,10,0.18)]">
            <div className="flex border-b border-[#E0B84A]">
              <div className="flex flex-1">
                <button
                  type="button"
                  className="px-6 py-5 text-[11px] font-medium uppercase tracking-[0.24em] text-[#8C6920]"
                >
                  Menu
                </button>
              </div>
              <button
                type="button"
                className="flex w-24 items-center justify-center bg-[#A8841F] text-[34px] text-white"
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
                  className="block border-b border-[#EBD28B] px-6 py-5 text-[13px] font-medium tracking-[0.08em] text-[#8C6920]"
                >
                  {category.name}
                </Link>
              ))}
              {mobileLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 border-b border-[#EBD28B] px-6 py-5 text-[13px] font-medium tracking-[0.08em] text-[#8C6920]"
                >
                  <link.icon className="text-[18px]" />
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="px-6 py-8">
                <p className="mb-4 text-[14px] font-medium text-[#8C6920]">Need help?</p>
                <div className="space-y-3 text-[13px] text-[#B08E39]">
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
