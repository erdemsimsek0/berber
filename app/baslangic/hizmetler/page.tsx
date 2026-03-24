import Link from "next/link";
import { SectionShell } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";

export default function OnboardingServices() {
  return (
    <div className="space-y-4">
      <SectionShell
        title="Hizmetler"
        description="Süre ve TRY fiyatları ile hizmet kataloğunuzu hazırlayın."
        bullets={["Kategori oluşturma", "Süre/fiyat", "Varsayılan personel"]}
      />
      <Button asChild>
        <Link href="/baslangic/personel">Personel Adımına Geç</Link>
      </Button>
    </div>
  );
}
