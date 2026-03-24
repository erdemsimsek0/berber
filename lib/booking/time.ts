import { TURKEY_OFFSET } from "@/lib/booking/types";

export function parseLocalDateTimeToUtc(localDate: string, localTime: string): Date {
  // Turkey uses fixed UTC+03:00 in production context.
  return new Date(`${localDate}T${localTime}:00${TURKEY_OFFSET}`);
}

export function formatTimeLabel(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Istanbul"
  }).format(date);
}

export function addMinutes(base: Date, minutes: number): Date {
  return new Date(base.getTime() + minutes * 60 * 1000);
}

export function startOfLocalDayUtc(localDate: string): Date {
  return new Date(`${localDate}T00:00:00${TURKEY_OFFSET}`);
}

export function endOfLocalDayUtc(localDate: string): Date {
  return new Date(`${localDate}T23:59:59${TURKEY_OFFSET}`);
}

export function getDayOfWeekFromLocalDate(localDate: string): number {
  // JS getUTCDay() on Turkey-local midnight preserves intended weekday for UTC+3 conversion.
  return startOfLocalDayUtc(localDate).getUTCDay();
}

export function isOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}
