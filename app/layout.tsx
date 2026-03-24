import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "RandevuTR | Çok Kiracılı Güzellik ve Berber Randevu SaaS",
  description: "Türkiye'deki berber, kuaför, nail studio ve güzellik salonları için çok kiracılı randevu platformu."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <SiteHeader />
        <main className="container-app py-8">{children}</main>
      </body>
    </html>
  );
}
