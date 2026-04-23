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
      <Link to={`/category/${category.slug}`} className="group block overflow-hidden bg-white">
        <div className="relative h-full">
          <img
            src={category.image}
            alt={category.name}
            className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
              isLastOddCard ? 'h-[300px] sm:h-[380px] lg:h-[420px]' : 'h-[240px] sm:h-[320px] lg:h-[360px]'
            }`}
          />
          <div className="absolute inset-x-0 bottom-4 flex justify-center px-3 sm:bottom-5">
            <div className="flex min-h-[52px] w-[112px] items-center justify-center bg-white px-2.5 py-1.5 text-center sm:min-h-[62px] sm:w-[136px] sm:px-3 sm:py-2">
              <h3 className="max-w-[10ch] text-[13px] font-bold leading-[0.95] tracking-[-0.04em] text-[#24151d] sm:text-[16px]">
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

function getTrendingMeta(index) {
  const ratingSet = [4.5, 5, 4, 4.5]
  const reviewSet = [58, 28, 46, 34]

  return {
    rating: ratingSet[index % ratingSet.length],
    reviewCount: reviewSet[index % reviewSet.length],
  }
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
        <div className="grid overflow-hidden rounded-[28px] bg-[#f9ebf1] sm:rounded-[36px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-5 sm:p-12 lg:p-16">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand sm:mb-4 sm:text-xs sm:tracking-[0.3em]">
              {hero?.eyebrow}
            </p>
            <h1 className="heading-display max-w-xl text-3xl leading-none text-[#24151d] sm:text-6xl lg:text-7xl">
              {hero?.title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#6f5160] sm:mt-6 sm:max-w-lg sm:text-base sm:leading-7">
              {hero?.description}
            </p>
            <div className="mt-6 sm:mt-8">
              <Link to={hero?.ctaLink || '/'} className="btn-primary gap-2 px-5 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm">
                {hero?.ctaLabel} <FiArrowRight />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[220px] bg-[linear-gradient(180deg,rgba(194,24,91,0.06),rgba(194,24,91,0.22))] sm:min-h-[380px]">
            <img
              src={hero?.image}
              alt={hero?.imageAlt || hero?.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-shell page-section">
        <SectionHeader title="Shop By Category" variant="lined" />
        <div className="grid gap-5 grid-cols-2">
          {categories.map((category, index) => (
            <CategoryFeatureCard key={category.slug} category={category} index={index} total={categories.length} />
          ))}
        </div>
      </section>

      <section className="container-shell page-section">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="text-[1.30rem] font-semibold tracking-[-0.05em] text-[#24151d] sm:text-[2.45rem]">
            New Arrival
          </h2>
          <p className="heading-display mt-1 text-[1.00rem] leading-[1.15] italic text-[#8d8784] sm:text-[2.1rem]">
            Hot Selling Designer Lehenga with Premium Quality
          </p>
        </div>
        {loading ? (
          <LoadingSkeleton cards={4} />
        ) : (
          <div className="overflow-x-auto overflow-y-hidden pb-2 snap-x snap-mandatory overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none]">
            <div className="flex w-full">
              {arrivalSlides.map((slide, slideIndex) => (
                <div key={`arrival-slide-${slideIndex}`} className="w-full shrink-0 snap-start pr-3 sm:pr-0">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5">
                    {slide.map((product) => (
                      <ProductCard key={product.id} product={product} variant="arrival-reference" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="container-shell page-section">
        <div className="mb-8 text-center sm:mb-10">
          <div className="flex items-center justify-center gap-5">
            <span className="h-1 w-16 bg-[#24151d]" aria-hidden="true" />
            <p className="text-l font-bold uppercase tracking-[-0.03em] text-[#24151d] sm:text-3xl">Trending</p>
            <span className="h-1 w-16 bg-[#24151d]" aria-hidden="true" />
          </div>
          <p className="heading-display mt-2 text-base italic text-[#8d8784] sm:text-l">Top view in this week</p>
        </div>
        {loading ? (
          <LoadingSkeleton cards={4} />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 xl:grid-cols-4">
            {trending.map((product, index) => {
              const { rating, reviewCount } = getTrendingMeta(index)

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="trending-reference"
                  rating={rating}
                  reviewCount={reviewCount}
                />
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}

export default HomePage
