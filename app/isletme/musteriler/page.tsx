import { SectionShell } from "@/components/dashboard/section-shell";

export default function CustomersPage() {
  return (
    <SectionShell
      title="Müşteriler"
      description="Müşteri geçmişini inceleyin, tekrar randevu ve not yönetimini kolaylaştırın."
      bullets={["Müşteri listesi", "Geçmiş randevular", "İletişim bilgileri"]}
    />
  );
}
