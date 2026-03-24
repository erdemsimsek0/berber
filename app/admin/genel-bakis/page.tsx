import { SectionShell } from "@/components/dashboard/section-shell";

export default function AdminOverviewPage() {
  return (
    <SectionShell
      scope="admin"
      title="Sistem Genel Bakış"
      description="Platform genelindeki işletme ve randevu hacmini canlı izleyin."
      bullets={["Toplam işletme", "Aktif abonelik oranı", "Günlük randevu trendi"]}
    />
  );
}
