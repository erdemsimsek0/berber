import { Card } from "@/components/ui/card";

export default function BusinessDashboardPage() {
  const stats = [
    ["Bugünkü Randevu", "24"],
    ["Aylık Ciro", "₺86.400"],
    ["Aktif Müşteri", "312"],
    ["Ortalama Puan", "4.8"]
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">{stats.map(([k,v]) => <Card key={k}><p className="text-sm text-slate-500">{k}</p><p className="text-2xl font-semibold">{v}</p></Card>)}</div>
    </div>
  );
}
