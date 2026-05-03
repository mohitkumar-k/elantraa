import { useEffect, useMemo, useState } from 'react'
import { FiChevronDown, FiFilter, FiSearch, FiX } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import { FilterControls } from '../components/FilterSidebar'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ProductCard from '../components/ProductCard'
import Seo from '../components/Seo'
import { useCategoriesData, useProducts } from '../hooks/useStoreData'
import { slugify } from '../utils/format'

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const { products, loading } = useProducts()
  const { categories } = useCategoriesData()
  const [query, setQuery] = useState(initialQuery)
  const [sort, setSort] = useState('relevance')
  const [category, setCategory] = useState('all')
  const [filters, setFilters] = useState({ maxPrice: 0, colors: [], fabrics: [] })
  const [filterOpen, setFilterOpen] = useState(false)

  const maxAvailablePrice = products.reduce((max, item) => Math.max(max, Number(item.salePrice || 0)), 0)
  const colors = [...new Set(products.map((item) => item.color).filter(Boolean))]
  const fabrics = [...new Set(products.map((item) => item.fabric).filter(Boolean))]

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      maxPrice: current.maxPrice || maxAvailablePrice || 0,
    }))
  }, [maxAvailablePrice])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    const ranked = products
      .map((product) => {
        const name = String(product.name || '').toLowerCase()
        const productCategory = String(product.category || '').toLowerCase()
        const color = String(product.color || '').toLowerCase()
        const fabric = String(product.fabric || '').toLowerCase()
        const description = String(product.description || '').toLowerCase()
        const haystack = [name, productCategory, color, fabric, description].join(' ')
        const score = !term
          ? 1
          : name.includes(term)
            ? 5
            : productCategory.includes(term)
              ? 4
              : color.includes(term) || fabric.includes(term)
                ? 3
                : description.includes(term)
                  ? 2
                  : 0

        return { product, score, matches: !term || haystack.includes(term) }
      })
      .filter((item) => item.matches)
      .filter(({ product }) => category === 'all' || slugify(product.category || '') === category || product.category === category)
      .filter(({ product }) => Number(product.salePrice || 0) <= filters.maxPrice)
      .filter(({ product }) => !filters.colors.length || filters.colors.includes(product.color))
      .filter(({ product }) => !filters.fabrics.length || filters.fabrics.includes(product.fabric))

    return ranked
      .sort((a, b) => {
        if (sort === 'price-low') return a.product.salePrice - b.product.salePrice
        if (sort === 'price-high') return b.product.salePrice - a.product.salePrice
        if (sort === 'newest') return new Date(b.product.createdAt) - new Date(a.product.createdAt)
        return b.score - a.score
      })
      .map((item) => item.product)
  }, [category, filters, products, query, sort])

  function applySearch(event) {
    event.preventDefault()
    const next = query.trim()
    setSearchParams(next ? { q: next } : {})
  }

  function resetFilters() {
    setCategory('all')
    setFilters({ maxPrice: maxAvailablePrice || 0, colors: [], fabrics: [] })
  }

  return (
    <>
      <Seo title={query ? `Search: ${query}` : 'Search'} description="Search ELANTRAA styles by product, category, color, or fabric." />

      <section className="container-shell page-section">
        <div className="border-b border-[#DED4C5] pb-6 sm:pb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-[#8E7E67]">Search</p>
          <h1 className="mt-3 text-[2.05rem] font-semibold uppercase leading-[0.96] tracking-[-0.05em] text-[#1F170E] min-[390px]:text-[2.35rem] sm:text-6xl">
            Find your style
          </h1>
          <form onSubmit={applySearch} className="mt-5 flex max-w-3xl border border-[#DED4C5] bg-white">
            <div className="flex flex-1 items-center gap-3 px-4">
              <FiSearch className="shrink-0 text-lg text-[#6E5F4C]" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sarees, lehengas, colors, fabric..."
                className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-[#1F170E] outline-none placeholder:text-[#8E7E67] sm:text-base"
              />
            </div>
            <button type="submit" className="bg-[#24190D] px-4 text-xs font-semibold uppercase tracking-[0.08em] text-white sm:px-6 sm:text-sm">
              Search
            </button>
          </form>
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
            <span>{results.length} styles</span>
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="appearance-none bg-transparent pr-7 text-right text-[14px] font-medium text-[#1F170E] outline-none sm:text-base"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price low-high</option>
              <option value="price-high">Price high-low</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#6E5F4C]" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden h-fit border border-[#DED4C5] bg-white p-5 lg:block">
            <div className="mb-8">
              <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.22em] text-ink">Category</h3>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full border border-[#DED4C5] bg-white px-3 py-3 text-sm text-[#1F170E] outline-none"
              >
                <option value="all">All categories</option>
                {categories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <FilterControls filters={filters} setFilters={setFilters} colors={colors} fabrics={fabrics} maxAvailablePrice={maxAvailablePrice} />
          </aside>
          <div>
            {loading ? (
              <LoadingSkeleton cards={8} />
            ) : results.length === 0 ? (
              <div className="border border-[#DED4C5] p-8 text-center sm:p-10">
                <p className="text-2xl font-semibold uppercase tracking-[-0.03em] text-[#1F170E] sm:text-4xl">No styles found</p>
                <p className="mt-3 text-sm leading-6 text-[#6E5F4C]">Try a different keyword or clear a few filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 min-[390px]:gap-x-4 lg:grid-cols-3 lg:gap-y-8 xl:grid-cols-4">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} variant="category-reference" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {filterOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filter search results">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(33,26,19,0.36)] backdrop-blur-[2px]"
            onClick={() => setFilterOpen(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-hidden rounded-t-[18px] bg-white shadow-[0_-18px_50px_rgba(33,26,19,0.18)]">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Filter search</p>
                <p className="mt-1 text-sm text-muted">{results.length} styles found</p>
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
              <div className="mb-8">
                <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.22em] text-ink">Category</h3>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full border border-[#DED4C5] bg-white px-3 py-3 text-sm text-[#1F170E] outline-none"
                >
                  <option value="all">All categories</option>
                  {categories.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <FilterControls filters={filters} setFilters={setFilters} colors={colors} fabrics={fabrics} maxAvailablePrice={maxAvailablePrice} />
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
                View {results.length} styles
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SearchPage
