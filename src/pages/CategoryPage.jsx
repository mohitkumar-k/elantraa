import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import FilterSidebar from '../components/FilterSidebar'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ProductCard from '../components/ProductCard'
import Seo from '../components/Seo'
import SectionHeader from '../components/SectionHeader'
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
        <SectionHeader
          eyebrow="Collection"
          title={category?.name || 'Category'}
          description={category?.description || 'Explore our curated fashion edit.'}
          action={
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-full border border-[#f0dde5] bg-white px-5 py-3 text-sm text-[#24151d]"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price low-high</option>
              <option value="price-high">Price high-low</option>
            </select>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
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
                <p className="heading-display text-4xl text-[#24151d]">No products found</p>
                <p className="mt-3 text-sm text-[#6f5160]">
                  This category does not have any matching products yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
