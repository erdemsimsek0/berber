import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold">RandevuTR</Link>
        <nav className="hidden gap-6 text-sm md:flex">
          <Link href="/isletmeler">İşletmeler</Link>
          <Link href="/baslangic/isletme">İşletmeni Ekle</Link>
        </nav>
        <div className="flex gap-2">
          <Button asChild variant="ghost"><Link href="/giris">Giriş</Link></Button>
          <Button asChild><Link href="/kayit">Kayıt Ol</Link></Button>
        </div>
      </div>
    </header>
  );
}
