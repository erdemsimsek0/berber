import { SectionShell } from "@/components/dashboard/section-shell";

export default function AdminBusinessesPage() {
  return (
    <SectionShell
      scope="admin"
      title="İşletmeler"
      description="Kiracı işletmeleri plan ve durum bilgileriyle yönetin."
      bullets={["Onay/pasif işlemleri", "Plan atamaları", "Destek geçmişi"]}
    />
  );
}
