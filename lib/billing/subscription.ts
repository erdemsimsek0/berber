import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessId } from "@/lib/dashboard/context";
import { PLANS, resolvePlanType, type PlanDefinition, type PlanType } from "@/lib/billing/plans";

export type BusinessSubscription = {
  id: string | null;
  planType: PlanType;
  billingInterval: "monthly" | "yearly";
  isActive: boolean;
  activeUntil: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: string;
};

export async function getBusinessSubscription(businessId = getCurrentBusinessId()): Promise<BusinessSubscription> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("id,plan_type,billing_interval,is_active,active_until,stripe_customer_id,stripe_subscription_id,status")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    id: data?.id ?? null,
    planType: resolvePlanType(data?.plan_type),
    billingInterval: data?.billing_interval === "yearly" ? "yearly" : "monthly",
    isActive: data?.is_active ?? false,
    activeUntil: data?.active_until ?? null,
    stripeCustomerId: data?.stripe_customer_id ?? null,
    stripeSubscriptionId: data?.stripe_subscription_id ?? null,
    status: data?.status ?? "trialing"
  };
}

export async function getBusinessPlan(businessId = getCurrentBusinessId()): Promise<PlanDefinition> {
  const subscription = await getBusinessSubscription(businessId);
  return PLANS[subscription.planType];
}
