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
    <aside className="glass-card h-fit p-5">
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]">Price Range</h3>
        <div className="space-y-3 text-sm text-[#6f5160]">
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
          <p>Up to Rs. {filters.maxPrice.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]">Color</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <label key={color} className="flex items-center gap-3 text-sm text-[#6f5160]">
              <input
                type="checkbox"
                checked={filters.colors.includes(color)}
                onChange={() => toggleArrayValue('colors', color)}
                className="accent-brand"
              />
              {color}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]">Fabric</h3>
        <div className="space-y-2">
          {fabrics.map((fabric) => (
            <label key={fabric} className="flex items-center gap-3 text-sm text-[#6f5160]">
              <input
                type="checkbox"
                checked={filters.fabrics.includes(fabric)}
                onChange={() => toggleArrayValue('fabrics', fabric)}
                className="accent-brand"
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
