import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBusinessBySlug } from "@/lib/data/queries";
import type { BusinessListItem } from "@/lib/data/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return {
      title: "İşletme Bulunamadı"
    };
  }

  return {
    title: `${business.name} randevu ve hizmet detayları`,
    description: `${business.city}/${business.district} bölgesindeki ${business.name} için hizmetleri inceleyin ve online randevu alın.`,
    alternates: {
      canonical: `/isletmeler/${business.slug}`
    }
  };
}

export default async function BusinessDetailPage({ params }: Props) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) notFound();

  const minPrice = business.services.length ? Math.min(...business.services.map((item) => item.price_try)) : null;
  const maxPrice = business.services.length ? Math.max(...business.services.map((item) => item.price_try)) : null;

  const faqItems = [
    {
      question: "Randevuyu nasıl oluşturabilirim?",
      answer: "Randevu Al butonuna tıklayıp şube, hizmet ve tarih-saat adımlarını tamamlayarak rezervasyon yapabilirsiniz."
    },
    {
      question: "Hangi hizmetler sunuluyor?",
      answer: "Aşağıdaki hizmet listesinde süre ve fiyat bilgilerini birlikte görebilirsiniz."
    },
    {
      question: "İşletme hangi bölgede hizmet veriyor?",
      answer: `${business.city} / ${business.district} bölgesinde hizmet vermektedir.`
    }
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description ?? undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.district,
      addressRegion: business.city,
      addressCountry: "TR"
    },
    areaServed: `${business.city}/${business.district}`,
    url: `https://randevutr.com/isletmeler/${business.slug}`
  };

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-slate-700">Ana Sayfa</Link></li>
          <li>/</li>
          <li><Link href="/isletmeler" className="hover:text-slate-700">İşletmeler</Link></li>
          <li>/</li>
          <li className="text-slate-700">{business.name}</li>
        </ol>
      </nav>

      <section>
        <Card className="space-y-4 p-6 sm:p-7">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{business.name}</h1>
            <p className="text-slate-600">{business.description ?? "Online randevu ile hızlı ve düzenli operasyon."}</p>
            <p className="text-sm text-slate-500">{business.city} / {business.district}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">⭐ {business.rating}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{business.services.length} hizmet</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{business.branches.length} şube</span>
            {minPrice !== null && maxPrice !== null ? (
              <span className="rounded-full bg-slate-100 px-3 py-1">₺{minPrice} - ₺{maxPrice}</span>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild size="lg">
              <Link href={`/randevu/${business.slug}`}>Randevu Al</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/isletmeler">Diğer işletmelere dön</Link>
            </Button>
          </div>
        </Card>
      </section>

      <section aria-labelledby="hizmetler" className="space-y-3">
        <h2 id="hizmetler" className="text-2xl font-bold">Hizmetler ve fiyat aralığı</h2>
        <Card className="space-y-3">
          {business.services.length === 0 ? (
            <p className="text-sm text-slate-600">Bu işletme için henüz hizmet bilgisi eklenmemiş.</p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-700">
              {business.services.map((service: BusinessListItem["services"][number]) => (
                <li key={service.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2">
                  <span>{service.name}</span>
                  <span className="text-slate-500">₺{service.price_try} • {service.duration_min} dk</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section aria-labelledby="subeler" className="space-y-3">
        <h2 id="subeler" className="text-2xl font-bold">Şube bilgileri</h2>
        {business.branches.length === 0 ? (
          <Card>
            <p className="text-sm text-slate-600">Şube bilgisi bulunamadı.</p>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {business.branches.map((branch) => (
              <Card key={branch.id} className="space-y-1">
                <h3 className="font-semibold text-slate-900">{branch.name}</h3>
                <p className="text-sm text-slate-600">{branch.address}</p>
                {branch.phone ? <p className="text-sm text-slate-600">Tel: {branch.phone}</p> : null}
              </Card>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="sss" className="space-y-3">
        <h2 id="sss" className="text-2xl font-bold">Sık sorulan sorular</h2>
        <div className="space-y-2">
          {faqItems.map((faq) => (
            <Card key={faq.question} className="space-y-1">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="text-sm text-slate-600">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
