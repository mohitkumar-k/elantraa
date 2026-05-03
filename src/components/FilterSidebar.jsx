export function FilterControls({ filters, setFilters, colors, fabrics, maxAvailablePrice = 20000 }) {
  const sliderMax = Math.max(500, Math.ceil(maxAvailablePrice / 500) * 500)

  function toggleArrayValue(key, value) {
    setFilters((current) => {
      const exists = current[key].includes(value)
      return {
        ...current,
        [key]: exists ? current[key].filter((item) => item !== value) : [...current[key], value],
      }
    })
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.22em] text-ink">Price Range</h3>
        <div className="space-y-4 text-sm text-muted">
          <input
            type="range"
            min="0"
            max={sliderMax}
            step="500"
            value={filters.maxPrice}
            onChange={(event) =>
              setFilters((current) => ({ ...current, maxPrice: Number(event.target.value) }))
            }
            className="w-full accent-brand"
          />
          <p className="text-[14px] text-muted">Up to Rs. {filters.maxPrice.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.22em] text-ink">Color</h3>
        <div className="space-y-3">
          {colors.map((color) => (
            <label key={color} className="flex items-center gap-3 text-[14px] text-muted">
              <input
                type="checkbox"
                checked={filters.colors.includes(color)}
                onChange={() => toggleArrayValue('colors', color)}
                className="h-4 w-4 rounded-sm accent-brand"
              />
              {color}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.22em] text-ink">Fabric</h3>
        <div className="space-y-3">
          {fabrics.map((fabric) => (
            <label key={fabric} className="flex items-center gap-3 text-[14px] text-muted">
              <input
                type="checkbox"
                checked={filters.fabrics.includes(fabric)}
                onChange={() => toggleArrayValue('fabrics', fabric)}
                className="h-4 w-4 rounded-sm accent-brand"
              />
              {fabric}
            </label>
          ))}
        </div>
      </div>
    </>
  )
}

function FilterSidebar({ filters, setFilters, colors, fabrics, maxAvailablePrice = 20000 }) {
  return (
    <aside className="hidden h-fit border border-[#DED4C5] bg-white p-5 lg:block">
      <FilterControls
        filters={filters}
        setFilters={setFilters}
        colors={colors}
        fabrics={fabrics}
        maxAvailablePrice={maxAvailablePrice}
      />
    </aside>
  )
}

export default FilterSidebar
