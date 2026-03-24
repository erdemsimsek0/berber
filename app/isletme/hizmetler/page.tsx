import { SectionShell } from "@/components/dashboard/section-shell";

export default function ServicesPage() {
  return (
    <SectionShell
      title="Hizmetler"
      description="Hizmet katalogunuzu düzenleyin, süre ve TRY fiyatları güncelleyin."
      bullets={["Yeni hizmet ekleme", "Süre/fiyat güncelleme", "Aktif/Pasif yönetimi"]}
    />
  );
}
