import { SectionShell } from "@/components/dashboard/section-shell";

export default function SettingsPage() {
  return (
    <SectionShell
      title="Ayarlar"
      description="İşletme profil, bildirim ve çalışma kurallarını merkezi olarak yönetin."
      bullets={["İşletme profili", "Bildirim ayarları", "Entegrasyon anahtarları"]}
    />
  );
}
