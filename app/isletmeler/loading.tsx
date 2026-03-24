import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BusinessesLoading() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <Card className="space-y-3">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="space-y-3"><Skeleton className="h-36 w-full" /><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/2" /></Card>
        <Card className="space-y-3"><Skeleton className="h-36 w-full" /><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/2" /></Card>
        <Card className="space-y-3"><Skeleton className="h-36 w-full" /><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/2" /></Card>
      </div>
    </div>
  );
}
