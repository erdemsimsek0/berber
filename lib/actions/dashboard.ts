"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";

const serviceSchema = z.object({ id: z.string().uuid().optional(), name: z.string().min(2), duration_min: z.coerce.number().int().min(5), price_try: z.coerce.number().min(0), branch_id: z.string().uuid().nullable().optional(), is_active: z.coerce.boolean().optional() });
const staffSchema = z.object({ id: z.string().uuid().optional(), full_name: z.string().min(2), phone: z.string().min(10).optional().or(z.literal("")), branch_id: z.string().uuid().nullable().optional(), is_active: z.coerce.boolean().optional() });
const couponSchema = z.object({ id: z.string().uuid().optional(), code: z.string().min(3), discount_type: z.enum(["percent", "fixed"]), discount_value: z.coerce.number().positive(), expires_at: z.string().optional().or(z.literal("")), active: z.coerce.boolean().optional() });
const blockedSchema = z.object({ id: z.string().uuid().optional(), branch_id: z.string().uuid().nullable().optional(), staff_id: z.string().uuid().nullable().optional(), start_at: z.string().min(1), end_at: z.string().min(1), reason: z.string().optional().or(z.literal("")) });
const workingHoursSchema = z.object({ id: z.string().uuid().optional(), branch_id: z.string().uuid().nullable().optional(), staff_id: z.string().uuid().nullable().optional(), day_of_week: z.coerce.number().int().min(0).max(6), start_time: z.string().min(1), end_time: z.string().min(1) });
const customerSchema = z.object({ id: z.string().uuid(), full_name: z.string().min(2), phone: z.string().min(10), email: z.string().email().optional().or(z.literal("")) });
const businessSettingsSchema = z.object({ name: z.string().min(2), description: z.string().optional().or(z.literal("")), city: z.string().min(2), district: z.string().min(2), is_active: z.coerce.boolean().optional() });

function normalizeNullable(value: FormDataEntryValue | null) { if (!value) return null; const str = String(value).trim(); return str === "" ? null : str; }
function ensure<T>(parsed: z.SafeParseReturnType<unknown, T>, message: string): T { if (!parsed.success) throw new Error(message); return parsed.data; }
async function throwIfError(error: { message: string } | null) { if (error) throw new Error(error.message); }

export async function upsertServiceAction(formData: FormData): Promise<void> {
  const data = ensure(serviceSchema.safeParse({ id: normalizeNullable(formData.get("id")) ?? undefined, name: formData.get("name"), duration_min: formData.get("duration_min"), price_try: formData.get("price_try"), branch_id: normalizeNullable(formData.get("branch_id")), is_active: formData.get("is_active") === "on" }), "Hizmet verisi geçersiz");
  const supabase = await createClient(); const businessId = getCurrentBusinessId();
  if (data.id) await throwIfError((await supabase.from("services").update({ name: data.name, duration_min: data.duration_min, price_try: data.price_try, branch_id: data.branch_id, is_active: data.is_active ?? true }).eq("id", data.id).eq("business_id", businessId)).error);
  else await throwIfError((await supabase.from("services").insert({ business_id: businessId, name: data.name, duration_min: data.duration_min, price_try: data.price_try, branch_id: data.branch_id, is_active: true })).error);
  revalidatePath("/isletme/hizmetler");
}

export async function deleteServiceAction(id: string): Promise<void> { await throwIfError((await (await createClient()).from("services").delete().eq("id", id).eq("business_id", getCurrentBusinessId())).error); revalidatePath("/isletme/hizmetler"); }

export async function upsertStaffAction(formData: FormData): Promise<void> {
  const data = ensure(staffSchema.safeParse({ id: normalizeNullable(formData.get("id")) ?? undefined, full_name: formData.get("full_name"), phone: formData.get("phone"), branch_id: normalizeNullable(formData.get("branch_id")), is_active: formData.get("is_active") === "on" }), "Personel verisi geçersiz");
  const supabase = await createClient(); const businessId = getCurrentBusinessId();
  if (data.id) await throwIfError((await supabase.from("staff").update({ full_name: data.full_name, phone: data.phone || null, branch_id: data.branch_id, is_active: data.is_active ?? true }).eq("id", data.id).eq("business_id", businessId)).error);
  else await throwIfError((await supabase.from("staff").insert({ business_id: businessId, full_name: data.full_name, phone: data.phone || null, branch_id: data.branch_id, is_active: true })).error);
  revalidatePath("/isletme/personel");
}
export async function deleteStaffAction(id: string): Promise<void> { await throwIfError((await (await createClient()).from("staff").delete().eq("id", id).eq("business_id", getCurrentBusinessId())).error); revalidatePath("/isletme/personel"); }

