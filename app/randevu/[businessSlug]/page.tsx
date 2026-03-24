import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getBusinessBySlug } from "@/lib/data/queries";
import { PublicBookingFlow } from "@/components/booking/public-booking-flow";

export default async function BookingPage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  const business = await getBusinessBySlug(businessSlug);

  if (!business) notFound();

  if (!business.branches.length || !business.services.length || !business.staff.length) {
    return (
      <Card className="mx-auto max-w-xl">
        <p>Bu işletme için online randevu henüz açılmamış.</p>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{business.name} için Randevu</h1>
        <p className="text-sm text-slate-600 sm:text-base">Adımları tamamlayın, uygun saatleri görün ve randevunuzu hemen onaylayın.</p>
      </div>
      <Card className="p-4 sm:p-6">
        <PublicBookingFlow business={business} />
      </Card>
    </div>
  );
}
