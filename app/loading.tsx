export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      {/* Hero */}
      <div className="text-center space-y-4 mb-16">
        <div className="h-12 w-3/4 mx-auto rounded-lg bg-muted animate-pulse" />
        <div className="h-4 w-1/2 mx-auto rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/3 mx-auto rounded bg-muted animate-pulse" />
      </div>
      {/* Quote */}
      <div className="rounded-lg border p-6 mb-12 space-y-2">
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
      </div>
      {/* Recent posts */}
      <div className="space-y-6">
        <div className="h-8 w-32 rounded bg-muted animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-6 space-y-3">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="h-7 w-3/4 rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