export async function updateCustomerAction(formData: FormData): Promise<void> {
  const data = ensure(customerSchema.safeParse({ id: formData.get("id"), full_name: formData.get("full_name"), phone: formData.get("phone"), email: formData.get("email") }), "Müşteri verisi geçersiz");
  await throwIfError((await (await createClient()).from("customers").update({ full_name: data.full_name, phone: data.phone, email: data.email || null }).eq("id", data.id).eq("business_id", getCurrentBusinessId())).error);
  revalidatePath("/isletme/musteriler");
}
export async function deleteCustomerAction(id: string): Promise<void> { await throwIfError((await (await createClient()).from("customers").delete().eq("id", id).eq("business_id", getCurrentBusinessId())).error); revalidatePath("/isletme/musteriler"); }

export async function upsertCouponAction(formData: FormData): Promise<void> {
  const data = ensure(couponSchema.safeParse({ id: normalizeNullable(formData.get("id")) ?? undefined, code: formData.get("code"), discount_type: formData.get("discount_type"), discount_value: formData.get("discount_value"), expires_at: formData.get("expires_at"), active: formData.get("active") === "on" }), "Kupon verisi geçersiz");
  const payload = { code: data.code.toUpperCase(), discount_type: data.discount_type, discount_value: data.discount_value, expires_at: data.expires_at ? `${data.expires_at}T23:59:59+03:00` : null, active: data.active ?? true };
  const supabase = await createClient();
  if (data.id) await throwIfError((await supabase.from("coupons").update(payload).eq("id", data.id).eq("business_id", getCurrentBusinessId())).error);
  else await throwIfError((await supabase.from("coupons").insert({ ...payload, business_id: getCurrentBusinessId() })).error);
  revalidatePath("/isletme/kuponlar");
}
export async function deleteCouponAction(id: string): Promise<void> { await throwIfError((await (await createClient()).from("coupons").delete().eq("id", id).eq("business_id", getCurrentBusinessId())).error); revalidatePath("/isletme/kuponlar"); }

export async function upsertBlockedTimeAction(formData: FormData): Promise<void> {
  const data = ensure(blockedSchema.safeParse({ id: normalizeNullable(formData.get("id")) ?? undefined, branch_id: normalizeNullable(formData.get("branch_id")), staff_id: normalizeNullable(formData.get("staff_id")), start_at: formData.get("start_at"), end_at: formData.get("end_at"), reason: formData.get("reason") }), "Bloke zaman verisi geçersiz");
  const payload = { branch_id: data.branch_id, staff_id: data.staff_id, start_at: new Date(data.start_at).toISOString(), end_at: new Date(data.end_at).toISOString(), reason: data.reason || null };
  const supabase = await createClient();
  if (data.id) await throwIfError((await supabase.from("blocked_times").update(payload).eq("id", data.id).eq("business_id", getCurrentBusinessId())).error);
  else await throwIfError((await supabase.from("blocked_times").insert({ ...payload, business_id: getCurrentBusinessId() })).error);
  revalidatePath("/isletme/bloke-zamanlar");
}
export async function deleteBlockedTimeAction(id: string): Promise<void> { await throwIfError((await (await createClient()).from("blocked_times").delete().eq("id", id).eq("business_id", getCurrentBusinessId())).error); revalidatePath("/isletme/bloke-zamanlar"); }

export async function upsertWorkingHoursAction(formData: FormData): Promise<void> {
  const data = ensure(workingHoursSchema.safeParse({ id: normalizeNullable(formData.get("id")) ?? undefined, branch_id: normalizeNullable(formData.get("branch_id")), staff_id: normalizeNullable(formData.get("staff_id")), day_of_week: formData.get("day_of_week"), start_time: formData.get("start_time"), end_time: formData.get("end_time") }), "Çalışma saati verisi geçersiz");
  const payload = { branch_id: data.branch_id, staff_id: data.staff_id, day_of_week: data.day_of_week, start_time: data.start_time, end_time: data.end_time };
  const supabase = await createClient();
  if (data.id) await throwIfError((await supabase.from("working_hours").update(payload).eq("id", data.id).eq("business_id", getCurrentBusinessId())).error);
  else await throwIfError((await supabase.from("working_hours").insert({ ...payload, business_id: getCurrentBusinessId() })).error);
  revalidatePath("/isletme/calisma-saatleri");
}
export async function deleteWorkingHoursAction(id: string): Promise<void> { await throwIfError((await (await createClient()).from("working_hours").delete().eq("id", id).eq("business_id", getCurrentBusinessId())).error); revalidatePath("/isletme/calisma-saatleri"); }

export async function deleteReviewAction(id: string): Promise<void> { await throwIfError((await (await createClient()).from("reviews").delete().eq("id", id).eq("business_id", getCurrentBusinessId())).error); revalidatePath("/isletme/yorumlar"); }

export async function updateBusinessSettingsAction(formData: FormData): Promise<void> {
  const data = ensure(businessSettingsSchema.safeParse({ name: formData.get("name"), description: formData.get("description"), city: formData.get("city"), district: formData.get("district"), is_active: formData.get("is_active") === "on" }), "Ayar verisi geçersiz");
  await throwIfError((await (await createClient()).from("businesses").update({ name: data.name, description: data.description || null, city: data.city, district: data.district, is_active: data.is_active ?? true }).eq("id", getCurrentBusinessId())).error);
  revalidatePath("/isletme/ayarlar");
}
