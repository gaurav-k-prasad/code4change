import { Skeleton } from "./skeleton";

export default function RouteDetailSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-10 w-75" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-[500px] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-50 w-full" />
          <Skeleton className="h-[280px] w-full" />
        </div>
      </div>
    </div>
  );
}
