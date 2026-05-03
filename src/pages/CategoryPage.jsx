import { useEffect, useMemo, useState } from 'react'
import { FiChevronDown, FiFilter, FiX } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import FilterSidebar, { FilterControls } from '../components/FilterSidebar'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ProductCard from '../components/ProductCard'
import Seo from '../components/Seo'
import { useCategoriesData, useProducts } from '../hooks/useStoreData'
import { slugify } from '../utils/format'

function CategoryPage() {
  const { slug } = useParams()
  const { products, loading } = useProducts()
  const { categories } = useCategoriesData()
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState({ maxPrice: 0, colors: [], fabrics: [] })
  const [filterOpen, setFilterOpen] = useState(false)

  const category = categories.find((item) => item.slug === slug || slugify(item.name) === slug)
  const categoryKeys = new Set(
    [slug, category?.slug, slugify(category?.name || ''), category?.name]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase()),
  )
  const categoryProducts = products.filter((item) => {
    const productCategory = String(item.category || '').toLowerCase()
    return categoryKeys.has(productCategory) || categoryKeys.has(slugify(item.category || ''))
  })
  const maxAvailablePrice = categoryProducts.reduce((max, item) => Math.max(max, Number(item.salePrice || 0)), 0)
  const colors = [...new Set(categoryProducts.map((item) => item.color))]
  const fabrics = [...new Set(categoryProducts.map((item) => item.fabric))]
  const heroTitle = String(category?.name || 'Category')
    .replace(/-/g, ' ')
    .toUpperCase()

  useEffect(() => {
    setFilters({ maxPrice: maxAvailablePrice || 0, colors: [], fabrics: [] })
  }, [slug, maxAvailablePrice])

  useEffect(() => {
    setFilterOpen(false)
  }, [slug])

  const filtered = useMemo(() => {
    const next = categoryProducts
      .filter((item) => item.salePrice <= filters.maxPrice)
      .filter((item) => !filters.colors.length || filters.colors.includes(item.color))
      .filter((item) => !filters.fabrics.length || filters.fabrics.includes(item.fabric))

    return next.sort((a, b) => {
      if (sort === 'price-low') return a.salePrice - b.salePrice
      if (sort === 'price-high') return b.salePrice - a.salePrice
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [categoryProducts, filters, sort])

  function resetFilters() {
    setFilters({ maxPrice: maxAvailablePrice || 0, colors: [], fabrics: [] })
  }

  return (
    <>
      <Seo title={category?.name || 'Category'} description={category?.description} />

      <section className="container-shell page-section">
        <div className="border-b border-[#DED4C5] pb-6 sm:pb-8">
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-[#8E7E67]">Collection Edit</p>
              <h1 className="mt-3 text-[2.05rem] font-semibold uppercase leading-[0.96] tracking-[-0.05em] text-[#1F170E] min-[390px]:text-[2.35rem] sm:text-6xl">
                {heroTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6E5F4C] sm:mt-5 sm:text-base">
                {category?.description || 'Discover our latest collection with timeless silhouettes and occasion-ready styling.'}
              </p>
            </div>
            <div className="relative min-h-[220px] overflow-hidden rounded-[14px] border border-[#DED4C5] min-[390px]:min-h-[250px] sm:min-h-[360px] sm:rounded-[16px]">
                {category?.image ? (
                  <img src={category.image} alt={category?.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#4A4035_0%,#211A13_100%)] text-white">
                    <p className="heading-display text-4xl">{heroTitle}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,26,10,0.04),rgba(34,26,10,0.22))]" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-b border-[#DED4C5] pb-4 text-[#6E5F4C] sm:mt-8">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#1F170E] sm:text-base lg:pointer-events-none lg:text-[#6E5F4C]"
            onClick={() => setFilterOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={filterOpen}
          >
            <FiFilter className="text-[18px]" />
            <span>Filter</span>
          </button>
          <div className="hidden items-center gap-3 text-sm text-[#6E5F4C] sm:flex">
            <span>{filtered.length} styles</span>
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="appearance-none bg-transparent pr-7 text-right text-[14px] font-medium text-[#1F170E] outline-none sm:text-base"
            >
              <option value="newest">Sort</option>
              <option value="price-low">Price low-high</option>
              <option value="price-high">Price high-low</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#6E5F4C]" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            colors={colors}
            fabrics={fabrics}
            maxAvailablePrice={maxAvailablePrice}
          />
          <div>
            {loading ? (
              <LoadingSkeleton cards={8} />
            ) : filtered.length === 0 ? (
              <div className="border border-[#DED4C5] p-8 text-center sm:p-10">
                <p className="text-2xl font-semibold uppercase tracking-[-0.03em] text-[#1F170E] sm:text-4xl">No products found</p>
                <p className="mt-3 text-sm text-[#6E5F4C]">
                  This category does not have any matching products yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 min-[390px]:gap-x-4 lg:grid-cols-3 lg:gap-y-8 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} variant="category-reference" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {filterOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filter products">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(33,26,19,0.36)] backdrop-blur-[2px]"
            onClick={() => setFilterOpen(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-hidden rounded-t-[18px] bg-white shadow-[0_-18px_50px_rgba(33,26,19,0.18)]">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Filter</p>
                <p className="mt-1 text-sm text-muted">{filtered.length} styles found</p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-xl text-ink"
                onClick={() => setFilterOpen(false)}
                aria-label="Close filters"
              >
                <FiX />
              </button>
            </div>
            <div className="max-h-[calc(82vh-8.5rem)] overflow-y-auto px-5 py-5">
              <FilterControls
                filters={filters}
                setFilters={setFilters}
                colors={colors}
                fabrics={fabrics}
                maxAvailablePrice={maxAvailablePrice}
              />
            </div>
            <div className="grid grid-cols-[0.85fr_1.15fr] gap-3 border-t border-line bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-line px-4 py-3 text-sm font-semibold text-ink"
                onClick={resetFilters}
              >
                Reset
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white"
                onClick={() => setFilterOpen(false)}
              >
                View {filtered.length} styles
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CategoryPage
