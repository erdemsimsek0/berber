import { Card } from "@/components/ui/card";
import { DashboardNav } from "@/components/shared/dashboard-nav";

export default function BusinessDashboardPage() {
  const stats = [
    ["Bugünkü Randevu", "24"],
    ["Aylık Ciro", "₺86.400"],
    ["Aktif Müşteri", "312"],
    ["Ortalama Puan", "4.8"]
  ];

  return (
    <div className="space-y-6">
      <DashboardNav type="business" />
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([key, value]) => (
          <Card key={key}>
            <p className="text-sm text-slate-500">{key}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
