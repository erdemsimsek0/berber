import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getBusinesses } from "@/lib/data/queries";

type SearchParams = {
  q?: string;
  city?: string;
  service?: string;
};

export const metadata: Metadata = {
  title: "İşletmeler",
  description: "Şehrinize ve ihtiyacınız olan hizmete göre berber, kuaför ve güzellik işletmelerini filtreleyerek karşılaştırın.",
  alternates: {
    canonical: "/isletmeler"
  }
};

function normalizeText(value: string) {
  return value.toLocaleLowerCase("tr-TR");
}

export default async function BusinessesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const businesses = await getBusinesses();
  const params = await searchParams;

  const q = (params.q ?? "").trim();
  const city = (params.city ?? "").trim();
  const service = (params.service ?? "").trim();

  const cities = Array.from(new Set(businesses.map((business) => business.city))).sort((a, b) => a.localeCompare(b, "tr"));
  const serviceOptions = Array.from(
    new Set(businesses.flatMap((business) => business.services.map((item) => item.name)))
  ).sort((a, b) => a.localeCompare(b, "tr"));

  const filteredBusinesses = businesses.filter((business) => {
    const matchesQuery = !q || normalizeText(`${business.name} ${business.district} ${business.description ?? ""}`).includes(normalizeText(q));
    const matchesCity = !city || business.city === city;
    const matchesService = !service || business.services.some((item) => item.name === service);

    return matchesQuery && matchesCity && matchesService;
  });

  const totalResult = filteredBusinesses.length;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">İşletmeleri Keşfet</h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Arama ve filtrelerle size uygun işletmeleri daraltın; profil sayfasından hizmetleri inceleyip randevuya geçin.
        </p>
      </div>

      <Card className="space-y-4">
        <form className="grid gap-3 md:grid-cols-4" method="get" action="/isletmeler" aria-label="İşletme filtreleri">
          <input name="q" defaultValue={q} placeholder="İşletme adı veya ilçe" className="md:col-span-2" />
          <select name="city" defaultValue={city}>
            <option value="">Tüm şehirler</option>
            {cities.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select name="service" defaultValue={service}>
            <option value="">Tüm hizmetler</option>
            {serviceOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <div className="flex flex-wrap items-center gap-2 md:col-span-4">
            <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Filtrele</button>
            <Link href="/isletmeler" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Temizle</Link>
            <p className="text-sm text-slate-500">{totalResult} işletme listeleniyor.</p>
          </div>
        </form>
      </Card>

      {filteredBusinesses.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-700">Filtrelerinize uyan işletme bulunamadı. Şehir veya hizmet seçimini genişleterek tekrar deneyin.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredBusinesses.map((business) => (
            <Link key={business.slug} href={`/isletmeler/${business.slug}`} className="group">
              <Card className="space-y-3 border-slate-200 transition group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold">{business.name}</h2>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">⭐ {business.rating}</span>
                </div>
                <p className="text-sm text-slate-600">
                  {business.city} / {business.district}
                </p>
                <p className="text-sm text-slate-600">{business.description ?? "Bu işletme için detaylar profil sayfasında yer alır."}</p>
                <p className="text-sm font-medium text-blue-700">Detay ve randevu seçeneklerini gör →</p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Card className="space-y-2">
        <h2 className="text-lg font-semibold">Sonraki adım</h2>
        <p className="text-sm text-slate-600">İşletme detay sayfasında hizmet süresi/fiyatı ve randevu bağlantısını görebilirsiniz.</p>
      </Card>
    </div>
  );
}
