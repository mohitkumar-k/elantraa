import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

function Layout() {
  return (
    <div className="min-h-screen">
      <div className="bg-brand px-4 py-2 text-center text-[11px] font-semibold tracking-[0.28em] text-white sm:text-xs">
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
