import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white md:p-12">
        <p className="mb-3 text-sm uppercase tracking-wider text-blue-100">Türkiye için tasarlandı</p>
        <h1 className="max-w-2xl text-3xl font-bold leading-tight md:text-5xl">Berber ve güzellik işletmeleri için premium randevu SaaS</h1>
        <p className="mt-4 max-w-2xl text-blue-100">Çoklu şube, personel planlama, müşteri paneli, kupon ve raporlama modülleri ile uçtan uca çalışır MVP.</p>
        <div className="mt-6 flex gap-3">
          <Button asChild size="lg"><Link href="/isletmeler">Hemen Randevu Al</Link></Button>
          <Button asChild size="lg" variant="outline" className="border-white bg-white/10 text-white"><Link href="/baslangic/isletme">İşletme Oluştur</Link></Button>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          "Çoklu kiracı veri izolasyonu",
          "Mobil odaklı hızlı randevu akışı",
          "TRY para birimi ve yerel UX"
        ].map((item) => (
          <Card key={item}><p className="font-medium">{item}</p></Card>
        ))}
      </section>
    </div>
  );
}
