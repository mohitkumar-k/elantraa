import { useLocation } from 'react-router-dom'
import Seo from '../components/Seo'
import { useAuth } from '../hooks/useAuth'
import { useOrdersData } from '../hooks/useStoreData'
import { formatPrice } from '../utils/format'

function OrdersPage() {
  const { user } = useAuth()
  const { state } = useLocation()
  const { orders, loading } = useOrdersData(user?.uid)

  return (
    <>
      <Seo title="My Orders" />
      <section className="container-shell page-section">
        <h1 className="heading-display mb-8 text-4xl text-[#24151d]">My Orders</h1>
        <div className="space-y-5">
          {loading && <div className="glass-card p-6 text-sm text-[#6f5160]">Loading orders...</div>}
          {!loading && orders.length === 0 && (
            <div className="glass-card p-6 text-sm text-[#6f5160]">No orders yet.</div>
          )}
          {orders.map((order) => (
            <details
              key={order.id}
              open={state?.highlightOrderId === order.id}
              className="glass-card overflow-hidden p-6"
            >
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-[#8a727d]">Order ID</p>
                    <p className="font-semibold text-[#24151d]">{order.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#fff5f8] px-4 py-2 text-sm text-brand">{order.status}</span>
                    <span className="font-semibold text-[#24151d]">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </summary>
              <div className="mt-5 space-y-3 border-t border-[#f0dde5] pt-5">
                {order.items?.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm text-[#6f5160]">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>{formatPrice(item.salePrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}

export default OrdersPage
