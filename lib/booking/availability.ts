import { createClient } from "@/lib/supabase/server";
import {
  addMinutes,
  endOfLocalDayUtc,
  formatTimeLabel,
  getDayOfWeekFromLocalDate,
  isOverlap,
  parseLocalDateTimeToUtc,
  startOfLocalDayUtc
} from "@/lib/booking/time";
import type {
  AppointmentRecord,
  AvailabilityParams,
  AvailabilitySlot,
  BlockedTimeRecord,
  Interval,
  ServiceRecord,
  StaffRecord,
  WorkingHoursRecord
} from "@/lib/booking/types";

const ACTIVE_APPOINTMENT_STATUSES = ["pending", "confirmed", "completed"] as const;

type SupabaseLike = Awaited<ReturnType<typeof createClient>>;

async function getService(supabase: SupabaseLike, businessId: string, serviceId: string): Promise<ServiceRecord | null> {
  const { data } = await supabase
    .from("services")
    .select("id,business_id,duration_min,is_active")
    .eq("id", serviceId)
    .eq("business_id", businessId)
    .maybeSingle();

  return (data as ServiceRecord | null) ?? null;
}

async function getCandidateStaff(
  supabase: SupabaseLike,
  params: AvailabilityParams,
  specificStaffId: string | null
): Promise<StaffRecord[]> {
  const staffQuery = supabase
    .from("staff")
    .select("id,business_id,branch_id,is_active")
    .eq("business_id", params.businessId)
    .eq("is_active", true);

  if (specificStaffId) {
    staffQuery.eq("id", specificStaffId);
  }

  const { data: staffRows } = await staffQuery;
  const scopedStaff = ((staffRows as StaffRecord[] | null) ?? []).filter(
    (row) => row.branch_id === null || row.branch_id === params.branchId
  );

  if (scopedStaff.length === 0) return [];

  const { data: mappings } = await supabase
    .from("staff_services")
    .select("staff_id, service_id")
    .eq("service_id", params.serviceId)
    .in(
      "staff_id",
      scopedStaff.map((s) => s.id)
    );

  const allowedStaffIds = new Set(((mappings as { staff_id: string }[] | null) ?? []).map((m) => m.staff_id));
  return scopedStaff.filter((s) => allowedStaffIds.has(s.id));
}

async function getWorkingHours(
  supabase: SupabaseLike,
  params: AvailabilityParams,
  staffIds: string[],
  dayOfWeek: number
): Promise<WorkingHoursRecord[]> {
  const { data } = await supabase
    .from("working_hours")
    .select("id,business_id,branch_id,staff_id,day_of_week,start_time,end_time")
    .eq("business_id", params.businessId)
    .eq("day_of_week", dayOfWeek);

  const allRows = (data as WorkingHoursRecord[] | null) ?? [];
  return allRows.filter((row) => {
    if (row.staff_id && !staffIds.includes(row.staff_id)) return false;
    if (row.branch_id && row.branch_id !== params.branchId) return false;
    return true;
  });
}

async function getBlockedTimes(
  supabase: SupabaseLike,
  params: AvailabilityParams,
  staffIds: string[],
  dayStartUtc: Date,
  dayEndUtc: Date
): Promise<BlockedTimeRecord[]> {
  const { data } = await supabase
    .from("blocked_times")
    .select("id,business_id,branch_id,staff_id,start_at,end_at")
    .eq("business_id", params.businessId)
    .lt("start_at", dayEndUtc.toISOString())
    .gt("end_at", dayStartUtc.toISOString());

  const rows = (data as BlockedTimeRecord[] | null) ?? [];
  return rows.filter((row) => {
    if (row.branch_id && row.branch_id !== params.branchId) return false;
    if (row.staff_id && !staffIds.includes(row.staff_id)) return false;
    return true;
  });
}

async function getExistingAppointments(
  supabase: SupabaseLike,
  params: AvailabilityParams,
  staffIds: string[],
  dayStartUtc: Date,
  dayEndUtc: Date
): Promise<AppointmentRecord[]> {
  const { data } = await supabase
    .from("appointments")
    .select("id,business_id,branch_id,staff_id,start_at,end_at,status")
    .eq("business_id", params.businessId)
    .in("status", [...ACTIVE_APPOINTMENT_STATUSES])
    .lt("start_at", dayEndUtc.toISOString())
    .gt("end_at", dayStartUtc.toISOString());

  const rows = (data as AppointmentRecord[] | null) ?? [];
  return rows.filter((row) => {
    if (row.staff_id && !staffIds.includes(row.staff_id)) return false;
    return row.branch_id === params.branchId;
  });
}

