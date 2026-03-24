import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function Sidebar({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="space-y-3 p-4 lg:sticky lg:top-24 lg:h-fit">
      <p className="text-xs uppercase tracking-wider text-slate-400">{title}</p>
      {children}
    </Card>
  );
}
