import { useState } from 'react'

function ImageGallery({ images = [] }) {
  const [active, setActive] = useState(0)
  const safeImages = images.length ? images : ['https://placehold.co/800x1000/fff8e7/6f5312?text=ELANTRAA']

  return (
    <div>
      <div className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide lg:hidden">
        {safeImages.map((image, index) => (
          <div key={`${image}-${index}`} className="w-full shrink-0 snap-center">
            <div className="overflow-hidden border-y border-[#DDD2C0] bg-[#F7F0E8]">
              <img
                src={image}
                alt="Product"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="h-[calc(100vh-10rem)] min-h-[520px] w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden gap-4 lg:grid lg:grid-cols-[88px_minmax(0,1fr)] lg:items-start">
        <div className="order-2 flex gap-3 overflow-x-auto px-4 pb-1 lg:order-1 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:px-0">
          {safeImages.slice(0, 6).map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`shrink-0 overflow-hidden border bg-white transition ${
                active === index
                  ? 'border-[#20170B] shadow-[0_12px_28px_rgba(32,23,11,0.12)]'
                  : 'border-[#DDD2C0]'
              }`}
              onClick={() => setActive(index)}
            >
              <img src={image} alt="" loading="lazy" decoding="async" className="h-20 w-20 object-cover sm:h-24 sm:w-24 lg:h-[104px] lg:w-[88px]" />
            </button>
          ))}
        </div>
        <div className="order-1 overflow-hidden border-y border-[#DDD2C0] bg-[#F7F0E8] sm:border lg:order-2 lg:border-[#DDD2C0]">
          <img src={safeImages[active]} alt="Product" decoding="async" className="h-[860px] w-full object-cover" />
        </div>
      </div>
    </div>
  )
}

export default ImageGallery
