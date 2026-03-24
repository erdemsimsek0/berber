"use server";

import { revalidatePath } from "next/cache";
import { bookingSchema } from "@/lib/validators/booking";
import { createClient } from "@/lib/supabase/server";
import { resolveBookableSlot } from "@/lib/booking/availability";

export async function createAppointmentAction(formData: FormData) {
  const parsed = bookingSchema.safeParse({
    branchId: formData.get("branchId"),
    serviceId: formData.get("serviceId"),
    staffId: formData.get("staffId") || null,
    date: formData.get("date"),
    time: formData.get("time"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail")
  });

  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Geçersiz veri" };
  }

  const supabase = await createClient();

  const { data: businessData } = await supabase
    .from("branches")
    .select("business_id")
    .eq("id", parsed.data.branchId)
    .single();
  const business = businessData as { business_id: string } | null;

  if (!business) return { ok: false as const, message: "Şube bulunamadı" };

  const { data: existingCustomerData } = await supabase
    .from("customers")
    .select("id")
    .eq("business_id", business.business_id)
    .eq("phone", parsed.data.customerPhone)
    .maybeSingle();
  const existingCustomer = existingCustomerData as { id: string } | null;

  let customerId = existingCustomer?.id;

  if (!customerId) {
    const { data: customerData, error: customerInsertError } = await supabase
      .from("customers")
      .insert({
        business_id: business.business_id,
        full_name: parsed.data.customerName,
        phone: parsed.data.customerPhone,
        email: parsed.data.customerEmail || null
      })
      .select("id")
      .single();
    const customer = customerData as { id: string } | null;

    if (customerInsertError || !customer) return { ok: false as const, message: "Müşteri kaydı başarısız" };
    customerId = customer.id;
  }

  const { data: serviceData } = await supabase
    .from("services")
    .select("duration_min")
    .eq("id", parsed.data.serviceId)
    .single();
  const service = serviceData as { duration_min: number } | null;

  if (!service) return { ok: false as const, message: "Hizmet bulunamadı" };

  const slot = await resolveBookableSlot({
    businessId: business.business_id,
    branchId: parsed.data.branchId,
    serviceId: parsed.data.serviceId,
    staffId: parsed.data.staffId ?? null,
    date: parsed.data.date,
    time: parsed.data.time
  });

  if (!slot) {
    return { ok: false as const, message: "Seçilen saat artık uygun değil. Lütfen farklı bir saat seçin." };
  }

  const { error } = await supabase.from("appointments").insert({
    business_id: business.business_id,
    branch_id: parsed.data.branchId,
    service_id: parsed.data.serviceId,
    staff_id: slot.staffId,
    customer_id: customerId,
    start_at: slot.startAt.toISOString(),
    end_at: slot.endAt.toISOString(),
    status: "pending"
  });

  if (error) return { ok: false as const, message: error.message };

  revalidatePath("/musteri/randevular");
  return { ok: true as const, message: "Randevunuz başarıyla oluşturuldu." };
}

export async function cancelAppointmentAction(appointmentId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", appointmentId);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/musteri/randevular");
  return { ok: true };
}
