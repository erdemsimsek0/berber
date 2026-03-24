import { z } from "zod";

export const bookingSchema = z.object({
  branchId: z.string().uuid("Şube seçiniz"),
  serviceId: z.string().uuid("Hizmet seçiniz"),
  staffId: z.preprocess((value) => (value === "" ? null : value), z.string().uuid().nullable().optional()),
  date: z.preprocess((value) => (typeof value === "string" ? value.trim() : value), z.string().min(1, "Tarih seçiniz")),
  time: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Geçerli saat seçiniz")
  ),
  customerName: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string().min(2, "Ad soyad gerekli")
  ),
  customerPhone: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string().regex(/^(\+?90|0)?5\d{9}$/, "Geçerli bir cep telefonu giriniz")
  ),
  customerEmail: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.union([z.literal(""), z.string().email("Geçerli e-posta giriniz")]).optional()
  )
});

export type BookingInput = z.infer<typeof bookingSchema>;
