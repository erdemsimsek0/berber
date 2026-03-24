import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getBusinesses } from "@/lib/data/queries";

export default async function BusinessesPage() {
  const businesses = await getBusinesses();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">İşletmeleri Keşfet</h1>
        <p className="text-sm text-slate-600 sm:text-base">Şehrinizdeki işletmeleri karşılaştırın ve saniyeler içinde randevunuzu oluşturun.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {businesses.map((business) => (
          <Link key={business.slug} href={`/isletmeler/${business.slug}`} className="group">
            <Card className="space-y-3 border-slate-200 transition group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xl font-semibold">{business.name}</p>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">⭐ {business.rating}</span>
              </div>
              <p className="text-sm text-slate-600">
                {business.city} / {business.district}
              </p>
              <p className="text-sm font-medium text-blue-700">Detay ve randevu seçeneklerini gör →</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
