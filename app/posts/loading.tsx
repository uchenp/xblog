export default function PostsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-8">
        <div className="h-10 w-48 rounded-lg bg-muted animate-pulse" />
      </header>
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <article key={i} className="rounded-lg border p-6 space-y-4">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="h-7 w-3/4 rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
              <div className="h-6 w-14 rounded-full bg-muted animate-pulse" />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
