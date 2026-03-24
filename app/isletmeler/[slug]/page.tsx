import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h1 className="text-3xl font-bold">{slug.replaceAll("-", " ")}</h1>
        <p className="text-slate-600">Premium hizmetler, uzman ekip, online ödeme ve hızlı randevu.</p>
        <Button asChild><Link href={`/randevu/${slug}`}>Randevu Al</Link></Button>
      </Card>
      <Card>
        <h2 className="mb-2 text-xl font-semibold">Hizmetler</h2>
        <ul className="list-inside list-disc text-sm text-slate-700">
          <li>Saç kesimi - ₺450</li>
          <li>Sakal tasarım - ₺300</li>
          <li>Manikür - ₺500</li>
        </ul>
      </Card>
    </div>
  );
}
