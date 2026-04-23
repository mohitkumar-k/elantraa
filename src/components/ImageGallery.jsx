import { useState } from 'react'

function ImageGallery({ images = [] }) {
  const [active, setActive] = useState(0)
  const safeImages = images.length ? images : ['https://placehold.co/800x1000/f8e8ef/24151d?text=ELANTRAA']

  return (
    <div className="grid gap-4 lg:grid-cols-[96px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
        {safeImages.slice(0, 4).map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            className={`overflow-hidden rounded-[20px] border ${active === index ? 'border-brand' : 'border-[#f0dde5]'}`}
            onClick={() => setActive(index)}
          >
            <img src={image} alt="" className="h-20 w-20 object-cover" />
          </button>
        ))}
      </div>
      <div className="order-1 overflow-hidden rounded-[32px] border border-[#f0dde5] bg-white lg:order-2">
        <img src={safeImages[active]} alt="Product" className="h-[520px] w-full object-cover sm:h-[640px]" />
      </div>
    </div>
  )
}

export default ImageGallery
