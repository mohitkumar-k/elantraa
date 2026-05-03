import { useMemo, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiChevronDown, FiHeart, FiMinus, FiPhone, FiPlus, FiShare2, FiTruck, FiX } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import ImageGallery from '../components/ImageGallery'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ProductCard from '../components/ProductCard'
import RazorpayButton from '../components/RazorpayButton'
import Seo from '../components/Seo'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useProduct, useProducts } from '../hooks/useStoreData'
import { formatPrice, getDeliveryEstimate, getDiscountPercent, normalizeSizeLabel } from '../utils/format'
import { getProductImageSet } from '../utils/productImages'

const accordionSections = [
  { id: 'information', title: 'Product Information' },
  { id: 'delivery', title: 'Delivery Timelines' },
  { id: 'disclaimer', title: 'Disclaimer' },
  { id: 'usp', title: 'USP' },
]

const sizeChartColumns = ['Size', 'Shoulder', 'Bust', 'Armhole', 'Bicep', 'Waist', 'Hip']

const sizeChartData = {
  cm: [
    ['XS', '35.6', '81.3', '38.1', '27.9', '66', '91.4'],
    ['S', '36.8', '86.4', '40.6', '30.5', '71.1', '96.5'],
    ['M', '38.1', '91.4', '43.2', '33', '76.2', '101.6'],
    ['L', '40.6', '96.5', '45.7', '35.6', '81.3', '106.7'],
    ['XL', '43.2', '101.6', '48.3', '38.1', '86.4', '111.8'],
    ['XXL', '44.5', '106.7', '50.8', '40.6', '91.4', '116.8'],
    ['3XL', '45.7', '111.8', '53.3', '43.2', '96.5', '121.9'],
    ['4XL', '47', '116.8', '55.9', '45.7', '101.6', '127'],
    ['5XL', '48.3', '121.9', '58.4', '48.3', '106.7', '132.1'],
    ['6XL', '49.5', '127', '61', '50.8', '111.8', '137.2'],
  ],
  inches: [
    ['XS', '14', '32', '15', '11', '26', '36'],
    ['S', '14.5', '34', '16', '12', '28', '38'],
    ['M', '15', '36', '17', '13', '30', '40'],
    ['L', '16', '38', '18', '14', '32', '42'],
    ['XL', '17', '40', '19', '15', '34', '44'],
    ['XXL', '17.5', '42', '20', '16', '36', '46'],
    ['3XL', '18', '44', '21', '17', '38', '48'],
    ['4XL', '18.5', '46', '22', '18', '40', '50'],
    ['5XL', '19', '48', '23', '19', '42', '52'],
    ['6XL', '19.5', '50', '24', '20', '44', '54'],
  ],
}

const measurementDetails = [
  'Chest: Place the tape close under the armhole and measure from side seam to side seam.',
  'Waist: This is the narrowest part of the waist. Place the tape from side to side directly at the waistline.',
  'Hip: Place the tape approximately 7-9 inches below the natural waistline and measure side seam to side seam.',
]

const howToMeasureDetails = [
  'Lay the garment flat on a clean surface before taking any measurement.',
  'Keep the measuring tape straight and parallel to the floor while measuring each point.',
  'Compare these values with a garment that already fits you well to choose the closest size.',
]

