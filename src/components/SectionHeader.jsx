function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 md:flex-row md:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand">{eyebrow}</p>
        )}
        <h2 className="heading-display text-4xl text-[#24151d] sm:text-5xl">{title}</h2>
        {description && <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f5160]">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export default SectionHeader
