import { SectionShell } from "@/components/dashboard/section-shell";

export default function StaffPage() {
  return (
    <SectionShell
      title="Personel"
      description="Personel bilgilerini, hizmet yetkinliklerini ve şube atamalarını yönetin."
      bullets={["Personel CRUD", "Hizmet eşleştirme", "Çalışma saatleri bağlantısı"]}
    />
  );
}
