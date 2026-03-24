import { Card } from "@/components/ui/card";
import { DashboardNav } from "@/components/shared/dashboard-nav";
import { Badge } from "@/components/ui/badge";

export default function BusinessDashboardPage() {
  const stats = [
    ["Bugünkü Randevu", "24"],
    ["Aylık Ciro", "₺86.400"],
    ["Aktif Müşteri", "312"],
    ["Ortalama Puan", "4.8"]
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="space-y-3 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">İşletme Paneli</p>
          <DashboardNav type="business" />
        </Card>
      </aside>

      <div className="space-y-5">
        <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-sm">İşletmenizin haftalık görünümünü buradan takip edin.</p>
          </div>
          <Badge variant="accent">Canlı Görünüm</Badge>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([key, value]) => (
            <Card key={key} className="space-y-1 p-5">
              <p className="text-sm text-slate-400">{key}</p>
              <p className="text-2xl font-semibold text-white">{value}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
