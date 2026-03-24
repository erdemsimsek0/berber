import { SectionShell } from "@/components/dashboard/section-shell";

export default function SubscriptionPage() {
  return (
    <SectionShell
      title="Abonelik"
      description="Mevcut planınızı ve fatura durumunu görüntüleyin, plan yükseltin."
      bullets={["Plan detayları", "Ödeme geçmişi", "Yükseltme/iptal akışı"]}
    />
  );
}
