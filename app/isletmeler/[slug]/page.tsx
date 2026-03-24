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
      <Card className="space-y-4 p-6 sm:p-7">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{business.name}</h1>
          <p className="text-slate-600">{business.description ?? "Online randevu ile hızlı ve düzenli operasyon."}</p>
          <p className="text-sm text-slate-500">{business.city} / {business.district}</p>
        </div>
        <Button asChild size="lg">
          <Link href={`/randevu/${business.slug}`}>Randevu Al</Link>
        </Button>
      </Card>
      <Card className="space-y-4">
        <h2 className="text-xl font-semibold">Hizmetler</h2>
        <ul className="space-y-2 text-sm text-slate-700">
          {business.services.map((service: BusinessListItem["services"][number]) => (
            <li key={service.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2">
              <span>{service.name}</span>
              <span className="text-slate-500">₺{service.price_try} • {service.duration_min} dk</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
