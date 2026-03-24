"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

type NavLink = {
  href: Route;
  label: string;
};

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
    <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Panel navigasyonu">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
              isActive
                ? "border-blue-200 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
