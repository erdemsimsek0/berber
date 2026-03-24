import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { getBusinessPlan } from "@/lib/billing/subscription";

function monthRange(date = new Date()) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0));
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1, 0, 0, 0));
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function assertStaffLimit(businessId = getCurrentBusinessId()): Promise<void> {
  const plan = await getBusinessPlan(businessId);
  if (plan.maxStaff === null) return;

  const { count } = await (await createClient())
    .from("staff")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId)
    .eq("is_active", true);

  if ((count ?? 0) >= plan.maxStaff) {
    throw new Error("FREE plan limiti: en fazla 1 aktif personel ekleyebilirsiniz. PRO plana geçin.");
  }
}

export async function assertMonthlyAppointmentLimit(businessId = getCurrentBusinessId()): Promise<void> {
  const plan = await getBusinessPlan(businessId);
  if (plan.maxAppointmentsPerMonth === null) return;

  const { start, end } = monthRange();
  const { count } = await (await createClient())
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("start_at", start)
    .lt("start_at", end);

  if ((count ?? 0) >= plan.maxAppointmentsPerMonth) {
    throw new Error("FREE plan limiti: aylık 50 randevu sınırına ulaştınız. PRO plana geçin.");
  }
}
