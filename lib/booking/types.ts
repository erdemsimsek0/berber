export const TURKEY_TIMEZONE = "Europe/Istanbul";
export const TURKEY_OFFSET = "+03:00";

export type Interval = {
  startAt: Date;
  endAt: Date;
};

export type AvailabilitySlot = {
  startAt: Date;
  endAt: Date;
  timeLabel: string;
  staffIds: string[];
};

export type AvailabilityParams = {
  businessId: string;
  branchId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD local business date
  staffId?: string | null;
  slotIntervalMin?: number;
};

export type ServiceRecord = {
  id: string;
  business_id: string;
  duration_min: number;
  is_active: boolean;
};

export type StaffRecord = {
  id: string;
  business_id: string;
  branch_id: string | null;
  is_active: boolean;
};

export type WorkingHoursRecord = {
  id: string;
  business_id: string;
  branch_id: string | null;
  staff_id: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
};

export type BlockedTimeRecord = {
  id: string;
  business_id: string;
  branch_id: string | null;
  staff_id: string | null;
  start_at: string;
  end_at: string;
};

export type AppointmentRecord = {
  id: string;
  business_id: string;
  branch_id: string;
  staff_id: string | null;
  start_at: string;
  end_at: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
};
