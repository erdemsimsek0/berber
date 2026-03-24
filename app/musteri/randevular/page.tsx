import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cancelAppointmentAction } from "@/lib/actions/booking";

const upcoming = [{ id: "a1", business: "Ustura Lounge", date: "2026-03-28 14:30", status: "confirmed" }];
const past = [{ id: "a2", business: "Nail Lab", date: "2026-03-11 11:00", status: "completed" }];

export default function MyAppointmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Randevularım</h1>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Yaklaşan</h2>
        {upcoming.map((item) => (
          <Card key={item.id} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium">{item.business}</p>
              <p className="text-sm text-slate-600">{item.date}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline"><Link href={`/randevu/ustura-lounge?reschedule=${item.id}`}>Yeniden Planla</Link></Button>
              <form action={async () => { "use server"; await cancelAppointmentAction(item.id); }}>
                <Button variant="ghost">İptal Et</Button>
              </form>
            </div>
          </Card>
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Geçmiş</h2>
        {past.map((item) => <Card key={item.id}><p>{item.business} - {item.date}</p></Card>)}
      </section>
    </div>
  );
}
