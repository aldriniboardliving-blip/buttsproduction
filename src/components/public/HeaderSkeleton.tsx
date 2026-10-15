export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between" aria-label="Main navigation">
          <div className="flex items-center">
            <div className="h-8 w-32 bg-neutral-200 animate-pulse rounded" />
          </div>

          <div className="hidden md:flex md:items-center md:gap-8">
            <div className="h-6 w-24 bg-neutral-200 animate-pulse rounded" />
            <div className="h-6 w-24 bg-neutral-200 animate-pulse rounded" />
            <div className="h-6 w-24 bg-neutral-200 animate-pulse rounded" />
            <div className="h-6 w-24 bg-neutral-200 animate-pulse rounded" />
            <div className="h-6 w-24 bg-neutral-200 animate-pulse rounded" />
            <div className="h-6 w-24 bg-neutral-200 animate-pulse rounded" />
            <div className="h-6 w-24 bg-neutral-200 animate-pulse rounded" />
            <div className="h-6 w-24 bg-neutral-200 animate-pulse rounded" />
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            <div className="h-10 w-32 bg-neutral-200 animate-pulse rounded-lg" />
          </div>

          <div className="md:hidden">
            <div className="h-6 w-6 bg-neutral-200 animate-pulse rounded" />
          </div>
        </nav>
      </div>
    </header>
  );
}