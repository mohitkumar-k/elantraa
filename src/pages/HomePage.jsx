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
          <div className="absolute inset-x-0 bottom-6 flex justify-center px-4">
            <div className="min-w-[160px] bg-white px-6 py-3 text-center shadow-[0_14px_35px_rgba(36,21,29,0.12)] sm:min-w-[220px] sm:px-8 sm:py-4">
              <h3 className="text-2xl font-semibold leading-none text-[#24151d] sm:text-3xl">{category.name}</h3>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

function HomePage() {
  const { categories } = useCategoriesData()
  const { homeContent } = useHomeContentData()
  const { products, loading } = useProducts()
  const trending = products.slice(0, 4)
  const hero = homeContent?.hero

  return (
    <>
      <Seo title="Home" description="Premium Indian fashion with new arrivals, sarees, lehengas, and festive edits." />

      <section className="container-shell page-section">
        <div className="grid overflow-hidden rounded-[36px] bg-[#f9ebf1] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand">{hero?.eyebrow}</p>
            <h1 className="heading-display max-w-xl text-5xl leading-none text-[#24151d] sm:text-6xl lg:text-7xl">
              {hero?.title}
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-[#6f5160] sm:text-base">
              {hero?.description}
            </p>
            <div className="mt-8">
              <Link to={hero?.ctaLink || '/'} className="btn-primary gap-2">
                {hero?.ctaLabel} <FiArrowRight />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[380px] bg-[linear-gradient(180deg,rgba(194,24,91,0.06),rgba(194,24,91,0.22))]">
            <img
              src={hero?.image}
              alt={hero?.imageAlt || hero?.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-shell page-section">
        <SectionHeader
          eyebrow="Categories"
          title="Shop By Category"
          description="Designed for wedding season, festive nights, and polished day celebrations."
        />
        <div className="grid gap-5 grid-cols-2">
          {categories.map((category, index) => (
            <CategoryFeatureCard key={category.slug} category={category} index={index} total={categories.length} />
          ))}
        </div>
      </section>

      <section className="container-shell page-section">
        <SectionHeader
          eyebrow="Latest Edit"
          title="New Arrivals"
          description="Fresh drops in signature silhouettes with sale pricing and festive-ready detailing."
        />
        {loading ? (
          <LoadingSkeleton cards={4} />
        ) : (
          <div className="overflow-x-auto overflow-y-hidden pb-2 touch-pan-x overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]">
            <div className="flex w-max snap-x snap-mandatory gap-5 pr-4">
              {products.slice(0, 8).map((product) => (
                <div key={product.id} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="container-shell page-section">
        <SectionHeader eyebrow="Trending" title="Popular Right Now" />
        {loading ? (
          <LoadingSkeleton cards={4} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default HomePage
