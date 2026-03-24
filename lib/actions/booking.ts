"use server";

import { revalidatePath } from "next/cache";
import { bookingSchema } from "@/lib/validators/booking";
import { createClient } from "@/lib/supabase/server";

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

  const { data: business } = await supabase
    .from("branches")
    .select("business_id")
    .eq("id", parsed.data.branchId)
    .single();

  if (!business) return { ok: false as const, message: "Şube bulunamadı" };

  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("business_id", business.business_id)
    .eq("phone", parsed.data.customerPhone)
    .maybeSingle();

  let customerId = existingCustomer?.id;

  if (!customerId) {
    const { data: customer, error: customerInsertError } = await supabase
      .from("customers")
      .insert({
        business_id: business.business_id,
        full_name: parsed.data.customerName,
        phone: parsed.data.customerPhone,
        email: parsed.data.customerEmail || null
      })
      .select("id")
      .single();

    if (customerInsertError || !customer) return { ok: false as const, message: "Müşteri kaydı başarısız" };
    customerId = customer.id;
  }

  const startAt = new Date(`${parsed.data.date}T${parsed.data.time}:00+03:00`);
  const { data: service } = await supabase
    .from("services")
    .select("duration_min")
    .eq("id", parsed.data.serviceId)
    .single();

  if (!service) return { ok: false as const, message: "Hizmet bulunamadı" };

  const endAt = new Date(startAt.getTime() + service.duration_min * 60 * 1000);

  const { error } = await supabase.from("appointments").insert({
    business_id: business.business_id,
    branch_id: parsed.data.branchId,
    service_id: parsed.data.serviceId,
    staff_id: parsed.data.staffId,
    customer_id: customerId,
    start_at: startAt.toISOString(),
    end_at: endAt.toISOString(),
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
