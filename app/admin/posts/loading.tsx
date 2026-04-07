export default function AdminPostsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 rounded bg-muted animate-pulse" />
        <div className="h-10 w-28 rounded bg-muted animate-pulse" />
      </div>
      <div className="rounded-lg border">
        <div className="border-b bg-muted/30 p-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5 h-4 rounded bg-muted animate-pulse" />
            <div className="col-span-2 h-4 rounded bg-muted animate-pulse" />
            <div className="col-span-3 h-4 rounded bg-muted animate-pulse" />
            <div className="col-span-2 h-4 rounded bg-muted animate-pulse" />
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b p-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-5 h-4 rounded bg-muted/50 animate-pulse" />
              <div className="col-span-2 h-4 rounded bg-muted/50 animate-pulse" />
              <div className="col-span-3 h-4 rounded bg-muted/50 animate-pulse" />
              <div className="col-span-2 h-4 rounded bg-muted/50 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
