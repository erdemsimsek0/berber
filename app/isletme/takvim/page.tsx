import { SectionShell } from "@/components/dashboard/section-shell";

export default function CalendarPage() {
  return (
    <SectionShell
      title="Takvim"
      description="Günlük ve haftalık randevu görünümünde personel yoğunluğunu takip edin."
      bullets={["Randevu filtreleri", "Durum güncelleme", "Bloklu zaman görünümü"]}
    />
  );
}
