export function SkeletonBox({ className = '' }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} />;
}

export function MedicineCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
      <SkeletonBox className="h-40 w-full rounded-xl" />
      <div className="space-y-2">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <SkeletonBox className="h-5 w-1/4" />
          <SkeletonBox className="h-8 w-1/3 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function PharmacyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <SkeletonBox className="h-48 w-full" />
      <div className="p-5 space-y-3">
        <SkeletonBox className="h-6 w-2/3" />
        <SkeletonBox className="h-4 w-1/2" />
        <div className="flex gap-2">
           <SkeletonBox className="h-8 w-1/4 rounded-full" />
           <SkeletonBox className="h-8 w-1/4 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
      <SkeletonBox className="h-20 w-20 rounded-xl" />
      <div className="flex-1 space-y-2">
        <SkeletonBox className="h-4 w-1/3" />
        <SkeletonBox className="h-3 w-2/3" />
        <SkeletonBox className="h-8 w-1/4 absolute right-4 bottom-4" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <SkeletonBox className="h-16 w-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonBox className="h-4 w-1/3" />
        <SkeletonBox className="h-3 w-1/2" />
      </div>
    </div>
  );
}
