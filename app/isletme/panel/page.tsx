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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-600 sm:text-base">İşletmenizin günlük performansını tek bakışta takip edin.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([key, value]) => (
          <Card key={key} className="space-y-1 border-slate-200/90 p-5">
            <p className="text-sm text-slate-500">{key}</p>
            <p className="text-2xl font-semibold text-slate-900">{value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
