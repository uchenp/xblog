export default function CategoriesLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="h-10 w-32 rounded-lg bg-muted animate-pulse mb-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg border bg-muted/30 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
