import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden />
          RandevuTR
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/isletmeler" className="transition hover:text-slate-900">İşletmeler</Link>
          <Link href="/baslangic/isletme" className="transition hover:text-slate-900">İşletmeni Ekle</Link>
          <Link href="/musteri/randevular" className="transition hover:text-slate-900">Müşteri Paneli</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/giris">Giriş</Link>
          </Button>
          <Button asChild>
            <Link href="/kayit">Kayıt Ol</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
