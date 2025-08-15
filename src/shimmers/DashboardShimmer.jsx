export default function DashboardShimmer() {
  const CardSkeleton = () => (
    <div className="relative overflow-hidden shimmer bg-slate-800 rounded-lg p-4">
      <div className="h-6 w-24 bg-gray-600 rounded mb-2 animate-pulse"></div>
      <div className="h-8 w-16 bg-gray-600 rounded animate-pulse"></div>
    </div>
  );

  const ChartSkeleton = () => (
    <div className="relative bg-slate-800 rounded-lg p-4 h-72 overflow-hidden">
     
      <div className="absolute inset-0 shimmer"></div>

      
      <div className="flex h-full items-end justify-around space-x-2 relative z-10">
        <div className="w-4 bg-gray-600 rounded animate-pulse h-3/4"></div>
        <div className="w-4 bg-gray-600 rounded animate-pulse h-1/2"></div>
        <div className="w-4 bg-gray-600 rounded animate-pulse h-2/3"></div>
        <div className="w-4 bg-gray-600 rounded animate-pulse h-1/3"></div>
      </div>

    
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gray-600 animate-pulse z-10"></div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
     
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
