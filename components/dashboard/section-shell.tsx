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
    <div className="space-y-5">
      <DashboardNav type={scope} />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="max-w-3xl text-sm text-slate-600 sm:text-base">{description}</p>
      </div>
      {bullets.length > 0 ? (
        <Card className="overflow-hidden p-0">
          <ul className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {bullets.map((item) => (
              <li key={item} className="px-4 py-3 text-sm font-medium text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
