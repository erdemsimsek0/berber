import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

type Search = Promise<{ appointmentId?: string }>;
type AppointmentSummary = {
  start_at: string;
  end_at: string;
  status: string;
  branches?: { name: string } | null;
  services?: { name: string } | null;
  customers?: { full_name: string } | null;
};

export default async function BookingSuccessPage({ searchParams }: { searchParams: Search }) {
  const { appointmentId } = await searchParams;

  let summary: AppointmentSummary | null = null;

  if (appointmentId) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("appointments")
      .select("start_at,end_at,status,branches(name),services(name),customers(full_name)")
      .eq("id", appointmentId)
      .maybeSingle();

    summary = (data as AppointmentSummary | null) ?? null;
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Randevunuz Oluşturuldu</h1>
        {summary ? (
          <div className="space-y-1 text-left text-sm">
            <p><strong>Hizmet:</strong> {summary.services?.name}</p>
            <p><strong>Şube:</strong> {summary.branches?.name}</p>
            <p><strong>Müşteri:</strong> {summary.customers?.full_name}</p>
            <p><strong>Başlangıç:</strong> {new Date(summary.start_at).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</p>
            <p><strong>Bitiş:</strong> {new Date(summary.end_at).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</p>
            <p><strong>Durum:</strong> {summary.status}</p>
          </div>
        ) : (
          <p>Randevu detayları hazırlanıyor.</p>
        )}
        <Button asChild><Link href="/musteri/randevular">Randevularıma Git</Link></Button>
      </Card>
    </div>
  );
}
