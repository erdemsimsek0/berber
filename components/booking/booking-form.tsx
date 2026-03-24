"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingInput } from "@/lib/validators/booking";
import { createAppointmentAction } from "@/lib/actions/booking";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BookingForm({ branchId, serviceId }: { branchId: string; serviceId: string }) {
  const [message, setMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { branchId, serviceId }
  });

  const onSubmit = (values: BookingInput) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.append(k, String(v ?? "")));
      const result = await createAppointmentAction(formData);
      setMessage(result.ok ? "Randevunuz alındı. Başarılı sayfasına yönlenebilirsiniz." : result.message);
    });
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("branchId")} />
      <input type="hidden" {...register("serviceId")} />
      <Input type="date" {...register("date")} />
      <p className="text-xs text-red-600">{errors.date?.message}</p>
      <Input type="time" {...register("time")} />
      <p className="text-xs text-red-600">{errors.time?.message}</p>
      <Input placeholder="Ad Soyad" {...register("customerName")} />
      <Input placeholder="Telefon" {...register("customerPhone")} />
      <Input placeholder="E-posta (opsiyonel)" {...register("customerEmail")} />
      <Button disabled={isPending} className="w-full">{isPending ? "Kaydediliyor..." : "Randevuyu Onayla"}</Button>
      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
    </form>
  );
}
