function SectionHeader({ eyebrow, title, description, action, variant }) {
  if (variant === 'lined') {
    return (
      <div className="mb-8 sm:mb-10">
        <div className="mb-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A227]">Curated Edit</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(201,162,39,0.9))]" aria-hidden="true" />
          <h2 className="heading-display text-center text-3xl text-[#8C6920] sm:text-5xl">
            {title}
          </h2>
          <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(201,162,39,0.9),transparent)]" aria-hidden="true" />
        </div>
        {description && <p className="mt-3 text-center text-sm leading-7 text-[#B08E39]">{description}</p>}
      </div>
    )
  }

  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 md:flex-row md:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand">{eyebrow}</p>
        )}
        <h2 className="heading-display text-4xl text-[#8C6920] sm:text-5xl">{title}</h2>
        {description && <p className="mt-3 max-w-2xl text-sm leading-7 text-[#B08E39]">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export default SectionHeader
