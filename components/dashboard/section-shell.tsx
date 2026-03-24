import { DashboardNav } from "@/components/shared/dashboard-nav";
import { Card } from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  bullets?: string[];
  scope?: "business" | "admin";
};

export function SectionShell({ title, description, bullets = [], scope = "business" }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-3 lg:sticky lg:top-24 lg:h-fit">
        <Card className="space-y-3 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Panel</p>
          <DashboardNav type={scope} />
        </Card>
      </aside>

      <div className="space-y-5">
        <Card className="space-y-2 p-5">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-sm sm:text-base">{description}</p>
        </Card>

        {bullets.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {bullets.map((item) => (
              <Card key={item} className="p-4">
                <p className="text-sm font-medium text-slate-200">{item}</p>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
