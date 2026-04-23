import { FiInstagram, FiMail, FiPhone, FiTwitter } from 'react-icons/fi'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-[#f0dde5] bg-[#fff8f4]">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="heading-display mb-4 text-3xl tracking-[0.3em] text-brand">ELANTRAA</div>
          <p className="max-w-xs text-sm leading-7 text-[#6f5160]">
            Premium Indian occasion wear for weddings, festive dressing, and elevated everyday elegance.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em]">Contact</h3>
          <div className="space-y-3 text-sm text-[#6f5160]">
            <p className="flex items-center gap-2">
              <FiPhone /> +91 98765 43210
            </p>
            <p className="flex items-center gap-2">
              <FiMail /> care@elantraa.com
            </p>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em]">Links</h3>
          <div className="space-y-3 text-sm text-[#6f5160]">
            <Link to="/orders">My Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/profile">Return & Exchange</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em]">Follow</h3>
          <div className="flex gap-3 text-xl text-brand">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FiInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FiTwitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
