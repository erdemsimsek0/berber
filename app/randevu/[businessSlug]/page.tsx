import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { BookingForm } from "@/components/booking/booking-form";
import { getBusinessBySlug } from "@/lib/data/queries";

export default async function BookingPage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  const business = await getBusinessBySlug(businessSlug);

  if (!business) notFound();

  const defaultBranch = business.branches[0];
  const defaultService = business.services[0];

  if (!defaultBranch || !defaultService) {
    return (
      <Card className="mx-auto max-w-xl">
        <p>Bu işletme için online randevu henüz açılmamış.</p>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-3xl font-bold">{business.name} için Randevu</h1>
      <Card className="space-y-4">
        <p className="text-sm text-slate-600">1) Şube 2) Hizmet 3) Personel (opsiyonel) 4) Tarih/Saat 5) Bilgiler</p>
        <BookingForm branchId={defaultBranch.id} serviceId={defaultService.id} />
      </Card>
    </div>
  );
}
