import { Card } from "@/components/ui/card";

export default function BusinessesLoading() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-96 animate-pulse rounded bg-slate-200" />
      </div>
      <Card className="h-28 animate-pulse bg-slate-50" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-36 animate-pulse bg-slate-50" />
        <Card className="h-36 animate-pulse bg-slate-50" />
      </div>
    </div>
  );
}
