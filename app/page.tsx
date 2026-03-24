import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Berber ve Güzellik Salonları için Online Randevu Sistemi",
  description:
    "Berber ve güzellik salonları için online randevu, personel yönetimi ve müşteri takibi sunan modern SaaS platformu.",
  alternates: {
    canonical: "/"
  }
};

const stats = [
  ["Aktif İşletme", "1.250+"],
  ["Aylık Randevu", "84.000+"],
  ["Ortalama Puan", "4.8/5"],
  ["Aktif Şube", "3.400+"]
];

const features = [
  "Online randevu yönetimi",
  "Personel yönetimi",
  "Takvim sistemi",
  "Müşteri takibi"
];

const howItWorks = [
  ["01", "İşletmeni oluştur", "Şube, hizmet ve personel bilgilerini birkaç adımda ekle."],
  ["02", "Takvimi düzenle", "Çalışma saatleri ve bloke zamanlarla kapasiteyi kontrol et."],
  ["03", "Randevuları yönet", "Müşteri randevularını panelden takip et ve güncelle."]
];

const popular = [
  ["Studio Nova", "İstanbul / Kadıköy", "Kuaför"],
  ["Barber Craft", "Ankara / Çankaya", "Berber"],
  ["Glow Beauty", "İzmir / Alsancak", "Güzellik Merkezi"]
];

export default function HomePage() {
  return (
    <div className="section-gap">
      <Section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-7 text-center shadow-[0_12px_48px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10 lg:p-14">
        <div className="absolute -left-14 top-0 h-40 w-40 rounded-full bg-violet-500/30 blur-3xl" aria-hidden />
        <div className="absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-blue-500/25 blur-3xl" aria-hidden />
        <Badge variant="accent">Yeni Nesil Randevu Platformu</Badge>
        <h1 className="mx-auto max-w-4xl text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          <span className="gradient-text">Berber ve Güzellik Salonları için</span> Online Randevu Sistemi
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base">
          İşletmenizin randevu, personel ve müşteri süreçlerini tek panelde toplayın. Müşterileriniz hızlıca uygun saat bulsun, siz operasyonu net yönetin.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg"><Link href="/baslangic/isletme">Ücretsiz Başla</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/isletmeler">Demo Gör</Link></Button>
        </div>
      </Section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([label, value]) => (
            <Card key={label} className="space-y-1 p-5">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="text-2xl font-semibold text-white">{value}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-bold">Öne çıkan özellikler</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => (
            <Card key={item} className="p-6">
              <p className="text-lg font-semibold text-white">{item}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-bold">Nasıl çalışır?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map(([step, title, desc]) => (
            <Card key={step} className="space-y-3 p-6">
              <Badge>{step}</Badge>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-sm">{desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-3xl font-bold">Popüler işletmeler</h2>
          <Link href="/isletmeler" className="text-sm font-medium text-violet-300 hover:text-violet-200">Tümünü gör →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {popular.map(([name, location, category]) => (
            <Card key={name} className="space-y-2 p-6">
              <div className="h-28 rounded-2xl bg-gradient-to-r from-violet-500/35 to-blue-500/35" />
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-sm">{location}</p>
              <Badge>{category}</Badge>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="rounded-[28px] border border-violet-300/25 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-pink-500/20 p-7 text-center shadow-[0_10px_40px_rgba(139,92,246,0.2)] sm:p-10">
        <h2 className="text-3xl font-bold">Hemen ücretsiz dene</h2>
        <p className="mx-auto max-w-2xl text-sm sm:text-base">Kuruluma dakikalar içinde başla, randevu süreçlerini aynı gün içinde dijitale taşı.</p>
        <div className="flex justify-center">
          <Button asChild size="lg"><Link href="/baslangic/isletme">Ücretsiz Başla</Link></Button>
        </div>
      </Section>
    </div>
  );
}
