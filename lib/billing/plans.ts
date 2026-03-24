export type PlanType = "free" | "pro";

export type PlanDefinition = {
  key: PlanType;
  name: string;
  maxStaff: number | null;
  maxAppointmentsPerMonth: number | null;
  analytics: boolean;
};

export const PLANS: Record<PlanType, PlanDefinition> = {
  free: {
    key: "free",
    name: "FREE",
    maxStaff: 1,
    maxAppointmentsPerMonth: 50,
    analytics: false
  },
  pro: {
    key: "pro",
    name: "PRO",
    maxStaff: null,
    maxAppointmentsPerMonth: null,
    analytics: true
  }
};

export function resolvePlanType(value: string | null | undefined): PlanType {
  return value === "pro" ? "pro" : "free";
}
