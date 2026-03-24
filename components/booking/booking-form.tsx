"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingInput } from "@/lib/validators/booking";
import { createAppointmentAction } from "@/lib/actions/booking";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BookingForm({ branchId, serviceId }: { branchId: string; serviceId: string }) {
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { branchId, serviceId, staffId: null }
  });

  const onSubmit = (values: BookingInput) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, String(value ?? "")));

      const result = await createAppointmentAction(formData);
      if (!result.ok) {
        setIsSuccess(false);
        setMessage(result.message);
        return;
      }

      setIsSuccess(true);
      setMessage("Randevunuz başarıyla alındı.");
    });
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("branchId")} />
      <input type="hidden" {...register("serviceId")} />
      <input type="hidden" {...register("staffId")} />

      <div>
        <label className="mb-1 block text-sm">Tarih</label>
        <Input type="date" {...register("date")} />
        <p className="text-xs text-red-600">{errors.date?.message}</p>
      </div>

      <div>
        <label className="mb-1 block text-sm">Saat</label>
        <Input type="time" {...register("time")} />
        <p className="text-xs text-red-600">{errors.time?.message}</p>
      </div>

      <Input placeholder="Ad Soyad" {...register("customerName")} />
      <Input placeholder="Telefon" {...register("customerPhone")} />
      <Input placeholder="E-posta (opsiyonel)" {...register("customerEmail")} />

      <Button disabled={isPending} className="w-full">
        {isPending ? "Kaydediliyor..." : "Randevuyu Onayla"}
      </Button>

      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
      {isSuccess ? (
        <Button asChild variant="outline" className="w-full">
          <Link href="/randevu/basarili">Başarı Sayfasına Git</Link>
        </Button>
      ) : null}
    </form>
  );
}
