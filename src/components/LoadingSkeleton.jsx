function LoadingSkeleton({ cards = 4 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[28px] border border-[#f0dde5] bg-white">
          <div className="h-72 animate-pulse bg-[#f7e8ee]" />
          <div className="space-y-3 p-5">
            <div className="h-4 animate-pulse rounded-full bg-[#f7e8ee]" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-[#f7e8ee]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
