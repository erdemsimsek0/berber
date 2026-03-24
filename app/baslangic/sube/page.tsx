import Link from "next/link";
import { SectionShell } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";

export default function OnboardingBranch() {
  return (
    <div className="space-y-4">
      <SectionShell
        title="Şube Oluşturma"
        description="Birden fazla şubenizi adres ve iletişim bilgileriyle ekleyin."
        bullets={["Ana şube", "Adres ve telefon", "Harita bilgisi"]}
      />
      <Button asChild>
        <Link href="/baslangic/hizmetler">Hizmetlere Geç</Link>
      </Button>
    </div>
  );
}
