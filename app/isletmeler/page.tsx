import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { getBusinesses } from "@/lib/data/queries";

type SearchParams = {
  city?: string;
  category?: string;
};

export const metadata: Metadata = {
  title: "İşletmeler",
  description: "Şehir ve kategori filtreleriyle işletmeleri keşfedin, detayları inceleyip randevuya geçin.",
  alternates: {
    canonical: "/isletmeler"
  }
};

export default async function BusinessesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const businesses = await getBusinesses();
  const params = await searchParams;

  const city = (params.city ?? "").trim();
  const category = (params.category ?? "").trim();

  const cities = Array.from(new Set(businesses.map((business) => business.city))).sort((a, b) => a.localeCompare(b, "tr"));
  const categories = Array.from(new Set(businesses.flatMap((business) => business.services.map((service) => service.name)))).sort((a, b) =>
    a.localeCompare(b, "tr")
  );

  const filtered = businesses.filter((business) => {
    const byCity = !city || business.city === city;
    const byCategory = !category || business.services.some((service) => service.name === category);
    return byCity && byCategory;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">İşletmeleri Keşfet</h1>
        <p className="text-sm sm:text-base">Şehir ve kategoriye göre filtrele, işletme detayını incele, randevuya geç.</p>
      </div>

      <Card className="space-y-4">
        <form className="grid gap-3 md:grid-cols-3" method="get" action="/isletmeler">
          <select name="city" defaultValue={city}>
            <option value="">Tüm şehirler</option>
            {cities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select name="category" defaultValue={category}>
            <option value="">Tüm kategoriler</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <div className="flex gap-2">
            <Button type="submit" variant="outline">Filtrele</Button>
            <Button asChild variant="ghost"><Link href="/isletmeler">Temizle</Link></Button>
          </div>
        </form>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sonuç bulunamadı"
          description="Filtreleri değiştirip tekrar deneyin veya tüm işletmeleri listeleyin."
          actionHref="/isletmeler"
          actionLabel="Filtreleri Sıfırla"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((business) => (
            <Card key={business.slug} className="space-y-4 p-4">
              <div className="h-36 rounded-2xl bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-pink-500/25" />
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-white">{business.name}</h2>
                <p className="text-sm">{business.city} / {business.district}</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <Badge>⭐ {business.rating}</Badge>
                <Button asChild size="sm"><Link href={`/isletmeler/${business.slug}`}>Detaya Git</Link></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
