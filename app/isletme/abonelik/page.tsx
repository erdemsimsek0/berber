import { SectionShell } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { getBusinessPlan, getBusinessSubscription } from "@/lib/billing/subscription";
import { CheckoutButton } from "@/components/billing/checkout-button";

export default async function SubscriptionPage() {
  const businessId = getCurrentBusinessId();
  const [subscription, plan, billingHistory] = await Promise.all([
    getBusinessSubscription(businessId),
    getBusinessPlan(businessId),
    (await createClient())
      .from("billing_history")
      .select("id,amount_try,status,created_at")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(10)
  ]);

  return (
    <div className="space-y-4">
      <SectionShell
        title="Abonelik ve Faturalama"
        description="Planınızı yönetin, PRO'ya yükseltin ve ödeme geçmişinizi görüntüleyin."
        bullets={["Mevcut plan", "Yükseltme/Düşürme", "Fatura geçmişi"]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-3 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold">Mevcut Plan</h2>
            <Badge variant={subscription.planType === "pro" ? "accent" : "default"}>{subscription.planType.toUpperCase()}</Badge>
            <Badge variant={subscription.isActive ? "success" : "default"}>{subscription.isActive ? "Aktif" : "Pasif"}</Badge>
          </div>
          <p className="text-sm">Aktiflik bitiş tarihi: {subscription.activeUntil ? new Date(subscription.activeUntil).toLocaleDateString("tr-TR") : "Belirtilmedi"}</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
            <li>Personel limiti: {plan.maxStaff === null ? "Sınırsız" : String(plan.maxStaff)}</li>
            <li>Aylık randevu limiti: {plan.maxAppointmentsPerMonth === null ? "Sınırsız" : String(plan.maxAppointmentsPerMonth)}</li>
            <li>Gelişmiş analiz: {plan.analytics ? "Var" : "Yok"}</li>
          </ul>
        </Card>

        <Card className="space-y-3">
          <h3 className="text-xl font-semibold">PRO'ya Geç</h3>
          <p className="text-sm">Aylık veya yıllık ödeme ile limitleri kaldırın.</p>
          <CheckoutButton interval="monthly" />
          <CheckoutButton interval="yearly" />
        </Card>
      </div>

      <Card className="space-y-3">
        <h3 className="text-xl font-semibold">Fatura Geçmişi</h3>
        {!billingHistory.data?.length ? (
          <p className="text-sm">Henüz fatura kaydı bulunmuyor.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-400">
                  <th className="px-3 py-2">Tarih</th>
                  <th className="px-3 py-2">Tutar</th>
                  <th className="px-3 py-2">Durum</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.data.map((item) => (
                  <tr key={item.id} className="border-b border-white/5">
                    <td className="px-3 py-2">{new Date(item.created_at).toLocaleDateString("tr-TR")}</td>
                    <td className="px-3 py-2">₺{item.amount_try}</td>
                    <td className="px-3 py-2">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
