import toast from 'react-hot-toast'

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true)

  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function RazorpayButton({ amount, customer, onSuccess, className, children }) {
  async function handleClick() {
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      toast.error('Unable to load Razorpay checkout')
      return
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!key) {
      toast.error('Add VITE_RAZORPAY_KEY_ID to enable online payment')
      return
    }

    const razorpay = new window.Razorpay({
      key,
      amount: Math.round(amount * 100),
      currency: 'INR',
      name: 'ELANTRAA',
      description: 'Premium Indian Fashion',
      image: 'https://placehold.co/200x200/C2185B/ffffff?text=E',
      handler(response) {
        onSuccess?.(response)
      },
      prefill: {
        name: customer?.name || '',
        email: customer?.email || '',
        contact: customer?.phone || '',
      },
      theme: { color: '#C2185B' },
    })

    razorpay.open()
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  )
}

export default RazorpayButton
