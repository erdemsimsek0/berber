import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/billing/stripe";

export async function POST(req: Request) {
  try {
    const event = await req.json() as {
      type?: string;
      data?: { object?: Record<string, unknown> };
    };

    if (!verifyWebhookSignature()) {
      return NextResponse.json({ error: "Geçersiz webhook imzası" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const object = event.data?.object ?? {};
      const metadata = (object.metadata ?? {}) as Record<string, string>;
      const businessId = metadata.business_id;

      if (!businessId) return NextResponse.json({ ok: true });

      const supabase = await createClient();
      const now = new Date();
      const yearly = metadata.billing_interval === "yearly";
      const activeUntil = new Date(now);
      activeUntil.setMonth(activeUntil.getMonth() + (yearly ? 12 : 1));

      await supabase.from("subscriptions").upsert({
        business_id: businessId,
        plan_code: yearly ? "pro_yearly" : "pro_monthly",
        plan_type: "pro",
        billing_interval: yearly ? "yearly" : "monthly",
        status: "active",
        is_active: true,
        started_at: now.toISOString(),
        active_until: activeUntil.toISOString(),
        stripe_customer_id: String(object.customer ?? ""),
        stripe_subscription_id: String(object.subscription ?? "")
      }, { onConflict: "business_id" });

      await supabase.from("billing_history").insert({
        business_id: businessId,
        amount_try: yearly ? 8999 : 999,
        status: "paid",
        stripe_invoice_id: String(object.invoice ?? ""),
        paid_at: now.toISOString()
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook işlenemedi" }, { status: 500 });
  }
}
