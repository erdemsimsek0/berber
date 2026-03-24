"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingInput } from "@/lib/validators/booking";
import { createAppointmentAction } from "@/lib/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { BusinessListItem } from "@/lib/data/types";

type Props = {
  business: BusinessListItem;
};

type SlotResponse = {
  startAt: string;
  endAt: string;
  timeLabel: string;
  staffIds: string[];
};

const steps = ["Şube", "Hizmet", "Personel", "Tarih/Saat", "Bilgiler", "Onay"];

const fieldClass =
  "h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm transition focus-visible:border-blue-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15";

export function PublicBookingFlow({ business }: Props) {
  const router = useRouter();
  const submittingRef = useRef(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [slots, setSlots] = useState<SlotResponse[]>([]);
  const [slotMessage, setSlotMessage] = useState("");
  const [globalMessage, setGlobalMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BookingInput>({
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

  const staffOptions = useMemo(() => {
    return business.staff.filter((staff) => !staff.branch_id || staff.branch_id === values.branchId);
  }, [business.staff, values.branchId]);

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

      const appointmentId = (result as { appointmentId?: string }).appointmentId;
      if (!appointmentId) {
        setGlobalMessage("Randevu oluşturuldu ancak detay bulunamadı.");
        router.push("/randevu/basarili");
        return;
      }

      router.push(`/randevu/basarili?appointmentId=${appointmentId}`);
    });
  };

  return (
    <div className="space-y-6">
      <ol className="grid gap-2 sm:grid-cols-3">
        {steps.map((label, index) => (
          <li
            key={label}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-medium sm:text-sm",
              step >= index + 1 ? "border-blue-100 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"
            )}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {step === 1 ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Şube Seçimi</h2>
            <select className={fieldClass} {...register("branchId")}>
              {business.branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
            <Button type="button" onClick={() => setStep(2)}>Devam</Button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Hizmet Seçimi</h2>
            <select className={fieldClass} {...register("serviceId")}>
              {business.services.map((service) => (
                <option key={service.id} value={service.id}>{service.name} - ₺{service.price_try}</option>
              ))}
            </select>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>Geri</Button>
              <Button type="button" onClick={() => setStep(3)}>Devam</Button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Personel Seçimi</h2>
            <select
              className={fieldClass}
              value={values.staffId ?? ""}
              onChange={(event) => setValue("staffId", event.target.value || null)}
            >
              <option value="">Müsait herhangi biri</option>
              {staffOptions.map((staff) => (
                <option key={staff.id} value={staff.id}>{staff.full_name}</option>
              ))}
            </select>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>Geri</Button>
              <Button type="button" onClick={() => setStep(4)}>Devam</Button>
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Tarih ve Saat</h2>
            <Input type="date" {...register("date")} />
            <Button type="button" variant="outline" onClick={loadSlots}>Uygun Saatleri Getir</Button>
            <p className="text-sm text-slate-600">{slotMessage}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.map((slot) => (
                <button
                  key={slot.startAt}
                  type="button"
                  className={cn(
                    "rounded-xl border px-2 py-2 text-sm transition",
                    values.time === slot.timeLabel
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white hover:border-slate-400"
                  )}
                  onClick={() => setValue("time", slot.timeLabel)}
                >
                  {slot.timeLabel}
                </button>
              ))}
            </div>
            <p className="text-xs text-red-600">{errors.time?.message}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setStep(3)}>Geri</Button>
              <Button type="button" onClick={() => setStep(5)}>Devam</Button>
            </div>
          </div>
        ) : null}

        {step === 5 ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Müşteri Bilgileri</h2>
            <Input placeholder="Ad Soyad" {...register("customerName")} />
            <p className="text-xs text-red-600">{errors.customerName?.message}</p>
            <Input placeholder="Telefon" {...register("customerPhone")} />
            <p className="text-xs text-red-600">{errors.customerPhone?.message}</p>
            <Input placeholder="E-posta" {...register("customerEmail")} />
            <p className="text-xs text-red-600">{errors.customerEmail?.message}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setStep(4)}>Geri</Button>
              <Button type="button" onClick={() => setStep(6)}>Özeti Gör</Button>
            </div>
          </div>
        ) : null}

        {step === 6 ? (
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <h2 className="text-lg font-semibold">Randevu Özeti</h2>
            <p><strong>İşletme:</strong> {business.name}</p>
            <p><strong>Şube:</strong> {selectedBranch?.name}</p>
            <p><strong>Hizmet:</strong> {selectedService?.name} ({selectedService?.duration_min} dk)</p>
            <p><strong>Personel:</strong> {selectedStaff?.full_name ?? "Müsait herhangi biri"}</p>
            <p><strong>Tarih/Saat:</strong> {values.date} {values.time}</p>
            <p><strong>Müşteri:</strong> {values.customerName} - {values.customerPhone}</p>

            {globalMessage ? <p className="text-sm text-red-600">{globalMessage}</p> : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setStep(5)}>Geri</Button>
              <Button disabled={isPending || submittingRef.current} type="submit">
                {isPending ? "Randevu Oluşturuluyor..." : "Randevuyu Onayla"}
              </Button>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  );
}
