function SectionHeader({ eyebrow, title, description, action, variant }) {
  if (variant === 'lined') {
    return (
      <div className="mb-8 sm:mb-10">
        <div className="mb-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#8E7E67]">Curated Edit</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,#E5DED4)]" aria-hidden="true" />
          <h2 className="text-center text-2xl font-semibold uppercase leading-none tracking-[-0.03em] text-[#1F170E] sm:text-4xl">
            {title}
          </h2>
          <span className="h-px flex-1 bg-[linear-gradient(90deg,#E5DED4,transparent)]" aria-hidden="true" />
        </div>
        {description && <p className="mt-3 text-center text-sm leading-7 text-[#6E5F4C]">{description}</p>}
      </div>
    )
  }

  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 md:flex-row md:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand">{eyebrow}</p>
        )}
        <h2 className="text-3xl font-semibold uppercase tracking-[-0.03em] text-[#1F170E] sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6E5F4C]">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export default SectionHeader
