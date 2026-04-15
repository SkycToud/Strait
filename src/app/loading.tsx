export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-24 px-6 md:px-12 lg:px-24 2xl:px-40 w-full">
      {/* Hero Skeleton */}
      <header className="mb-6 md:mb-12">
        <div className="h-10 md:h-16 w-48 bg-surface-container-low rounded-lg animate-pulse mb-2 md:mb-4"></div>
        <div className="h-4 md:h-5 w-full max-w-2xl bg-surface-container-low rounded-lg animate-pulse"></div>
      </header>

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Upcoming Schedule Skeleton */}
        <section className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="h-6 w-32 bg-surface-container-low rounded-lg animate-pulse"></div>
            <div className="h-4 w-16 bg-surface-container-low rounded-lg animate-pulse"></div>
          </div>
          <div className="h-48 md:h-64 rounded-3xl bg-surface-container-low animate-pulse"></div>
        </section>

        {/* Facility Status Skeleton */}
        <section className="lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="h-6 w-40 bg-surface-container-low rounded-lg animate-pulse"></div>
            <div className="h-4 w-16 bg-surface-container-low rounded-lg animate-pulse"></div>
          </div>
          <div className="flex flex-col gap-3 h-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-lowest p-4 md:p-5 rounded-2xl flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-surface-container-low"></div>
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-24 bg-surface-container-low rounded"></div>
                    <div className="h-3 w-20 bg-surface-container-low rounded"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-16">
                  <div className="h-5 w-full bg-surface-container-low rounded-full"></div>
                  <div className="h-3 w-full bg-surface-container-low rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notices Skeleton */}
        <section className="lg:col-span-12">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="h-6 w-48 bg-surface-container-low rounded-lg animate-pulse"></div>
            <div className="h-4 w-16 bg-surface-container-low rounded-lg animate-pulse"></div>
          </div>
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-outline-variant/10 last:border-0 animate-pulse">
                <div className="h-4 w-16 bg-surface-container-low rounded"></div>
                <div className="h-5 w-16 bg-surface-container-low rounded-full"></div>
                <div className="h-4 flex-1 bg-surface-container-low rounded"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links Skeleton */}
        <section className="lg:col-span-12">
          <div className="mb-4 px-2 flex justify-between items-center">
            <div className="h-6 w-32 bg-surface-container-low rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-container-low p-4 md:p-6 rounded-2xl md:rounded-3xl animate-pulse">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-surface-container-lowest mb-3 md:mb-4"></div>
                <div className="h-4 w-full bg-surface-container-low rounded mb-1"></div>
                <div className="h-3 w-3/4 bg-surface-container-low rounded"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
