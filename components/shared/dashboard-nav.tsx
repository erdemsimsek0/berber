"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

type NavLink = { href: Route; label: string };

const businessLinks: NavLink[] = [
  { href: "/isletme/panel", label: "Genel Bakış" },
  { href: "/isletme/takvim", label: "Takvim" },
  { href: "/isletme/calisma-saatleri" as Route, label: "Çalışma Saatleri" },
  { href: "/isletme/bloke-zamanlar" as Route, label: "Bloke Zamanlar" },
  { href: "/isletme/hizmetler", label: "Hizmetler" },
  { href: "/isletme/personel", label: "Personel" },
  { href: "/isletme/musteriler", label: "Müşteriler" },
  { href: "/isletme/yorumlar", label: "Yorumlar" },
  { href: "/isletme/kuponlar", label: "Kuponlar" },
  { href: "/isletme/raporlar", label: "Raporlar" },
  { href: "/isletme/ayarlar", label: "Ayarlar" },
  { href: "/isletme/abonelik", label: "Abonelik" }
];

const adminLinks: NavLink[] = [
  { href: "/admin/genel-bakis", label: "Sistem" },
  { href: "/admin/isletmeler", label: "İşletmeler" },
  { href: "/admin/abonelikler", label: "Abonelikler" }
];

export function DashboardNav({ type }: { type: "business" | "admin" }) {
  const pathname = usePathname();
  const links = type === "business" ? businessLinks : adminLinks;

  return (
    <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2" aria-label="Panel navigasyonu">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "inline-flex whitespace-nowrap rounded-xl border px-3 py-2 text-sm font-medium transition lg:flex",
              active
                ? "border-violet-300/30 bg-violet-500/20 text-violet-100"
                : "border-white/10 bg-white/5 text-slate-300 hover:scale-[1.02] hover:bg-white/10"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
