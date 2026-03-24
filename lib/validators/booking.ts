import { z } from "zod";

export const bookingSchema = z.object({
  branchId: z.string().uuid("Şube seçiniz"),
  serviceId: z.string().uuid("Hizmet seçiniz"),
  staffId: z.preprocess((value) => (value === "" ? null : value), z.string().uuid().nullable().optional()),
  date: z.string().min(1, "Tarih seçiniz"),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Geçerli saat seçiniz"),
  customerName: z.string().min(2, "Ad soyad gerekli"),
  customerPhone: z.string().min(10, "Telefon gerekli"),
  customerEmail: z.string().email("Geçerli e-posta giriniz").optional().or(z.literal(""))
});

export type BookingInput = z.infer<typeof bookingSchema>;
