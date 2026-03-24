import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BusinessDetailLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-56 w-full rounded-[28px]" />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-3"><Skeleton className="h-8 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></Card>
        <Card className="space-y-3"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></Card>
      </div>
    </div>
  );
}
