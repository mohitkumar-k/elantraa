function LoadingSkeleton({ cards = 4 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[16px] border border-line bg-white">
          <div className="h-72 animate-pulse bg-sand/45" />
          <div className="space-y-3 p-5">
            <div className="h-4 animate-pulse rounded-full bg-sand/55" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-sand/55" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
