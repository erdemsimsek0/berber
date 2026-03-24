import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { getBusinessBySlug } from "@/lib/data/queries";
import type { BusinessListItem } from "@/lib/data/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) return { title: "İşletme Bulunamadı" };

  return {
    title: `${business.name} | İşletme Detayı`,
    description: `${business.city}/${business.district} bölgesinde ${business.name} hizmetleri, personeli ve online randevu bilgileri.`,
    alternates: { canonical: `/isletmeler/${business.slug}` }
  };
}

export default async function BusinessDetailPage({ params }: Props) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) notFound();

  const reviews = [
    { name: "Seda T.", comment: "Randevu akışı çok hızlı, ekip ilgiliydi.", score: 5 },
    { name: "Mert K.", comment: "Saatinde hizmet aldım, tekrar tercih ederim.", score: 5 }
  ];

  return (
    <div className="section-gap">
      <div className="h-56 rounded-[28px] border border-white/10 bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-pink-500/25 sm:h-72" />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">⭐ {business.rating}</Badge>
              <Badge>{business.city}</Badge>
              <Badge>{business.district}</Badge>
            </div>
            <h1 className="text-4xl font-bold">{business.name}</h1>
            <p>{business.description ?? "Bu işletme için açıklama bilgisi yakında güncellenecektir."}</p>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-2xl font-semibold">Hizmetler</h2>
            {business.services.length === 0 ? (
              <p className="text-sm">Henüz hizmet bilgisi eklenmemiş.</p>
            ) : (
              <ul className="space-y-2">
                {business.services.map((service: BusinessListItem["services"][number]) => (
                  <li key={service.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span>{service.name}</span>
                    <span className="text-sm text-slate-400">₺{service.price_try} • {service.duration_min} dk</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-2xl font-semibold">Personel</h2>
            {business.staff.length === 0 ? (
              <EmptyState
                title="Personel bilgisi yok"
                description="Bu işletme henüz personel listesini yayınlamadı."
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {business.staff.map((staff) => (
                  <div key={staff.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-violet-500/40 to-blue-500/40 text-sm font-semibold text-white">
                      {staff.full_name.split(" ").map((item) => item[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{staff.full_name}</p>
                      <p className="text-sm">Aktif personel</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-2xl font-semibold">Yorumlar</h2>
            {reviews.length === 0 ? (
              <EmptyState title="Henüz yorum yok" description="Bu işletme için ilk yorumu randevu sonrası siz bırakabilirsiniz." />
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.name} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="font-medium text-white">{review.name} • {"⭐".repeat(review.score)}</p>
                    <p className="text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold">Hızlı Randevu</h2>
            <p className="text-sm">Hizmet ve saat seçimini adım adım tamamlayarak online randevu oluşturun.</p>
            <Button asChild className="w-full"><Link href={`/randevu/${business.slug}`}>Randevu Al</Link></Button>
            <Button asChild variant="outline" className="w-full"><Link href="/isletmeler">Diğer İşletmeler</Link></Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
