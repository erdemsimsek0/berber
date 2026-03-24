import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBusinessBySlug } from "@/lib/data/queries";
import type { BusinessListItem } from "@/lib/data/types";

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) notFound();

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h1 className="text-3xl font-bold">{business.name}</h1>
        <p className="text-slate-600">{business.description ?? "Online randevu ile hızlı ve düzenli operasyon."}</p>
        <p className="text-sm text-slate-600">{business.city} / {business.district}</p>
        <Button asChild>
          <Link href={`/randevu/${business.slug}`}>Randevu Al</Link>
        </Button>
      </Card>
      <Card>
        <h2 className="mb-2 text-xl font-semibold">Hizmetler</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
          {business.services.map((service: BusinessListItem["services"][number]) => (
            <li key={service.id}>
              {service.name} - ₺{service.price_try} ({service.duration_min} dk)
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
