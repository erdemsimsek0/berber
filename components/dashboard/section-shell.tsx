import { Card } from "@/components/ui/card";
import { DashboardNav } from "@/components/shared/dashboard-nav";

type Props = {
  title: string;
  description: string;
  bullets?: string[];
  scope?: "business" | "admin";
};

export function SectionShell({ title, description, bullets = [], scope = "business" }: Props) {
  return (
    <div className="space-y-4">
      <DashboardNav type={scope} />
      <h1 className="text-3xl font-bold">{title}</h1>
      <Card className="space-y-3">
        <p className="text-slate-700">{description}</p>
        {bullets.length > 0 ? (
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </Card>
    </div>
  );
}
