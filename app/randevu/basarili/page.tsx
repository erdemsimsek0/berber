import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BookingSuccessPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Card className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Randevu Talebiniz Alındı</h1>
        <p>İşletme onayından sonra bildirim alacaksınız.</p>
        <Button asChild><Link href="/musteri/randevular">Randevularıma Git</Link></Button>
      </Card>
    </div>
  );
}
