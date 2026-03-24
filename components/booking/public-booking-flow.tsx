"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingInput } from "@/lib/validators/booking";
import { createAppointmentAction } from "@/lib/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import type { BusinessListItem } from "@/lib/data/types";

type Props = { business: BusinessListItem };
type SlotResponse = { startAt: string; endAt: string; timeLabel: string; staffIds: string[] };

const steps = ["Hizmet", "Personel", "Tarih/Saat", "Bilgiler", "Onay"];

export function PublicBookingFlow({ business }: Props) {
  const router = useRouter();
  const submittingRef = useRef(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [slots, setSlots] = useState<SlotResponse[]>([]);
  const [slotMessage, setSlotMessage] = useState("");
  const [globalMessage, setGlobalMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      branchId: business.branches[0]?.id ?? "",
      serviceId: business.services[0]?.id ?? "",
      staffId: null,
      date: "",
      time: "",
      customerName: "",
      customerPhone: "",
      customerEmail: ""
    }
  });

  const values = watch();

  const staffOptions = useMemo(
    () => business.staff.filter((staff) => !staff.branch_id || staff.branch_id === values.branchId),
    [business.staff, values.branchId]
  );

  const selectedBranch = business.branches.find((b) => b.id === values.branchId);
  const selectedService = business.services.find((s) => s.id === values.serviceId);
  const selectedStaff = staffOptions.find((s) => s.id === values.staffId);

  async function loadSlots() {
    if (!values.branchId || !values.serviceId || !values.date) {
      setSlotMessage("Önce şube, hizmet ve tarih seçiniz.");
      return;
    }

    setSlotMessage("Uygun saatler yükleniyor...");
    const params = new URLSearchParams({
      businessId: business.id,
      branchId: values.branchId,
      serviceId: values.serviceId,
      date: values.date
    });

    if (values.staffId) params.set("staffId", values.staffId);

    const response = await fetch(`/api/booking/availability?${params.toString()}`, { cache: "no-store" });
    const payload = (await response.json()) as { slots?: SlotResponse[]; error?: string };

    if (!response.ok) {
      setSlotMessage(payload.error ?? "Uygun saatler alınamadı.");
      setSlots([]);
      return;
    }

    const nextSlots = payload.slots ?? [];
    setSlots(nextSlots);
    setSlotMessage(nextSlots.length === 0 ? "Seçimlerinize uygun saat bulunamadı." : "Uygun saatlerden birini seçin.");
  }

  const onSubmit = (formValues: BookingInput) => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    startTransition(async () => {
      const formData = new FormData();
      Object.entries(formValues).forEach(([key, value]) => formData.append(key, String(value ?? "")));

      const result = await createAppointmentAction(formData);
      if (!result.ok) {
        setGlobalMessage(result.message);
        submittingRef.current = false;
        return;
      }

      router.push(`/randevu/basarili?appointmentId=${result.appointmentId}`);
    });
  };

  return (
    <div className="space-y-5">
      <ol className="grid gap-2 sm:grid-cols-5">
        {steps.map((label, index) => (
          <li key={label} className={cn("rounded-2xl border px-3 py-2 text-xs font-semibold", step >= index + 1 ? "border-violet-300/30 bg-violet-500/20 text-violet-100" : "border-white/10 bg-white/5 text-slate-400")}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      <Card className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Hizmet Seçimi</h2>
              <Select {...register("branchId")}>{business.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</Select>
              <Select {...register("serviceId")}>{business.services.map((service) => <option key={service.id} value={service.id}>{service.name} - ₺{service.price_try}</option>)}</Select>
              <Button type="button" onClick={() => setStep(2)}>Devam</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Personel Seçimi</h2>
              <Select value={values.staffId ?? ""} onChange={(event) => setValue("staffId", event.target.value || null)}>
                <option value="">Müsait herhangi biri</option>
                {staffOptions.map((staff) => <option key={staff.id} value={staff.id}>{staff.full_name}</option>)}
              </Select>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Geri</Button>
                <Button type="button" onClick={() => setStep(3)}>Devam</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Tarih ve Saat</h2>
              <Input type="date" {...register("date")} />
              <Button type="button" variant="outline" onClick={loadSlots}>Uygun Saatleri Getir</Button>
              <p className="text-sm">{slotMessage}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {slots.map((slot) => (
                  <button key={slot.startAt} type="button" className={cn("rounded-xl border px-3 py-2 text-sm transition", values.time === slot.timeLabel ? "border-violet-300/40 bg-violet-500/20 text-violet-100" : "border-white/10 bg-white/5 hover:scale-[1.02]")} onClick={() => setValue("time", slot.timeLabel)}>
                    {slot.timeLabel}
                  </button>
                ))}
              </div>
              <p className="text-xs text-rose-300">{errors.time?.message}</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>Geri</Button>
                <Button type="button" onClick={() => setStep(4)}>Devam</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Müşteri Bilgileri</h2>
              <Input placeholder="Ad Soyad" {...register("customerName")} />
              <p className="text-xs text-rose-300">{errors.customerName?.message}</p>
              <Input placeholder="Telefon" {...register("customerPhone")} />
              <p className="text-xs text-rose-300">{errors.customerPhone?.message}</p>
              <Input placeholder="E-posta" {...register("customerEmail")} />
              <p className="text-xs text-rose-300">{errors.customerEmail?.message}</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(3)}>Geri</Button>
                <Button type="button" onClick={() => setStep(5)}>Özeti Gör</Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="text-lg font-semibold">Onay</h2>
              <p><strong>İşletme:</strong> {business.name}</p>
              <p><strong>Şube:</strong> {selectedBranch?.name}</p>
              <p><strong>Hizmet:</strong> {selectedService?.name}</p>
              <p><strong>Personel:</strong> {selectedStaff?.full_name ?? "Müsait herhangi biri"}</p>
              <p><strong>Tarih/Saat:</strong> {values.date} {values.time}</p>
              <p><strong>Müşteri:</strong> {values.customerName} - {values.customerPhone}</p>

              {globalMessage ? <p className="text-sm text-rose-300">{globalMessage}</p> : null}

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(4)}>Geri</Button>
                <Button disabled={isPending || submittingRef.current} type="submit">{isPending ? "Kaydediliyor..." : "Randevuyu Onayla"}</Button>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
