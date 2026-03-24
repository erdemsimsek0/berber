import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Online Randevu ile Berber ve Güzellik İşletmelerini Keşfedin",
  description:
    "Şehrinizdeki berber, kuaför ve güzellik salonlarını karşılaştırın; hizmet, fiyat ve uygun saat bilgileriyle online randevunuzu hızlıca oluşturun.",
  alternates: {
    canonical: "/"
  }
};

const highlights = [
  {
    title: "İşletmeleri tek listede görün",
    description: "Şube bilgisi, hizmetler ve puan gibi temel verileri tek sayfada karşılaştırın."
  },
  {
    title: "Uygun saatleri kontrol edin",
    description: "Seçtiğiniz hizmet ve tarihe göre müsait saatleri görüntüleyip hızlıca seçim yapın."
  },
  {
    title: "Randevuyu adım adım tamamlayın",
    description: "Kısa form akışı sayesinde işlemi yarıda bırakmadan tamamlamak kolaylaşır."
  }
];

const faqs = [
  {
    question: "Randevu almak için üyelik gerekli mi?",
    answer: "Hayır. Uygun işletmede doğrudan tarih-saat seçip iletişim bilgilerinizle randevu oluşturabilirsiniz."
  },
  {
    question: "Aynı gün için randevu alabilir miyim?",
    answer: "İşletmenin çalışma saatleri ve doluluk durumuna göre aynı gün için uygun slotlar listelenir."
  },
  {
    question: "İşletme bilgilerinde neleri görebilirim?",
    answer: "Konum, hizmetler, süre/fiyat bilgileri ve randevuya yönlendiren bağlantıları görebilirsiniz."
  }
];

export default function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-7 text-white shadow-xl sm:p-10 lg:p-14">
        <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-white/20 blur-2xl" aria-hidden />
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">Türkiye için online randevu</p>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          Berber ve güzellik işletmelerini karşılaştırın, randevunuzu hızlıca alın
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-blue-100 sm:text-base">
          İşletme profillerinde hizmet/fiyat bilgilerini görün, uygun saatleri kontrol edin ve kısa adımlarla rezervasyonu tamamlayın.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800">
            <Link href="/isletmeler">İşletmeleri Gör</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/70 bg-white/10 text-white hover:bg-white/20">
            <Link href="/baslangic/isletme">İşletmeni Ekle</Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="neden-randevutr" className="space-y-4">
        <h2 id="neden-randevutr" className="text-2xl font-bold">Randevu sürecini kolaylaştıran yapı</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title} className="space-y-2">
              <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="hizli-linkler" className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 id="hizli-linkler" className="text-xl font-semibold">Randevu arayanlar için</h2>
          <p className="text-sm text-slate-600">İşletmeleri şehir ve hizmete göre filtreleyip size uygun olan profile geçin.</p>
          <Link href="/isletmeler" className="text-sm font-medium text-blue-700 hover:text-blue-800">İşletme listesine git →</Link>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold">İşletmesini dijitale taşımak isteyenler için</h2>
          <p className="text-sm text-slate-600">Şube, hizmet ve personel bilgilerinizi girip online randevuya hızlıca başlayın.</p>
          <Link href="/baslangic/isletme" className="text-sm font-medium text-blue-700 hover:text-blue-800">İşletme oluşturma adımlarına git →</Link>
        </Card>
      </section>

      <section aria-labelledby="sik-sorulan" className="space-y-4">
        <h2 id="sik-sorulan" className="text-2xl font-bold">Sık sorulan sorular</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <Card key={faq.question} className="space-y-2">
              <h3 className="text-base font-semibold">{faq.question}</h3>
              <p className="text-sm text-slate-600">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
