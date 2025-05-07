export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-4"></div>
        <div className="h-8 w-64 bg-muted rounded mb-8"></div>

        <div className="h-10 bg-muted rounded mb-6"></div>

        <div className="space-y-4">
          <div className="h-64 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )
}
