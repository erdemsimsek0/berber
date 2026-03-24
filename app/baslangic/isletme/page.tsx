import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OnboardingBusiness() {
  return (
    <Card className="mx-auto max-w-xl space-y-3">
      <h1 className="text-2xl font-semibold">İşletme Bilgileri</h1>
      <Input placeholder="İşletme Adı" />
      <Input placeholder="Slug (örnek: elit-kuafor)" />
      <Input placeholder="Şehir" />
      <Input placeholder="İlçe" />
      <Button asChild>
        <Link href="/baslangic/sube">Devam Et</Link>
      </Button>
    </Card>
  );
}
