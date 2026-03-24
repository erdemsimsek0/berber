import { Card } from "@/components/ui/card";
import { DashboardNav } from "@/components/shared/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";
import { Tabs } from "@/components/ui/tabs";

export default function BusinessDashboardPage() {
  const stats = [
    ["Bugünkü Randevu", "24"],
    ["Aylık Ciro", "₺86.400"],
    ["Aktif Müşteri", "312"],
    ["Ortalama Puan", "4.8"]
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar title="İşletme Paneli">
        <DashboardNav type="business" />
      </Sidebar>

      <div className="space-y-5">
        <Navbar
          left={
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-sm">İşletmenizin haftalık görünümünü buradan takip edin.</p>
            </div>
          }
          right={
            <div className="flex items-center gap-2">
              <Tabs items={[{ label: "Bugün", value: "today" }, { label: "Hafta", value: "week" }, { label: "Ay", value: "month" }]} />
              <Badge variant="accent">Canlı Görünüm</Badge>
            </div>
          }
        />

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
