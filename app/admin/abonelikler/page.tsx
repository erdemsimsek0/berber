import { SectionShell } from "@/components/dashboard/section-shell";

export default function AdminSubscriptionsPage() {
  return (
    <SectionShell
      scope="admin"
      title="Abonelikler"
      description="Ödeme durumları ve yenileme performansını merkezi olarak izleyin."
      bullets={["Aktif/iptal edilen planlar", "Tahsilat takibi", "Churn görünümü"]}
    />
  );
}
