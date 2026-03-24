import Link from "next/link";
import { SectionShell } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OnboardingStaff() {
  return (
    <SectionShell
      title="Personel"
      description="Personel ekleyin ve hangi hizmetleri verebildiklerini seçin."
      bullets={["Personel kartları", "Hizmet atamaları", "Şube bağlantısı"]}
    >
      <Card className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Veritabanına bağlamam gerekiyor mu?</h3>
        <p className="text-sm text-slate-300">
          Evet. Personel, hizmet ve takvim kayıtlarının dolu görünmesi için Supabase migration/seed adımlarını çalıştırmanız gerekir.
          Bağlantı yoksa bu adımlar yalnızca bilgilendirme amaçlı görünür.
        </p>
      </Card>
      <Button asChild>
        <Link href="/baslangic/calisma-saatleri">Çalışma Saatlerine Geç</Link>
      </Button>
    </SectionShell>
  );
}
