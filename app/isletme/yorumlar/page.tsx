import { SectionShell } from "@/components/dashboard/section-shell";

export default function ReviewsPage() {
  return (
    <SectionShell
      title="Yorumlar"
      description="Tamamlanmış randevulardan gelen yorumları takip edin ve yanıtlayın."
      bullets={["Puan dağılımı", "Olumlu/olumsuz analiz", "Müşteri geri bildirimleri"]}
    />
  );
}
