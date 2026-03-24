import Link from "next/link";
import { SectionShell } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OnboardingServices() {
  return (
    <SectionShell
      title="Hizmetler"
      description="Süre ve TRY fiyatları ile hizmet kataloğunuzu hazırlayın."
      bullets={["Kategori oluşturma", "Süre/fiyat", "Varsayılan personel"]}
    >
      <Card className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Boş görünüyorsa sorun değil</h3>
        <p className="text-sm text-slate-300">
          Bu ekran bir kurulum adımı özeti gösterir. Gerçek hizmet kayıtları, paneldeki
          <strong className="text-slate-100"> İşletme → Hizmetler </strong>
          bölümünde oluşturulur.
        </p>
      </Card>
      <Button asChild>
        <Link href="/baslangic/personel">Personel Adımına Geç</Link>
      </Button>
    </SectionShell>
  );
}
