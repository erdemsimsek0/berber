import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const highlights = [
  {
    title: "Dolu takvim, sakin operasyon",
    description: "Randevu trafiğini dijitalleştirip telefon trafiğini azaltın."
  },
  {
    title: "Çok şubeli büyüme desteği",
    description: "Şube, personel ve hizmetleri tek panelden yönetin."
  },
  {
    title: "Müşteri deneyimi odaklı",
    description: "Hızlı rezervasyon adımları ile dönüşümü artırın."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-7 text-white shadow-xl sm:p-10 lg:p-14">
        <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-white/20 blur-2xl" aria-hidden />
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">Türkiye için tasarlandı</p>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          Berber ve güzellik işletmeleri için premium randevu SaaS
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-blue-100 sm:text-base">
          Çoklu şube, personel planlama, müşteri paneli, kupon ve raporlama modülleri ile işletmenizi tek panelden yönetin.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800">
            <Link href="/isletmeler">Hemen Randevu Al</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/70 bg-white/10 text-white hover:bg-white/20">
            <Link href="/baslangic/isletme">İşletme Oluştur</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title} className="space-y-2">
            <p className="text-base font-semibold text-slate-900">{item.title}</p>
            <p className="text-sm text-slate-600">{item.description}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
