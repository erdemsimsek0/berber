import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="section-gap">
      <Skeleton className="h-72 w-full rounded-[28px]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
