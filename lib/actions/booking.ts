"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { bookingSchema } from "@/lib/validators/booking";
import { createClient } from "@/lib/supabase/server";
import { resolveBookableSlot } from "@/lib/booking/availability";

const branchBusinessSchema = z.object({ business_id: z.string().uuid() });
const customerIdSchema = z.object({ id: z.string().uuid() });
const serviceDurationSchema = z.object({ duration_min: z.number().int().positive() });
const appointmentIdSchema = z.object({ id: z.string().uuid() });

function errorResult(message: string) {
  return { ok: false as const, message };
}

export async function createAppointmentAction(formData: FormData) {
  try {
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
      return errorResult(parsed.error.issues[0]?.message ?? "Geçersiz veri");
    }

    const supabase = await createClient();

    const { data: branchData, error: branchError } = await supabase
      .from("branches")
      .select("business_id")
      .eq("id", parsed.data.branchId)
      .single();

    if (branchError || !branchData) return errorResult("Şube bulunamadı");

    const branchBusiness = branchBusinessSchema.safeParse(branchData);
    if (!branchBusiness.success) return errorResult("Şube verisi doğrulanamadı");

    const businessId = branchBusiness.data.business_id;

    const { data: existingCustomerData, error: existingCustomerError } = await supabase
      .from("customers")
      .select("id")
      .eq("business_id", businessId)
      .eq("phone", parsed.data.customerPhone)
      .maybeSingle();

    if (existingCustomerError) return errorResult("Müşteri bilgisi kontrol edilemedi");

    let customerId: string | null = null;

    if (existingCustomerData) {
      const existingCustomer = customerIdSchema.safeParse(existingCustomerData);
      if (!existingCustomer.success) return errorResult("Müşteri verisi doğrulanamadı");
      customerId = existingCustomer.data.id;
    }

    if (!customerId) {
      const { data: customerData, error: customerInsertError } = await supabase
        .from("customers")
        .insert({
          business_id: businessId,
          full_name: parsed.data.customerName,
          phone: parsed.data.customerPhone,
          email: parsed.data.customerEmail || null
        })
        .select("id")
        .single();

      if (customerInsertError || !customerData) return errorResult("Müşteri kaydı başarısız");

      const insertedCustomer = customerIdSchema.safeParse(customerData);
      if (!insertedCustomer.success) return errorResult("Müşteri kaydı doğrulanamadı");
      customerId = insertedCustomer.data.id;
    }

    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .select("duration_min")
      .eq("id", parsed.data.serviceId)
      .eq("business_id", businessId)
      .single();

    if (serviceError || !serviceData) return errorResult("Hizmet bulunamadı");
    if (!serviceDurationSchema.safeParse(serviceData).success) return errorResult("Hizmet verisi doğrulanamadı");

    const slot = await resolveBookableSlot({
      businessId,
      branchId: parsed.data.branchId,
      serviceId: parsed.data.serviceId,
      staffId: parsed.data.staffId ?? null,
      date: parsed.data.date,
      time: parsed.data.time
    });

    if (!slot) {
      return errorResult("Seçilen saat artık uygun değil. Lütfen farklı bir saat seçin.");
    }

    const { data: appointmentData, error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        business_id: businessId,
        branch_id: parsed.data.branchId,
        service_id: parsed.data.serviceId,
        staff_id: slot.staffId,
        customer_id: customerId,
        start_at: slot.startAt.toISOString(),
        end_at: slot.endAt.toISOString(),
        status: "pending"
      })
      .select("id")
      .single();

    if (appointmentError || !appointmentData) {
      return errorResult(appointmentError?.message ?? "Randevu oluşturulamadı");
    }

    const appointment = appointmentIdSchema.safeParse(appointmentData);
    if (!appointment.success) return errorResult("Randevu kaydı doğrulanamadı");

    revalidatePath("/musteri/randevular");
    return { ok: true as const, message: "Randevunuz başarıyla oluşturuldu.", appointmentId: appointment.data.id };
  } catch {
    return errorResult("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
  }
}

export async function cancelAppointmentAction(appointmentId: string) {
  const parsed = z.string().uuid().safeParse(appointmentId);
  if (!parsed.success) return errorResult("Geçersiz randevu kimliği.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", parsed.data);

  if (error) return errorResult(error.message);

  revalidatePath("/musteri/randevular");
  return { ok: true as const };
}