function ProductPage() {
  const { productId } = useParams()
  const { product, loading } = useProduct(productId)
  const { products } = useProducts()
  const { addToCart } = useCart()
  const { toggleWishlist, hasInWishlist } = useWishlist()
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [sizeChartOpen, setSizeChartOpen] = useState(false)
  const [sizeChartUnit, setSizeChartUnit] = useState('cm')
  const [sizeChartSection, setSizeChartSection] = useState('details')

  const related = useMemo(() => {
    if (!product) return []
    return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)
  }, [product, products])

  if (loading) {
    return (
      <section className="container-shell page-section">
        <LoadingSkeleton cards={2} />
      </section>
    )
  }

  if (!product) return null

  const savings = product.mrp - product.salePrice
  const discount = getDiscountPercent(product.mrp, product.salePrice)
  const productSizes = product.sizes?.length ? product.sizes.map(normalizeSizeLabel) : ['Custom']
  const selectedSize = size || productSizes[0]
  const openCustomizationChat = () => {
    const productLink = typeof window !== 'undefined' ? window.location.href : ''
    const message = encodeURIComponent(`Hi ELANTRAA, I want to inquire about customization for ${product.name}. Product link: ${productLink}`)
    window.open(`https://wa.me/919015342951?text=${message}`, '_blank', 'noopener,noreferrer')
  }
  const detailsContent = {
    information:
      product.description ||
      'Designed with elevated craftsmanship, celebration-ready detailing, and a flattering silhouette.',
    delivery: `Expected dispatch timeline is 7 to 14 business days. Estimated delivery by ${getDeliveryEstimate(7)}.`,
    disclaimer:
      'Color, texture, and embroidery placement may vary slightly due to lighting, screen settings, and handcrafted finishing.',
    usp: `${product.fabric || 'Premium festive fabric'} construction, ${product.color || 'signature'} tone, and occasionwear finishing created for standout celebrations.`,
  }

  return (
    <>
      <Seo title={product.name} description={product.description} />

      <section className="pb-10 pt-0 sm:pb-12 lg:pb-16">
        <div className="grid gap-8 lg:mx-auto lg:max-w-7xl lg:grid-cols-[minmax(0,1.06fr)_minmax(360px,0.7fr)] lg:gap-12 lg:px-8">
          <ImageGallery images={getProductImageSet(product)} />
          <div className="container-shell lg:sticky lg:top-24 lg:self-start lg:px-0">
            <div className="border-b border-[#DED4C5] pb-8">
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#8E7E67]">{String(product.category || '').replace(/-/g, ' ')}</p>
              <h1 className="mt-6 text-[2.1rem] font-semibold uppercase leading-[1.03] tracking-[-0.04em] text-[#1F170E] sm:text-[2.7rem]">
                {product.name}
              </h1>
              <div className="mt-6 space-y-3">
                <div className="text-[1.85rem] font-medium tracking-[-0.03em] text-[#1F170E]">{formatPrice(product.salePrice)}</div>
                <p className="text-base text-[#6E5F4C]">Taxes included.</p>
                {discount > 0 && (
                  <p className="text-base leading-7 text-[#7A6C59]">
                    <span className="font-medium text-[#1F170E]">{formatPrice(product.mrp)}</span>{' '}
                    <span className="text-[#A39483] line-through">MRP</span>
                    {' - '}Save {formatPrice(savings)} ({discount}% off)
                  </p>
                )}
                <p className="max-w-[28rem] text-base leading-8 text-[#7A6C59]">
                  GST update: rates may vary by product category and billing location.
                </p>
              </div>
            </div>

            <div className="border-b border-[#DED4C5] py-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[1.05rem] font-medium text-[#1F170E]">Size</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-[1rem] font-medium text-[#1F170E] underline underline-offset-4"
                  onClick={() => {
                    setSizeChartUnit('cm')
                    setSizeChartSection('details')
                    setSizeChartOpen(true)
                  }}
                >
                  <span className="inline-block -rotate-45 text-sm">||</span>
                  Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {productSizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`min-w-[5rem] border px-5 py-4 text-[1.05rem] transition ${
                      selectedSize === item ? 'border-[#24190D] bg-[#24190D] text-white' : 'border-[#DED4C5] bg-white text-[#1F170E]'
                    }`}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-b border-[#DED4C5] py-8">
              <p className="mb-5 text-[1.05rem] font-medium text-[#1F170E]">Quantity</p>
              <div className="inline-flex items-center border border-[#DED4C5] bg-white text-[#1F170E]">
                <button
                  type="button"
                  className="px-7 py-5 text-[1.7rem] leading-none transition hover:bg-[#F5EFE8]"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  <FiMinus />
                </button>
                <span className="min-w-20 px-4 py-5 text-center text-[1.1rem]">{quantity}</span>
                <button type="button" className="px-7 py-5 text-[1.7rem] leading-none transition hover:bg-[#F5EFE8]" onClick={() => setQuantity((value) => value + 1)}>
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className="grid gap-0 py-8 sm:grid-cols-2">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center border border-[#24190D] bg-white px-6 py-5 text-[1rem] font-semibold tracking-[0.04em] text-[#24190D] transition hover:bg-[#24190D] hover:text-white"
                onClick={() => addToCart(product, selectedSize, quantity)}
              >
                Add to cart
              </button>
              <RazorpayButton
                amount={product.salePrice * quantity}
                customer={{}}
                className="inline-flex w-full items-center justify-center border border-[#24190D] bg-[#24190D] px-6 py-5 text-[1rem] font-semibold tracking-[0.04em] text-white transition hover:bg-[#3A2A16]"
                onSuccess={() => toast.success('Payment completed. Continue through checkout for saved order flow.')}
              >
                Buy it now
              </RazorpayButton>
            </div>

            <div className="space-y-4 border-b border-[#DED4C5] pb-8">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center border border-[#24190D] px-6 py-5 text-[1rem] font-semibold tracking-[0.04em] text-[#24190D] transition hover:bg-[#F5EFE8]"
                onClick={openCustomizationChat}
              >
                Inquire about customization
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  className={`inline-flex flex-1 items-center justify-center gap-2 border px-4 py-3 text-sm transition ${
                    hasInWishlist(product.id) ? 'border-[#24190D] bg-[#24190D] text-white' : 'border-[#DED4C5] text-[#1F170E] hover:bg-[#F5EFE8]'
                  }`}
                  onClick={() => toggleWishlist(product)}
                >
                  <FiHeart /> Wishlist
                </button>
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-2 border border-[#DED4C5] px-4 py-3 text-sm text-[#1F170E] transition hover:bg-[#F5EFE8]"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('Product link copied')
                  }}
                >
                  <FiShare2 /> Share
                </button>
              </div>
            </div>

            <div className="border-b border-[#DED4C5] py-2">
              {accordionSections.map((section) => (
                <details key={section.id} className="group border-b border-[#EEE5D9] py-0 last:border-b-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[1rem] font-medium text-[#1F170E]">
                    {section.title}
                    <FiChevronDown className="text-base transition group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 pr-8 text-sm leading-7 text-[#7A6C59]">{detailsContent[section.id]}</p>
                </details>
              ))}
            </div>

            <div className="py-8">
              <div className="rounded-[16px] border border-[#E6DCCD] bg-[#FBF7F2] px-5 py-4 text-sm text-[#7D6C58]">
                <p className="flex items-center gap-2 font-medium text-[#1F170E]">
                  <FiTruck /> Delivery by {getDeliveryEstimate(7)}
                </p>
              </div>
            </div>

            <div className="border-t border-[#EEE5D9] pt-8">
              <h3 className="text-[1.05rem] font-medium text-[#1F170E]">Need help with this product?</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a
                  href="tel:+919015342951"
                  className="inline-flex items-center justify-center gap-2 border border-[#DED4C5] px-5 py-4 text-[1rem] font-medium text-[#1F170E] transition hover:bg-[#F5EFE8]"
                >
                  <FiPhone />
                  Call
                </a>
                <a
                  href="https://wa.me/919015342951"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-[#DED4C5] px-5 py-4 text-[1rem] font-medium text-[#1F170E] transition hover:bg-[#F5EFE8]"
                >
                  <FaWhatsapp />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell pb-12 pt-2 sm:pb-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8A7A61]">Curated For You</p>
            <h2 className="mt-3 text-3xl font-medium uppercase tracking-[-0.03em] text-[#22180C] sm:text-4xl">
              You may also like
            </h2>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} variant="category-reference" />
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[45] border-t border-[#DED4C5] bg-white/96 px-3 py-3 shadow-[0_-18px_42px_rgba(33,26,19,0.14)] backdrop-blur-xl sm:hidden">
        <div className="mx-auto max-w-md">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1F170E]">{product.name}</p>
              <p className="mt-0.5 text-[11px] text-[#6E5F4C]">Size {selectedSize} | Qty {quantity}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-[#1F170E]">{formatPrice(product.salePrice * quantity)}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center border border-[#24190D] bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#24190D]"
              onClick={() => addToCart(product, selectedSize, quantity)}
            >
              Add to cart
            </button>
            <RazorpayButton
              amount={product.salePrice * quantity}
              customer={{}}
              className="inline-flex min-h-11 items-center justify-center border border-[#24190D] bg-[#24190D] px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white"
              onSuccess={() => toast.success('Payment completed. Continue through checkout for saved order flow.')}
            >
              Buy now
            </RazorpayButton>
          </div>
        </div>
      </div>

      {sizeChartOpen && (
        <div className="fixed inset-0 z-[70] flex items-end bg-[rgba(22,15,9,0.68)] sm:items-center sm:justify-center">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close size chart"
            onClick={() => setSizeChartOpen(false)}
          />
          <div className="relative z-10 h-[88vh] w-full overflow-hidden rounded-t-[18px] bg-white shadow-[0_-12px_36px_rgba(34,24,12,0.18)] sm:h-[90vh] sm:max-w-6xl sm:rounded-[18px]">
            <div className="flex h-full flex-col overflow-hidden">
              <div className="shrink-0 border-b border-[#2B2116] px-4 pb-4 pt-4 sm:px-7 sm:pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 text-center">
                    <h2 className="mx-auto max-w-3xl text-[0.9rem] font-semibold tracking-[-0.02em] text-[#1F170E] sm:text-[1.35rem]">
                      {product.name}
                    </h2>
                    <p className="mt-1.5 text-[0.8rem] text-[#3F352B] sm:text-[0.9rem]">Size Charts</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center text-[1.5rem] leading-none text-[#1F170E] sm:h-9 sm:w-9"
                    onClick={() => setSizeChartOpen(false)}
                    aria-label="Close size chart"
                  >
                    <FiX />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-7 sm:py-5">
                <div className="border border-[#EEE5D9] bg-white p-2 sm:p-4">
                  <div className="mb-0 flex items-end gap-0">
                    <button
                      type="button"
                      className={`border border-b-0 px-4 py-2.5 text-[0.82rem] font-semibold sm:px-5 sm:py-3 sm:text-[0.9rem] ${
                        sizeChartUnit === 'cm' ? 'bg-white text-[#1F170E]' : 'bg-[#FBFBFB] text-[#B8B0A5]'
                      }`}
                      onClick={() => setSizeChartUnit('cm')}
                    >
                      CM
                    </button>
                    <button
                      type="button"
                      className={`border border-b-0 px-4 py-2.5 text-[0.82rem] font-semibold sm:px-5 sm:py-3 sm:text-[0.9rem] ${
                        sizeChartUnit === 'inches' ? 'bg-white text-[#1F170E]' : 'bg-[#FBFBFB] text-[#B8B0A5]'
                      }`}
                      onClick={() => setSizeChartUnit('inches')}
                    >
                      Inches
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-[#EEE5D9] p-2 sm:p-4">
                    <div className="min-w-[700px] overflow-hidden border border-[#E5E0D8]">
                      <div className="grid grid-cols-[0.8fr_1.5fr_0.9fr_1.35fr_1fr_1fr_0.9fr] bg-white text-center text-[10px] font-semibold uppercase tracking-[0.06em] text-[#1F170E] sm:text-[0.76rem]">
                        {sizeChartColumns.map((column) => (
                          <div key={column} className="border-r border-b border-[#E5E0D8] px-2 py-2 last:border-r-0 sm:py-2.5">
                            {column}
                          </div>
                        ))}
                      </div>
                      {sizeChartData[sizeChartUnit].map((row) => (
                        <div
                          key={`${sizeChartUnit}-${row[0]}`}
                          className="grid grid-cols-[0.8fr_1.5fr_0.9fr_1.35fr_1fr_1fr_0.9fr] text-center text-[0.78rem] text-[#1F170E] sm:text-[0.86rem]"
                        >
                          {row.map((cell, index) => (
                            <div
                              key={`${row[0]}-${sizeChartColumns[index]}`}
                              className={`border-r border-b border-[#E5E0D8] px-2 py-2 sm:py-2.5 ${index === 0 ? 'font-semibold' : ''} ${
                                index === row.length - 1 ? 'last:border-r-0' : ''
                              }`}
                            >
                              {cell}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border border-[#EEE5D9]">
                  <div className="grid grid-cols-2">
                    <button
                      type="button"
                      className={`border-r border-b border-[#EEE5D9] px-3 py-3 text-[0.82rem] font-medium sm:px-5 sm:text-[0.9rem] ${
                        sizeChartSection === 'details' ? 'bg-white text-[#1F170E]' : 'bg-[#FBFBFB] text-[#C1B9AE]'
                      }`}
                      onClick={() => setSizeChartSection('details')}
                    >
                      Measurement Details
                    </button>
                    <button
                      type="button"
                      className={`border-b border-[#EEE5D9] px-3 py-3 text-[0.82rem] font-medium sm:px-5 sm:text-[0.9rem] ${
                        sizeChartSection === 'how-to' ? 'bg-white text-[#1F170E]' : 'bg-[#FBFBFB] text-[#C1B9AE]'
                      }`}
                      onClick={() => setSizeChartSection('how-to')}
                    >
                      How To Measure
                    </button>
                  </div>
                  <div className="space-y-4 px-4 py-4 text-[0.84rem] leading-6 text-[#1F170E] sm:px-5 sm:py-5 sm:text-[0.92rem] sm:leading-7">
                    {sizeChartSection === 'details' ? (
                      <>
                        <p>
                          For custom measurements, connect with us on{' '}
                          <a
                            href="https://wa.me/919015342951?text=Hi%20ELANTRAA%2C%20I%20need%20help%20with%20custom%20measurements."
                            target="_blank"
                            rel="noreferrer"
                            className="break-all text-[#2D43D6] underline underline-offset-4"
                          >
                            WhatsApp
                          </a>{' '}
                          or email support@elantraa.com.
                        </p>
                        <ol className="space-y-3 pl-5">
                          {measurementDetails.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ol>
                      </>
                    ) : (
                      <ol className="space-y-3 pl-5">
                        {howToMeasureDetails.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductPage
