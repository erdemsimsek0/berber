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
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_85%_12%,rgba(59,130,246,0.16),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(236,72,153,0.14),transparent_36%)]" />
        <SiteHeader />
        <main className="container-app py-6 sm:py-8 lg:py-10">{children}</main>
      </body>
    </html>
  );
}
