import { useEffect, useMemo, useState } from 'react'
import { FiChevronDown, FiFilter } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import FilterSidebar from '../components/FilterSidebar'
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

  return (
    <>
      <Seo title={category?.name || 'Category'} description={category?.description} />

      <section className="container-shell page-section">
        <div className="section-panel overflow-hidden rounded-[34px] p-3 sm:p-4">
          <div className="grid overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#fff7e8_0%,#f8e7bb_100%)] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#C9A227]">Collection Edit</p>
              <p className="mt-4 heading-display text-4xl leading-[0.95] text-[#7B5B17] sm:text-6xl">{heroTitle}</p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#9C7B28] sm:text-base">
                {category?.description || 'Discover our latest collection with timeless silhouettes and occasion-ready styling.'}
              </p>
            </div>
            <div className="relative min-h-[260px] p-4 sm:min-h-[340px] sm:p-6">
              <div className="absolute right-5 top-5 h-20 w-20 rounded-full bg-[rgba(255,255,255,0.4)] blur-xl sm:h-28 sm:w-28" />
              <div className="relative h-full overflow-hidden rounded-[26px] border border-[rgba(201,162,39,0.18)] bg-white shadow-[0_24px_70px_rgba(168,132,31,0.16)]">
                {category?.image ? (
                  <img src={category.image} alt={category?.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#E0B84A_0%,#A8841F_100%)] text-white">
                    <p className="heading-display text-4xl">{heroTitle}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,26,10,0.04),rgba(34,26,10,0.22))]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between rounded-[22px] border border-[rgba(201,162,39,0.16)] bg-[rgba(255,255,255,0.7)] px-4 py-4 text-[#B08E39] shadow-[0_16px_40px_rgba(168,132,31,0.06)] backdrop-blur">
          <button type="button" className="inline-flex items-center gap-2 text-[14px] font-medium sm:text-base">
            <FiFilter className="text-[18px]" />
            <span>Filter</span>
          </button>
          <div className="hidden items-center gap-3 text-[#C9A227] sm:flex">
            <span className="h-10 w-10 rounded-lg border border-[#E0B84A] bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_25%,#E0B84A_25%,#E0B84A_45%,#ffffff_45%,#ffffff_55%,#E0B84A_55%,#E0B84A_75%,#ffffff_75%,#ffffff_100%)]" />
            <span className="h-10 w-10 rounded-lg border border-[#E0B84A] bg-[linear-gradient(90deg,#E0B84A_0%,#c9a227_100%)] opacity-75" />
            <span className="h-10 w-10 rounded-lg border-2 border-[#A8841F] bg-[linear-gradient(90deg,#A8841F_0%,#A8841F_42%,transparent_42%,transparent_58%,#A8841F_58%,#A8841F_100%)]" />
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="appearance-none bg-transparent pr-7 text-right text-[14px] font-medium text-[#8C6920] outline-none sm:text-base"
            >
              <option value="newest">Sort</option>
              <option value="price-low">Price low-high</option>
              <option value="price-high">Price high-low</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#B08E39]" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
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
              <div className="glass-card p-10 text-center">
                <p className="heading-display text-4xl text-[#8C6920]">No products found</p>
                <p className="mt-3 text-sm text-[#B08E39]">
                  This category does not have any matching products yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} variant="category-reference" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default CategoryPage
