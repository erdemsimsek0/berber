import Link from "next/link";
import { SectionShell } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";

export default function OnboardingStaff() {
  return (
    <div className="space-y-4">
      <SectionShell
        title="Personel"
        description="Personel ekleyin ve hangi hizmetleri verebildiklerini seçin."
        bullets={["Personel kartları", "Hizmet atamaları", "Şube bağlantısı"]}
      />
      <Button asChild>
        <Link href="/baslangic/calisma-saatleri">Çalışma Saatlerine Geç</Link>
      </Button>
    </div>
  );
}
