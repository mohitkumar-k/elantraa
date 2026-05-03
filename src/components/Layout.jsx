import { FaWhatsapp } from 'react-icons/fa'
import { Outlet } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'
import Footer from './Footer'
import GlobalClickLoader from './GlobalClickLoader'
import Navbar from './Navbar'

function Layout() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-[#2F271F] bg-ink px-3 py-2 text-center text-[10px] font-semibold tracking-[0.18em] text-white sm:px-4 sm:text-xs sm:tracking-[0.24em]">
        FREE SHIPPING & COD AVAILABLE IN INDIA
      </div>
      <Navbar />
      <main className="pb-24 sm:pb-0">
        <Outlet />
      </main>
      <a
        href="https://wa.me/919015342951"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-24 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[30px] text-white shadow-[0_12px_28px_rgba(37,211,102,0.35)] transition hover:-translate-y-0.5 hover:bg-[#22c55e] sm:bottom-6 sm:right-6 sm:z-50"
      >
        <FaWhatsapp className="text-white" />
      </a>
      <Footer />
      <BottomNavigation />
      <GlobalClickLoader />
    </div>
  )
}

export default Layout
