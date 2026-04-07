export default function AboutLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="space-y-6">
        <div className="h-10 w-32 rounded-lg bg-muted animate-pulse" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-24 rounded bg-muted animate-pulse" />
          <div className="h-10 w-24 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  )
}
