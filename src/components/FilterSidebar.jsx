function FilterSidebar({ filters, setFilters, colors, fabrics, maxAvailablePrice = 20000 }) {
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
    <aside className="hidden h-fit rounded-[18px] bg-white p-5 shadow-[0_18px_40px_rgba(36,21,29,0.06)] lg:block">
      <div className="mb-8">
        <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.28em] text-[#24151d]">Price Range</h3>
        <div className="space-y-4 text-sm text-[#6f5160]">
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
          <p className="text-[14px] text-[#6f5160]">Up to Rs. {filters.maxPrice.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.28em] text-[#24151d]">Color</h3>
        <div className="space-y-3">
          {colors.map((color) => (
            <label key={color} className="flex items-center gap-3 text-[14px] text-[#6f5160]">
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
        <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.28em] text-[#24151d]">Fabric</h3>
        <div className="space-y-3">
          {fabrics.map((fabric) => (
            <label key={fabric} className="flex items-center gap-3 text-[14px] text-[#6f5160]">
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
    </aside>
  )
}

export default FilterSidebar
