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
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{business.name} için Randevu</h1>
        <p className="text-sm sm:text-base">Adımları tamamlayın ve randevunuzu saniyeler içinde onaylayın.</p>
      </div>
      <PublicBookingFlow business={business} />
    </div>
  );
}
