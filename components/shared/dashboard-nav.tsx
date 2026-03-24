import Link from "next/link";

const businessLinks = [
  { href: "/isletme/panel", label: "Genel Bakış" },
  { href: "/isletme/takvim", label: "Takvim" },
  { href: "/isletme/hizmetler", label: "Hizmetler" },
  { href: "/isletme/personel", label: "Personel" },
  { href: "/isletme/musteriler", label: "Müşteriler" },
  { href: "/isletme/yorumlar", label: "Yorumlar" },
  { href: "/isletme/kuponlar", label: "Kuponlar" },
  { href: "/isletme/raporlar", label: "Raporlar" },
  { href: "/isletme/ayarlar", label: "Ayarlar" },
  { href: "/isletme/abonelik", label: "Abonelik" }
];

const adminLinks = [
  { href: "/admin/genel-bakis", label: "Sistem" },
  { href: "/admin/isletmeler", label: "İşletmeler" },
  { href: "/admin/abonelikler", label: "Abonelikler" }
];

export function DashboardNav({ type }: { type: "business" | "admin" }) {
  const links = type === "business" ? businessLinks : adminLinks;

  return (
    <nav className="mb-4 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm hover:border-blue-400"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
