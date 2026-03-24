import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  metadataBase: new URL("https://randevutr.com"),
  title: {
    default: "RandevuTR | Berber ve Güzellik İşletmeleri için Online Randevu",
    template: "%s | RandevuTR"
  },
  description: "Türkiye'deki berber, kuaför, nail studio ve güzellik işletmeleri için online randevu ve işletme yönetimi platformu.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "RandevuTR",
    description: "Berber ve güzellik işletmeleri için online randevu platformu.",
    type: "website",
    locale: "tr_TR"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <SiteHeader />
        <main className="container-app py-6 sm:py-8 lg:py-10">{children}</main>
      </body>
    </html>
  );
}
