import { Card } from "@/components/ui/card";
import { DashboardNav } from "@/components/shared/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";
import { Tabs } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";

function monthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export default async function BusinessDashboardPage() {
  const businessId = getCurrentBusinessId();
  const supabase = await createClient();
  const { start, end } = monthRange();

  const [todayAppointments, monthlyAppointments, activeCustomers, revenue, reviews] = await Promise.all([
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("business_id", businessId).gte("start_at", new Date().toISOString().slice(0, 10)).lt("start_at", `${new Date().toISOString().slice(0, 10)}T23:59:59.999Z`),
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("business_id", businessId).gte("start_at", start).lt("start_at", end),
    supabase.from("customers").select("id", { count: "exact", head: true }).eq("business_id", businessId),
    supabase.from("payments").select("amount_try").eq("business_id", businessId).eq("status", "paid").gte("created_at", start).lt("created_at", end),
    supabase.from("reviews").select("rating").eq("business_id", businessId)
  ]);

  const monthlyRevenue = (revenue.data ?? []).reduce((sum, item) => sum + Number(item.amount_try ?? 0), 0);
  const ratings = reviews.data ?? [];
  const averageRating = ratings.length ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length : 0;

  const stats = [
    ["Bugünkü Randevu", String(todayAppointments.count ?? 0)],
    ["Aylık Randevu", String(monthlyAppointments.count ?? 0)],
    ["Aylık Ciro", `₺${monthlyRevenue.toLocaleString("tr-TR")}`],
    ["Aktif Müşteri", String(activeCustomers.count ?? 0)],
    ["Ortalama Puan", averageRating ? averageRating.toFixed(1) : "-" ]
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
              <p className="text-sm">Gerçek zamanlı işletme performans verileri.</p>
            </div>
          }
          right={
            <div className="flex items-center gap-2">
              <Tabs items={[{ label: "Bugün", value: "today" }, { label: "Ay", value: "month" }]} />
              <Badge variant="accent">Canlı Veri</Badge>
            </div>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
