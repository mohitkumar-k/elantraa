import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import Seo from '../components/Seo'
import { useCategoriesData, useHomeContentData, useProducts } from '../hooks/useStoreData'

function CategoryFeatureCard({ category, index, total }) {
  if (!category) return null
  const isLastOddCard = total % 2 === 1 && index === total - 1

  return (
    <div
      className={`fade-in-up ${isLastOddCard ? 'col-span-2' : ''}`.trim()}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <Link
        to={`/category/${category.slug}`}
        className="group block overflow-hidden rounded-[24px] border border-[rgba(201,162,39,0.14)] bg-[rgba(255,255,255,0.74)] p-2 shadow-[0_18px_48px_rgba(168,132,31,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(168,132,31,0.14)]"
      >
        <div className="relative h-full">
          <img
            src={category.image}
            alt={category.name}
            className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
              isLastOddCard ? 'h-[300px] rounded-[20px] sm:h-[380px] lg:h-[420px]' : 'h-[240px] rounded-[20px] sm:h-[320px] lg:h-[360px]'
            }`}
          />
          <div className="absolute inset-0 rounded-[20px] bg-[linear-gradient(180deg,rgba(34,26,10,0.04),rgba(34,26,10,0.42))]" />
          <div className="absolute inset-x-0 bottom-4 flex justify-center px-3 sm:bottom-5">
            <div className="w-auto max-w-[calc(100%-1.5rem)] rounded-[18px] border border-white/45 bg-[rgba(255,251,245,0.94)] px-4 py-2.5 text-center shadow-[0_10px_30px_rgba(34,26,10,0.16)] backdrop-blur sm:max-w-[220px] sm:px-5 sm:py-3">
              <h3 className="text-[12px] font-semibold uppercase leading-[1.2] tracking-[0.12em] text-[#8C6920] sm:text-[14px]">
                {category.name}
              </h3>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

function chunkProducts(items, size) {
  const chunks = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}

function HomePage() {
  const { categories } = useCategoriesData()
  const { homeContent } = useHomeContentData()
  const { products, loading } = useProducts()
  const trending = products.slice(0, 4)
  const arrivalSlides = chunkProducts(products.slice(0, 8), 2)
  const hero = homeContent?.hero

  return (
    <>
      <Seo title="Home" description="Premium Indian fashion with new arrivals, sarees, lehengas, and festive edits." />

      <section className="container-shell page-section">
        <div className="grid overflow-hidden rounded-[28px] border border-[rgba(201,162,39,0.18)] bg-[radial-gradient(circle_at_top_left,rgba(255,248,232,0.55),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(224,184,74,0.10),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.99)_0%,rgba(255,252,246,0.98)_52%,rgba(255,255,255,0.99)_100%)] shadow-[0_24px_70px_rgba(168,132,31,0.10)] sm:rounded-[36px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex flex-col justify-center p-5 sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute left-0 top-0 h-40 w-40 rounded-full bg-[rgba(224,184,74,0.08)] blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-8 h-32 w-32 rounded-full bg-[rgba(201,162,39,0.06)] blur-3xl" />
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand sm:mb-4 sm:text-xs sm:tracking-[0.3em]">
              {hero?.eyebrow}
            </p>
            <h1 className="heading-display max-w-xl text-3xl leading-none text-[#A8841F] sm:text-6xl lg:text-7xl">
              {hero?.title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#C9A227] sm:mt-6 sm:max-w-lg sm:text-base sm:leading-7">
              {hero?.description}
            </p>
            <div className="mt-6 sm:mt-8">
              <Link to={hero?.ctaLink || '/'} className="btn-primary gap-2 px-5 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm">
                {hero?.ctaLabel} <FiArrowRight />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[220px] bg-transparent sm:min-h-[380px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_34%)]" />
            <img
              src={hero?.image}
              alt={hero?.imageAlt || hero?.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(123,91,23,0.04)_0%,rgba(123,91,23,0.03)_32%,rgba(123,91,23,0.12)_100%)]" />
          </div>
        </div>
      </section>

      <section className="container-shell page-section">
        <SectionHeader
          title="Shop By Category"
          description="A softer, more elevated way to browse the silhouettes that define your next celebration."
          variant="lined"
        />
        <div className="grid gap-5 grid-cols-2">
          {categories.map((category, index) => (
            <CategoryFeatureCard key={category.slug} category={category} index={index} total={categories.length} />
          ))}
        </div>
      </section>

      <section className="container-shell page-section">
        <div className="section-panel rounded-[30px] px-4 py-8 sm:px-8 sm:py-10">
          <div className="mb-8 text-center sm:mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227]">Just In</p>
            <h2 className="mt-2 text-[1.45rem] font-semibold tracking-[-0.05em] text-[#7B5B17] sm:text-[2.75rem]">
              New Arrival
            </h2>
            <p className="heading-display mt-1 text-[1.05rem] leading-[1.15] italic text-[#B08E39] sm:text-[2.2rem]">
              Fresh festive statements with a premium finish
            </p>
          </div>
          {loading ? (
            <LoadingSkeleton cards={4} />
          ) : (
            <div className="overflow-x-auto overflow-y-hidden pb-2 snap-x snap-mandatory overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none]">
              <div className="flex w-full">
                {arrivalSlides.map((slide, slideIndex) => (
                  <div key={`arrival-slide-${slideIndex}`} className="w-full shrink-0 snap-start pr-3 sm:pr-0">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6">
                      {slide.map((product) => (
                        <ProductCard key={product.id} product={product} variant="arrival-reference" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="container-shell page-section">
        <div className="mb-8 text-center sm:mb-10">
          <div className="flex items-center justify-center gap-5">
            <span className="h-px w-16 bg-[linear-gradient(90deg,transparent,#C9A227)]" aria-hidden="true" />
            <p className="heading-display text-3xl text-[#7B5B17] sm:text-5xl">Trending</p>
            <span className="h-px w-16 bg-[linear-gradient(90deg,#C9A227,transparent)]" aria-hidden="true" />
          </div>
          <p className="mt-3 text-sm uppercase tracking-[0.26em] text-[#B08E39] sm:text-base">Most viewed this week</p>
        </div>
        {loading ? (
          <LoadingSkeleton cards={4} />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 xl:grid-cols-4">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} variant="trending-reference" />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default HomePage
