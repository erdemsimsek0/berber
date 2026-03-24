import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/(auth)/actions";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0f]/75 backdrop-blur-xl">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold text-white">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-violet-400 to-pink-400" aria-hidden />
          RandevuTR
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          <Link href="/isletmeler" className="transition hover:text-white">İşletmeler</Link>
          <Link href="/baslangic/isletme" className="transition hover:text-white">İşletmeni Ekle</Link>
          <Link href="/musteri/randevular" className="transition hover:text-white">Müşteri Paneli</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/giris">Giriş</Link>
          </Button>
          <Button asChild variant="outline" className="hidden md:inline-flex">
            <Link href="/kayit">Kayıt Ol</Link>
          </Button>
          <form action={logoutAction}>
            <Button variant="ghost" size="sm">Çıkış</Button>
          </form>
        </div>
      </div>
    </header>
  );
}
