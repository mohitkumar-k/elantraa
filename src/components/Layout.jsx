import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

function Layout() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-black bg-black px-3 py-2 text-center text-[10px] font-semibold tracking-[0.18em] text-white sm:px-4 sm:text-xs sm:tracking-[0.28em]">
        FREE SHIPPING & COD AVAILABLE IN INDIA
      </div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
