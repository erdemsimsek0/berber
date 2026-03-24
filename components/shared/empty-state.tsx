import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Route } from "next";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel
}: {
  title: string;
  description: string;
  actionHref?: Route;
  actionLabel?: string;
}) {
  return (
    <Card className="space-y-3 p-6 text-center sm:p-8">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
      {actionHref && actionLabel ? (
        <div className="flex justify-center">
          <Button asChild variant="outline"><Link href={actionHref}>{actionLabel}</Link></Button>
        </div>
      ) : null}
    </Card>
  );
}