function buildWorkingIntervals(localDate: string, rows: WorkingHoursRecord[], staffId: string): Interval[] {
  return rows
    .filter((row) => row.staff_id === staffId || row.staff_id === null)
    .map((row) => ({
      startAt: parseLocalDateTimeToUtc(localDate, row.start_time.slice(0, 5)),
      endAt: parseLocalDateTimeToUtc(localDate, row.end_time.slice(0, 5))
    }))
    .filter((interval) => interval.endAt > interval.startAt)
    .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
}

function isSlotAvailableForStaff(
  startAt: Date,
  endAt: Date,
  staffId: string,
  blocked: BlockedTimeRecord[],
  appointments: AppointmentRecord[]
): boolean {
  const blockedConflict = blocked.some((row) => {
    const applies = row.staff_id === null || row.staff_id === staffId;
    if (!applies) return false;
    return isOverlap(startAt, endAt, new Date(row.start_at), new Date(row.end_at));
  });
  if (blockedConflict) return false;

  const apptConflict = appointments.some((row) => {
    if (row.staff_id !== staffId) return false;
    return isOverlap(startAt, endAt, new Date(row.start_at), new Date(row.end_at));
  });

  return !apptConflict;
}

function generateSlotsForStaff(
  interval: Interval,
  staffId: string,
  durationMin: number,
  slotIntervalMin: number,
  blocked: BlockedTimeRecord[],
  appointments: AppointmentRecord[]
): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];

  let cursor = new Date(interval.startAt);
  while (cursor < interval.endAt) {
    const slotEnd = addMinutes(cursor, durationMin);
    if (slotEnd > interval.endAt) break;

    if (isSlotAvailableForStaff(cursor, slotEnd, staffId, blocked, appointments)) {
      slots.push({
        startAt: new Date(cursor),
        endAt: slotEnd,
        timeLabel: formatTimeLabel(cursor),
        staffIds: [staffId]
      });
    }

    cursor = addMinutes(cursor, slotIntervalMin);
  }

  return slots;
}

function mergeSlotsByStart(slots: AvailabilitySlot[]): AvailabilitySlot[] {
  const map = new Map<number, AvailabilitySlot>();

  for (const slot of slots) {
    const key = slot.startAt.getTime();
    const found = map.get(key);
    if (!found) {
      map.set(key, { ...slot, staffIds: [...slot.staffIds] });
      continue;
    }

    const mergedStaff = new Set([...found.staffIds, ...slot.staffIds]);
    found.staffIds = Array.from(mergedStaff);
  }

  return Array.from(map.values()).sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
}

export async function getAvailableSlots(params: AvailabilityParams): Promise<AvailabilitySlot[]> {
  const supabase = await createClient();
  const slotIntervalMin = params.slotIntervalMin ?? 15;

  const service = await getService(supabase, params.businessId, params.serviceId);
  if (!service || !service.is_active) return [];

  const candidateStaff = await getCandidateStaff(supabase, params, params.staffId ?? null);
  if (candidateStaff.length === 0) return [];

  const dayOfWeek = getDayOfWeekFromLocalDate(params.date);
  const dayStartUtc = startOfLocalDayUtc(params.date);
  const dayEndUtc = endOfLocalDayUtc(params.date);

  const staffIds = candidateStaff.map((staff) => staff.id);

  const [workingHours, blockedTimes, appointments] = await Promise.all([
    getWorkingHours(supabase, params, staffIds, dayOfWeek),
    getBlockedTimes(supabase, params, staffIds, dayStartUtc, dayEndUtc),
    getExistingAppointments(supabase, params, staffIds, dayStartUtc, dayEndUtc)
  ]);

  const allSlots: AvailabilitySlot[] = [];

  for (const staff of candidateStaff) {
    const intervals = buildWorkingIntervals(params.date, workingHours, staff.id);

    for (const interval of intervals) {
      const staffSlots = generateSlotsForStaff(
        interval,
        staff.id,
        service.duration_min,
        slotIntervalMin,
        blockedTimes,
        appointments
      );

      allSlots.push(...staffSlots);
    }
  }

  return mergeSlotsByStart(allSlots);
}

export async function resolveBookableSlot(params: AvailabilityParams & { time: string }) {
  const slots = await getAvailableSlots(params);
  const targetStart = parseLocalDateTimeToUtc(params.date, params.time);

  const found = slots.find((slot) => slot.startAt.getTime() === targetStart.getTime());
  if (!found) return null;

  return {
    startAt: found.startAt,
    endAt: found.endAt,
    staffId: params.staffId ?? found.staffIds[0]
  };
}
