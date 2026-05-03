import { FiGrid, FiHeart, FiHome, FiShoppingBag, FiUser } from 'react-icons/fi'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useCategoriesData } from '../hooks/useStoreData'

function BottomNavigation() {
  const { count } = useCart()
  const { wishlist } = useWishlist()
  const { user } = useAuth()
  const { categories } = useCategoriesData()
  const location = useLocation()
  const firstCategory = categories[0]?.slug ? `/category/${categories[0].slug}` : '/'

  const items = [
    { label: 'Home', href: '/', icon: FiHome, end: true },
    { label: 'Shop', href: firstCategory, icon: FiGrid, match: '/category' },
    { label: 'Wishlist', href: '/wishlist', icon: FiHeart, badge: wishlist.length },
    { label: 'Cart', href: '/cart', icon: FiShoppingBag, badge: count },
    { label: 'Account', href: user ? '/profile' : '/auth', icon: FiUser, match: user ? '/profile' : '/auth' },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-[rgba(255,255,255,0.94)] px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_42px_rgba(33,26,19,0.1)] backdrop-blur-xl sm:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            end={item.end}
            className={({ isActive }) => {
              const active = isActive || (item.match && location.pathname.startsWith(item.match))
              return `flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-semibold transition ${
                active ? 'bg-cream text-ink' : 'text-muted hover:text-ink'
              }`
            }}
            aria-label={item.label}
          >
            <span className="relative text-[20px]">
              <item.icon />
              {item.badge > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] leading-none text-white">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation
