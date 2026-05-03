import { FaWhatsapp } from 'react-icons/fa'
import { FiCreditCard, FiRefreshCw, FiTruck } from 'react-icons/fi'
import { getDeliveryEstimate } from '../utils/format'

const trustItems = [
  {
    title: 'Delivery',
    description: `Estimated delivery by ${getDeliveryEstimate(7)}. Free shipping across India.`,
    icon: FiTruck,
  },
  {
    title: 'Return & exchange',
    description: 'Easy support for size guidance, exchanges, and eligible return requests.',
    icon: FiRefreshCw,
  },
  {
    title: 'Secure payment',
    description: 'Pay safely with Razorpay, UPI, cards, netbanking, wallets, or COD.',
    icon: FiCreditCard,
  },
  {
    title: 'WhatsApp help',
    description: 'Need styling, sizing, or order help? Chat with our studio directly.',
    icon: FaWhatsapp,
    href: 'https://wa.me/919015342951',
  },
]

function TrustBlocks({ compact = false }) {
  return (
    <div className={compact ? 'mt-5 border-t border-[#DED4C5] pt-5' : 'mt-8 border-y border-[#DED4C5]'}>
      <div className={compact ? 'space-y-4' : 'grid divide-y divide-[#EEE5D9] sm:grid-cols-2 sm:divide-x sm:divide-y-0'}>
        {trustItems.map((item) => {
          const Icon = item.icon
          const content = (
            <>
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[#DED4C5] text-lg text-[#1F170E]">
                <Icon />
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1F170E]">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-[#6E5F4C]">{item.description}</span>
              </span>
            </>
          )

          const className = compact
            ? 'flex items-start gap-3'
            : 'flex items-start gap-3 py-4 sm:px-5 first:sm:pl-0 last:sm:pr-0'

          return item.href ? (
            <a key={item.title} href={item.href} target="_blank" rel="noreferrer" className={`${className} transition hover:text-brand`}>
              {content}
            </a>
          ) : (
            <div key={item.title} className={className}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TrustBlocks
