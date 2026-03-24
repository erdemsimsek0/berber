import Link from "next/link";
import { Card } from "@/components/ui/card";

const demoBusinesses = [
  { slug: "ustura-lounge", name: "Ustura Lounge", city: "İstanbul", district: "Kadıköy", rating: 4.8 },
  { slug: "nail-lab-ankara", name: "Nail Lab", city: "Ankara", district: "Çankaya", rating: 4.7 }
];

export default function BusinessesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">İşletmeleri Keşfet</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {demoBusinesses.map((business) => (
          <Link key={business.slug} href={`/isletmeler/${business.slug}`}>
            <Card className="space-y-2 hover:border-blue-300">
              <p className="text-xl font-semibold">{business.name}</p>
              <p className="text-sm text-slate-600">{business.city} / {business.district}</p>
              <p className="text-sm">⭐ {business.rating}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
