import { Card } from "@/components/ui/card";

export default function BusinessDetailLoading() {
  return (
    <div className="space-y-4">
      <Card className="h-40 animate-pulse bg-slate-50" />
      <Card className="h-56 animate-pulse bg-slate-50" />
      <Card className="h-44 animate-pulse bg-slate-50" />
    </div>
  );
}
