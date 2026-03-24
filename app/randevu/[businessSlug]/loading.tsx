import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookingLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Skeleton className="h-10 w-80" />
      <Card className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-32 w-full" />
      </Card>
    </div>
  );
}
