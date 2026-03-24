import { SectionShell } from "@/components/dashboard/section-shell";

export default function CouponsPage() {
  return (
    <SectionShell
      title="Kuponlar"
      description="İndirim kodları oluşturun, bitiş tarihi ve kullanım durumunu yönetin."
      bullets={["Yüzde/sabit indirim", "Süreli kampanyalar", "Aktif/Pasif takip"]}
    />
  );
}
