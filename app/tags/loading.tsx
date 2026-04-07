export default function TagsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="h-10 w-32 rounded-lg bg-muted animate-pulse mb-8" />
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  )
}
