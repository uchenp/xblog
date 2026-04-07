export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-8">
        <div className="h-10 w-24 rounded-lg bg-muted animate-pulse" />
      </header>
      <div className="h-12 w-full rounded-lg bg-muted animate-pulse mb-8" />
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 py-4 border-b">
            <div className="h-6 w-2/3 rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
