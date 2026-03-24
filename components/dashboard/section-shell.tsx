import { DashboardNav } from "@/components/shared/dashboard-nav";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  bullets?: string[];
  scope?: "business" | "admin";
  children?: ReactNode;
};

export function SectionShell({ title, description, bullets = [], scope = "business", children }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar title="Panel">
        <DashboardNav type={scope} />
      </Sidebar>

      <div className="space-y-5">
        <Navbar left={<div><h1 className="text-3xl font-bold">{title}</h1><p className="text-sm sm:text-base">{description}</p></div>} />

        {bullets.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {bullets.map((item) => (
              <Card key={item} className="p-4">
                <p className="text-sm font-medium text-slate-200">{item}</p>
              </Card>
            ))}
          </div>
        ) : null}

        {children ? <div className="space-y-4">{children}</div> : null}
      </div>
    </div>
  );
}
