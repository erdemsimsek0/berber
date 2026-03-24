import Link from "next/link";
import { SectionShell } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";

export default function OnboardingHours() {
  return (
    <div className="space-y-4">
      <SectionShell
        title="Çalışma Saatleri"
        description="Şube ve personel bazında çalışma takvimini belirleyin."
        bullets={["Haftalık program", "Mola saatleri", "Bloklu zamanlar"]}
      />
      <Button asChild>
        <Link href="/baslangic/tamamlandi">Kurulumu Tamamla</Link>
      </Button>
    </div>
  );
}
