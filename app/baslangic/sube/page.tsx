import Link from "next/link";
import { SectionShell } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OnboardingBranch() {
  return (
    <SectionShell
      title="Şube Oluşturma"
      description="Birden fazla şubenizi adres ve iletişim bilgileriyle ekleyin."
      bullets={["Ana şube", "Adres ve telefon", "Harita bilgisi"]}
    >
      <Card className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Bu adımda ne yapmalıyım?</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>En az bir adet şube ekleyin (tek şubeliyseniz ana şube yeterli).</li>
          <li>Telefon, adres ve konum bilgilerini doldurun.</li>
          <li>Randevu sayfasında müşterileriniz bu bilgileri görecek.</li>
        </ul>
      </Card>
      <Button asChild>
        <Link href="/baslangic/hizmetler">Hizmetlere Geç</Link>
      </Button>
    </SectionShell>
  );
}
