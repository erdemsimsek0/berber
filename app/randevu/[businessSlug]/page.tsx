import { Card } from "@/components/ui/card";
import { BookingForm } from "@/components/booking/booking-form";

export default async function BookingPage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-3xl font-bold">{businessSlug.replaceAll("-", " ")} için Randevu</h1>
      <Card className="space-y-4">
        <p className="text-sm text-slate-600">1) Şube 2) Hizmet 3) Personel 4) Tarih/Saat 5) Bilgiler</p>
        <BookingForm
          branchId="11111111-1111-1111-1111-111111111111"
          serviceId="22222222-2222-2222-2222-222222222222"
        />
      </Card>
    </div>
  );
}
