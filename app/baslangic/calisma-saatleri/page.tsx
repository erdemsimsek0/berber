import Link from "next/link";
import { SectionShell } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OnboardingHours() {
  return (
    <SectionShell
      title="Çalışma Saatleri"
      description="Şube ve personel bazında çalışma takvimini belirleyin."
      bullets={["Haftalık program", "Mola saatleri", "Bloklu zamanlar"]}
    >
      <Card className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Önerilen sonraki adım</h3>
        <p className="text-sm text-slate-300">
          Kurulumu bitirdikten sonra <strong className="text-slate-100">İşletme → Takvim</strong> ekranından
          test randevusu oluşturup akışı doğrulayın.
        </p>
      </Card>
      <Button asChild>
        <Link href="/baslangic/tamamlandi">Kurulumu Tamamla</Link>
      </Button>
    </SectionShell>
  );
}
