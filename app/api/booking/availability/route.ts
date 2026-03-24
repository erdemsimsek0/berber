import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/booking/availability";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const businessId = searchParams.get("businessId");
  const branchId = searchParams.get("branchId");
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");
  const staffId = searchParams.get("staffId");

  if (!businessId || !branchId || !serviceId || !date) {
    return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
  }

  const slots = await getAvailableSlots({
    businessId,
    branchId,
    serviceId,
    date,
    staffId: staffId || null
  });

  return NextResponse.json({
    slots: slots.map((slot) => ({
      startAt: slot.startAt.toISOString(),
      endAt: slot.endAt.toISOString(),
      timeLabel: slot.timeLabel,
      staffIds: slot.staffIds
    }))
  });
}
