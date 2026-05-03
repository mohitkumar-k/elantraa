import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import logo from '../assets/logo-trimmed.png'

const interactiveSelector = 'a, button, [role="button"], input[type="button"], input[type="submit"]'

function GlobalClickLoader() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef(null)

  function showLoader(duration = 650) {
    window.clearTimeout(timeoutRef.current)
    setVisible(true)
    timeoutRef.current = window.setTimeout(() => setVisible(false), duration)
  }

  useEffect(() => {
    function handleClick(event) {
      const target = event.target.closest(interactiveSelector)
      if (!target || target.disabled || target.getAttribute('aria-disabled') === 'true') return
      showLoader()
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    showLoader(520)
  }, [location.pathname, location.search])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(33,26,19,0.16)] backdrop-blur-[2px]">
      <div className="elantraa-loader-mark relative flex h-24 w-24 items-center justify-center rounded-full border border-[#DED4C5] bg-white shadow-[0_22px_70px_rgba(33,26,19,0.18)]">
        <img src={logo} alt="ELANTRAA loading" className="h-11 w-auto max-w-[76px] object-contain" decoding="async" />
      </div>
    </div>
  )
}

export default GlobalClickLoader
