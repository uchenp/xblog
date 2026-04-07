export default function PostLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12">
        <article className="space-y-8">
          <div className="space-y-4">
            <div className="h-4 w-32 rounded bg-muted animate-pulse" />
            <div className="h-10 w-3/4 rounded bg-muted animate-pulse" />
            <div className="flex gap-4">
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              <div className="h-4 w-20 rounded bg-muted animate-pulse" />
              <div className="h-4 w-16 rounded bg-muted animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-14 rounded-full bg-muted animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
            <div className="h-40 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
          </div>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-3">
            <div className="h-5 w-12 rounded bg-muted animate-pulse" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-full rounded bg-muted animate-pulse" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
