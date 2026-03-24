import { SectionShell } from "@/components/dashboard/section-shell";

export default function ReportsPage() {
  return (
    <SectionShell
      title="Raporlar"
      description="Gelir, randevu ve personel verimliliğini tek panelde analiz edin."
      bullets={["Aylık gelir özeti", "Randevu trendleri", "Personel performansı"]}
    />
  );
}
