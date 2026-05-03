import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowUpRight, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const shopLinks = [
  { label: 'New Arrivals', href: '/' },
  { label: 'My Orders', href: '/orders' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Return & Exchange', href: '/profile' },
]

const supportLinks = [
  { label: 'Call Us', href: 'tel:+919015342951', icon: FiPhone, value: '+91 90153 42951' },
  { label: 'Email', href: 'mailto:elantraa.01@gmail.com', icon: FiMail, value: 'elantraa.01@gmail.com' },
  { label: 'WhatsApp', href: 'https://wa.me/919015342951', icon: FaWhatsapp, value: 'Chat with ELANTRAA' },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/_kajal__bhardwaj_', icon: FiInstagram },
]

function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-line bg-white">
      <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(33,26,19,0.035),rgba(255,255,255,0))]" />

      <div className="container-shell relative py-10 sm:py-16">
        <div className="grid gap-8 border-b border-line pb-8 sm:gap-10 sm:pb-10 lg:grid-cols-[1.25fr_0.85fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-brand">ELANTRAA World</p>
            <div className="mt-4 flex flex-col gap-5 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="heading-display text-[2rem] leading-none text-ink min-[390px]:text-4xl sm:text-5xl">
                  Occasionwear with a softer, modern finish.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
                  Discover curated Indian silhouettes for celebrations, intimate events, and elegant everyday dressing.
                </p>
              </div>

              <Link
                to="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 self-start whitespace-nowrap border border-[#24190D] bg-[#24190D] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.06em] !text-white transition hover:bg-[#3A2A16] min-[390px]:px-6 min-[390px]:text-sm"
              >
                Explore Collection
                <FiArrowUpRight className="text-base" />
              </Link>
            </div>

            <div className="mt-7 grid border-y border-line sm:mt-10 sm:grid-cols-3">
              <div className="py-4 sm:py-5 sm:pr-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">Shipping</p>
                <p className="mt-2 text-lg font-semibold text-ink">Pan India Delivery</p>
                <p className="mt-1 text-sm leading-6 text-muted">Fast dispatch with secure packaging for festive orders.</p>
              </div>
              <div className="border-t border-line py-4 sm:border-l sm:border-t-0 sm:px-6 sm:py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">Support</p>
                <p className="mt-2 text-lg font-semibold text-ink">Styling Assistance</p>
                <p className="mt-1 text-sm leading-6 text-muted">Reach out for sizing help, order updates, and easy guidance.</p>
              </div>
              <div className="border-t border-line py-4 sm:border-l sm:border-t-0 sm:py-5 sm:pl-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">Promise</p>
                <p className="mt-2 text-lg font-semibold text-ink">Premium Finish</p>
                <p className="mt-1 text-sm leading-6 text-muted">Thoughtful detailing and elevated craftsmanship in every piece.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-7 sm:gap-9 lg:border-l lg:border-line lg:pl-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-brand">Quick Access</p>
              <div className="mt-4 border-t border-line">
                {shopLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="flex items-center justify-between border-b border-line py-3 text-sm font-medium tracking-[0.04em] text-ink transition hover:text-brand"
                  >
                    <span>{link.label}</span>
                    <FiArrowUpRight className="text-base" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-brand">Contact Studio</p>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {supportLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="flex items-start gap-3 py-4 transition hover:text-brand"
                  >
                    <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-lg text-ink">
                      <item.icon />
                    </span>
                    <span>
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-muted">{item.value}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 text-sm text-muted lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream text-ink">
              <FiMapPin className="text-lg" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">Based In India</p>
              <p className="mt-1 leading-6">Crafted for wedding wardrobes, festive edits, and timeless statement dressing.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-lg text-ink transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white"
              >
                <item.icon />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 text-xs tracking-[0.16em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2026 ELANTRAA. Designed for elevated Indian dressing.</p>
          <p>Free shipping & COD available across India.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
