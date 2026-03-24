import { Card } from "@/components/ui/card";

export function SectionShell({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <Card>
        <p className="text-slate-700">{description}</p>
      </Card>
    </div>
  );
}
